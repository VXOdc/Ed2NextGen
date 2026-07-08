(function () {
  const data = window.Ed2Data || {};

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initStats() {
    const stats = data.stats || {};
    document.querySelectorAll("[data-stat]").forEach((el) => {
      const key = el.dataset.stat;
      const value = stats[key] ?? 0;
      animateValue(el, value, 1400);
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item) => observer.observe(item));
  }

  function categoryLabel(id) {
    const match = (data.categories || []).find((c) => c.id === id);
    return match ? match.label : id;
  }

  function renderResourceCard(resource) {
    const cover = resource.cover
      ? `<img src="${resource.cover}" alt="">`
      : `<span class="placeholder-icon" aria-hidden="true">📚</span>`;

    return `
      <article class="resource-card reveal">
        <div class="resource-cover">${cover}</div>
        <div class="resource-body">
          <span class="resource-category">${categoryLabel(resource.category)}</span>
          <h3>${resource.title}</h3>
          <p class="resource-author">By ${resource.authors}</p>
          <p>${resource.description}</p>
          <a class="button primary" href="${resource.downloadUrl || "#"}" ${resource.downloadUrl ? 'download' : ""}>
            Download
          </a>
        </div>
      </article>
    `;
  }

  function initLibrary() {
    const grid = document.querySelector("#libraryGrid");
    const filters = document.querySelector("#categoryFilters");
    if (!grid) return;

    const resources = data.library || [];

    if (!resources.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="icon" aria-hidden="true">📚</div>
          <h3>Library coming soon</h3>
          <p>Our first student-created resources are being reviewed. Check back soon, or become a volunteer and help us build the library.</p>
          <a class="button primary" href="volunteer.html">Become a Volunteer</a>
        </div>
      `;
      if (filters) filters.style.display = "none";
      return;
    }

    let active = "all";

    function render() {
      const filtered =
        active === "all"
          ? resources
          : resources.filter((r) => r.category === active);
      grid.innerHTML = filtered.length
        ? filtered.map(renderResourceCard).join("")
        : `<div class="empty-state" style="grid-column: 1 / -1;"><h3>No resources in this category yet</h3></div>`;
      initReveal();
    }

    if (filters) {
      filters.innerHTML = (data.categories || [])
        .map(
          (cat) =>
            `<button class="filter-btn${cat.id === "all" ? " active" : ""}" data-category="${cat.id}">${cat.label}</button>`
        )
        .join("");

      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-category]");
        if (!btn) return;
        active = btn.dataset.category;
        filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render();
      });
    }

    render();
  }

  function initFeatured() {
    const grid = document.querySelector("#featuredGrid");
    if (!grid) return;

    const resources = (data.library || []).slice(0, 3);
    if (!resources.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="icon" aria-hidden="true">✨</div>
          <h3>Featured resources coming soon</h3>
          <p>Student volunteers are creating the first books and guides for our library. Be among the first contributors.</p>
          <a class="button secondary" href="volunteer.html">Join as a Volunteer</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = resources.map(renderResourceCard).join("");
    initReveal();
  }

  function initContributors() {
    const tableBody = document.querySelector("#contributorsBody");
    const spotlight = document.querySelector("#spotlightCard");
    if (!tableBody) return;

    const contributors = data.contributors || [];

    if (!contributors.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;padding:48px 20px;color:var(--muted);">
            No contributors yet. Approved volunteers will appear here once their work is published.
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = contributors
        .map(
          (c) => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.school}</td>
          <td>${c.contribution}</td>
          <td>${c.year}</td>
        </tr>
      `
        )
        .join("");
    }

    if (spotlight) {
      const s = data.spotlight;
      if (!s) {
        spotlight.innerHTML = `
          <div class="empty-state">
            <div class="icon" aria-hidden="true">⭐</div>
            <h3>Volunteer Spotlight</h3>
            <p>We'll feature an outstanding volunteer here each month once resources are published.</p>
          </div>
        `;
      } else {
        const initials = s.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2);
        spotlight.innerHTML = `
          <div class="spotlight-card reveal">
            <div class="spotlight-avatar" aria-hidden="true">${initials}</div>
            <div>
              <span class="spotlight-badge">Volunteer of the Month</span>
              <h3>${s.name}</h3>
              <p class="muted" style="margin:0 0 8px;">${s.school}</p>
              <p style="margin:0;">${s.bio}</p>
            </div>
          </div>
        `;
      }
    }
  }

  function initContactForm() {
    const form = document.querySelector("#contactForm");
    const status = document.querySelector("#contactStatus");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const topic = form.elements.topic.value;
      const message = form.elements.message.value.trim();
      const subject = encodeURIComponent(`Ed2NextGen — ${topic}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
      );
      window.location.href = `mailto:${data.contact?.email || "ed2nextgen@gmail.com"}?subject=${subject}&body=${body}`;
      if (status) {
        status.textContent =
          "Opening your email app. If it didn't open, email us directly at ed2nextgen@gmail.com.";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initStats();
    initReveal();
    initLibrary();
    initFeatured();
    initContributors();
    initContactForm();
  });
})();
