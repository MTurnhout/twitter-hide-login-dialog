/**
 * Twitter hide login dialog add-on options.
 */
class TwitterHideLoginDialogAddonOptions {
  /**
   * Restore options from chrome.storage.
   */
  restoreOptions() {
    chrome.storage.sync.get(
      {
        options: { loginButtonText: "Log in" },
      },
      (data) => {
        document.getElementById("loginButtonTextInput").value =
          data.options.loginButtonText;
      }
    );
  }

  /**
   * Saves options to chrome.storage.
   */
  saveOptions() {
    var loginButtonText = document
      .getElementById("loginButtonTextInput")
      .value?.trim();
    if (!loginButtonText) {
      this.#showValidation("Input is mandatory.");
      return;
    }
    chrome.storage.sync.set(
      {
        options: { loginButtonText },
      },
      () => {
        this.#showValidation("Options saved.", true);
      }
    );
  }

  /**
   * Shows validation message.
   * @param {string} text
   * @param {boolean} isValid
   */
  #showValidation(text, isValid = false) {
    var status = document.getElementById("status");
    status.className = isValid ? "valid-feedback" : "invalid-feedback";
    status.textContent = text;
    setTimeout(function () {
      status.textContent = "";
    }, 750);
  }
}

const options = new TwitterHideLoginDialogAddonOptions();
document.addEventListener("DOMContentLoaded", options.restoreOptions);
document
  .getElementById("saveButton")
  .addEventListener("click", options.saveOptions);
document
  .getElementById("loginButtonTextInput")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      options.saveOptions();
    }
  });
