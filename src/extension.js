/**
 * Twitter hide login dialog add-on functionality.
 */
class TwitterHideLoginDialogAddon {
  /** @type {RegExp} */
  static #loginUrlRegEx = /^\/(?:i\/|login).*/;

  /** @type {MutationObserver} */
  #observerHtmlStyle;

  /** @type {{loginButtonText: string}} */
  #options = {};

  constructor() {
    this.#restoreOptions();
  }

  /**
   * Start hiding login dialog on appropriate pages.
   */
  start() {
    this.#observerHtmlStyle = new MutationObserver(() => {
      this.#hideLoginDialog();
    });

    this.#observerHtmlStyle.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  /**
   * Hide login dialog on appropriate pages.
   */
  #hideLoginDialog() {
    if (document.documentElement.style.overflow === "auto") {
      return;
    }

    if (
      TwitterHideLoginDialogAddon.#loginUrlRegEx.test(window.location.pathname)
    ) {
      return;
    }

    const layerElement = document.getElementById("layers");
    if (!layerElement) {
      return;
    }

    const loginButtonText = this.#options.loginButtonText?.replace(
      /'/g,
      `',"'",'`
    );
    if (!loginButtonText) {
      return;
    }

    const loginButtonElement = document.evaluate(
      `.//div[@role='dialog']//span[text()=concat('${loginButtonText}','')]`,
      layerElement,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (!loginButtonElement) {
      return;
    }

    const loginLayerELement = loginButtonElement.closest("#layers > div");
    if (loginLayerELement.style.display === "none") {
      return;
    }

    loginLayerELement.style.display = "none";
    document.documentElement.style.overflow = "auto";
  }

  /**
   * Restore options from chrome.storage.
   */
  #restoreOptions() {
    chrome.storage.sync.get(
      { options: { loginButtonText: "Log in" } },
      (data) => {
        Object.assign(this.#options, data.options);
      }
    );

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.options?.newValue) {
        Object.assign(this.#options, changes.options.newValue);
        this.#hideLoginDialog();
      }
    });
  }
}

const twitterHideLoginDialogAddon = new TwitterHideLoginDialogAddon();
window.addEventListener("load", () => {
  twitterHideLoginDialogAddon.start();
});
