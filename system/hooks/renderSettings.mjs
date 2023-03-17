export function renderSettings(app, html, data) {

  // Add a button to the settings page to open the Black Flag Feedback Form
  const feedbackFormButton = document.createElement("button");
  feedbackFormButton.type = "button";
  feedbackFormButton.classList.add("open-feedback-form");
  feedbackFormButton.innerHTML = "<i class=\"fa-solid fa-flag\"></i> Open Black Flag Feedback Form";
  feedbackFormButton.addEventListener("click", () => {
    window.open("https://koboldpress.com/project-black-flag-playtest-packet-1-feedback/", "_blank");
  });
  html.find("button[data-action=\"wiki\"]").after(feedbackFormButton);
}
