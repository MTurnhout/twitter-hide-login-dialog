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
      var validationMessage = chrome.i18n.getMessage(
        "options_validation_input_mandatory"
      );
      this.#showValidation(validationMessage);
      return;
    }

    const saveMessage = chrome.i18n.getMessage("options_save_success");
    chrome.storage.sync.set(
      {
        options: { loginButtonText },
      },
      () => {
        this.#showValidation(saveMessage, true);
      }
    );
  }

  /**
   * Set localized content in options page.
   */
  setLocalizedText() {
    document.title = chrome.i18n.getMessage("options_page_title");
    document.getElementById("pageHeader").textContent = chrome.i18n.getMessage(
      "options_page_header"
    );
    document.getElementById("loginButtonTextLabel").textContent =
      chrome.i18n.getMessage("options_page_input_login_button_text_label");
    document.getElementById("loginButtonTextInfo").textContent =
      chrome.i18n.getMessage("options_page_input_login_button_text_info");
    document.getElementById("saveButton").textContent = chrome.i18n.getMessage(
      "options_page_save_button_text"
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
document.addEventListener("DOMContentLoaded", () => {
  options.restoreOptions();
  options.setLocalizedText();
});

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
