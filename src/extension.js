/**
 * Twitter hide login dialog add-on functionality.
 */
class TwitterHideLoginDialogAddon {
    static #loginUrlRegEx = /^\/(?:i\/|login).*/;
    #observerLayers;
    #observerParent;
    #layersElement;

    /**
     * Hide login dialog on appropriate pages.
     */
    hide() {
        this.#checkUntilLayersExist();
    }

    /**
     * Wait till React application is done loading and
     * start observing layers elements and parent.
     */
    #checkUntilLayersExist() {
        const checkExistInterval = setInterval(() => {
            this.#layersElement = document.getElementById("layers");
            if (this.#layersElement) {
                clearInterval(checkExistInterval);

                this.#startObservingLayersAndParent();
            }
        }, 100);
    }
    
    /**
     * Start observing layers elements and parent.
     */
    #startObservingLayersAndParent() {
        if (!this.#observerLayers) {
            this.#observerLayers = new MutationObserver((mutations) => {
                this.#onLayersMutations(mutations);
            });
        }
        this.#observerLayers.observe(this.#layersElement, { childList: true });
        
        if (!this.#observerParent) {
            this.#observerParent = new MutationObserver((mutations) => {
                this.#onLayersParentMutations(mutations);
            });
            this.#observerParent.observe(this.#layersElement.parentNode, { childList: true });
        }
    }

    /**
     * Monitor if login dialog is added and hide on appropriate pages.
     * @param {MutationRecord[]} mutations
     */
    #onLayersMutations(mutations) {
        if (TwitterHideLoginDialogAddon.#loginUrlRegEx.test(window.location.pathname))
            return;

        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                const isLoginDialog = document.evaluate(
                    ".//div[@role='dialog']//span[text()='Log in']",
                    addedNode,
                    null,
                    XPathResult.BOOLEAN_TYPE,
                    null).booleanValue;
            
                if (isLoginDialog) {
                    addedNode.style.display = "none";
                    
                    document.documentElement.style.overflow = "auto";
                }
            }
        }
    }
    
    /**
     * Monitor if layers element is removed and observe new layers element.
     * @param {MutationRecord[]} mutations
     */
    #onLayersParentMutations(mutations) {
        for (const mutation of mutations) {
            for (const removedNode of mutation.removedNodes) {
                if (removedNode === this.#layersElement) {
                    this.#observerLayers.disconnect();
                    this.#checkUntilLayersExist();
                }
            }
        }
    }
}

const twitterHideLoginDialogAddon = new TwitterHideLoginDialogAddon();
window.addEventListener('load', () => {
    twitterHideLoginDialogAddon.hide();
});
