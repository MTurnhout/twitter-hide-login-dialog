/**
 * Twitter hide login dialog add-on functionality.
 */
class TwitterHideLoginDialogAddon {
    /** @type {RegExp} */
    static #loginUrlRegEx = /^\/(?:i\/|login).*/;

    /** @type {MutationObserver} */
    #observerHtmlStyle;

    /**
     * Hide login dialog on appropriate pages.
     */
    start() {
        this.#observerHtmlStyle = new MutationObserver(() => {
            if (document.documentElement.style.overflow !== "auto") {
                if (TwitterHideLoginDialogAddon.#loginUrlRegEx.test(window.location.pathname))
                    return;

                const layerElement = document.getElementById("layers");
                if (layerElement) {
                    const loginButtonElement = document.evaluate(
                        ".//div[@role='dialog']//span[text()='Log in']",
                        layerElement,
                        null,
                        XPathResult.ANY_UNORDERED_NODE_TYPE,
                        null).singleNodeValue;
                
                    if (loginButtonElement) {
                        const loginLayerELement = loginButtonElement.closest("#layers > div");
                        if (loginLayerELement.style.display !== "none") {
                            loginLayerELement.style.display = "none";
                        
                            document.documentElement.style.overflow = "auto";
                        }
                    }
                }
            }
        });
        this.#observerHtmlStyle.observe(
            document.documentElement,
            { attributes: true, attributeFilter: ["style"] });
    }
}

const twitterHideLoginDialogAddon = new TwitterHideLoginDialogAddon();
window.addEventListener('load', () => {
    twitterHideLoginDialogAddon.start();
});
