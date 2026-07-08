/**
 * Site content — edit this file to update stats, library resources,
 * contributor profiles, and spotlight without touching page HTML.
 */
window.Ed2Data = {
  stats: {
    volunteers: 0,
    booksPublished: 0,
    resources: 0,
    schoolsReached: 0,
  },

  contact: {
    email: "ed2nextgen@gmail.com",
    googleFormUrl: "https://forms.gle/PLACEHOLDER",
  },

  categories: [
    { id: "all", label: "All Resources" },
    { id: "childrens-books", label: "Children's Books" },
    { id: "science", label: "Science" },
    { id: "history", label: "History" },
    { id: "language", label: "Language Learning" },
    { id: "activities", label: "Activity Books" },
    { id: "study-guides", label: "Study Guides" },
  ],

  // Add published resources here when ready.
  // Example:
  // library: [
  //   {
  //     title: "The Amazing Water Cycle",
  //     authors: "Jane Smith",
  //     category: "science",
  //     description: "A colorful guide to how water moves through our planet.",
  //     cover: "assets/covers/water-cycle.png",
  //     downloadUrl: "downloads/water-cycle.pdf",
  //   },
  // ],
  library: [],

  // Add approved contributors here when ready.
  // Example:
  // contributors: [
  //   { name: "Jane Smith", school: "Lincoln High School", contribution: "The Amazing Water Cycle", year: "2026" },
  // ],
  contributors: [],

  // Set when you want to feature a volunteer of the month.
  // Example:
  // spotlight: {
  //   name: "Jane Smith",
  //   school: "Lincoln High School",
  //   bio: "Jane wrote our first published science guide and inspires other volunteers to get started.",
  // },
  spotlight: null,
};
