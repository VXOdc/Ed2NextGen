const form = document.querySelector("#applicationForm");
const statusText = document.querySelector("#formStatus");
const submitButton = document.querySelector("#submitButton");

if (form) {
  function valuesFor(name) {
    return Array.from(form.querySelectorAll(`[name="${name}"]:checked`)).map(
      (item) => item.value
    );
  }

  function fieldValue(name) {
    const field = form.elements[name];
    return field ? field.value.trim() : "";
  }

  function buildEmailBody() {
    const interests = valuesFor("Interests");

    return [
      "Ed2NextGen Student Volunteer Application",
      "",
      `Full name: ${fieldValue("Full name")}`,
      `Email: ${fieldValue("Email")}`,
      `School: ${fieldValue("School")}`,
      `Grade: ${fieldValue("Grade")}`,
      `City and state: ${fieldValue("Location")}`,
      `Weekly availability: ${fieldValue("Weekly availability")}`,
      `Areas of interest: ${interests.length ? interests.join(", ") : "Not selected"}`,
      "",
      "Why I want to join:",
      fieldValue("Why join"),
      "",
      "Skills or experiences I can contribute:",
      fieldValue("Skills"),
      "",
      `Parent/guardian contact, if under 18: ${fieldValue("Parent or guardian contact") || "Not provided"}`,
      "",
      "Agreement: I understand Ed2NextGen reviews applications and volunteer records before approval.",
    ].join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      statusText.textContent =
        "Please complete the required fields before sending.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Preparing email...";
    statusText.textContent = "Opening your email app with the application.";

    const subject = encodeURIComponent(
      `Ed2NextGen Application - ${fieldValue("Full name")}`
    );
    const body = encodeURIComponent(buildEmailBody());
    window.location.href = `mailto:ed2nextgen@gmail.com?subject=${subject}&body=${body}`;

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Open email application";
      statusText.textContent =
        "If your email app did not open, email ed2nextgen@gmail.com and include your application details.";
    }, 1400);
  });
}
