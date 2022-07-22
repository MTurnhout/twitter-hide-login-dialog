import { TwitterHideLoginDialogAddonOptions } from "./js/TwitterHideLoginDialogAddonOptions.js";

document.addEventListener("DOMContentLoaded", () => {
  const options = new TwitterHideLoginDialogAddonOptions();

  options.restoreOptions();
  options.setLocalizedText();

  document.getElementById("saveButton").addEventListener("click", () => {
    options.saveOptions();
  });

  document
    .getElementById("loginButtonTextInput")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        options.saveOptions();
      }
    });
});
