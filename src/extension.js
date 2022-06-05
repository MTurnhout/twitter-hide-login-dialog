const loginUrlRegEx = /^\/(?:i\/|login).*/;
const observerLayers = new MutationObserver(onLayersMutations);
let observerParent;
let layersElement;

window.addEventListener('load', checkUntilLayersExist);

/**
 * Wait till React application is done loading and
 * start observing layers elements and parent.
 */
function checkUntilLayersExist() {
    const checkExistInterval = setInterval(() => {
        layersElement = document.getElementById("layers");
        if (layersElement) {
            clearInterval(checkExistInterval);

            startObservingLayersAndParent();
        }
    }, 100);
}

/**
 * Start observing layers elements and parent.
 */
function startObservingLayersAndParent() {
    observerLayers.observe(layersElement, { childList: true });
    
    if (!observerParent) {
        observerParent = new MutationObserver(onLayersParentMutations);
        observerParent.observe(layersElement.parentNode, { childList: true });
    }
}

/**
 * Monitor if login dialog is added and hide on appropriate page.
 * @param {MutationRecord[]} mutations 
 */
function onLayersMutations(mutations) {
    if (loginUrlRegEx.test(window.location.pathname))
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
function onLayersParentMutations(mutations) {
    for (const mutation of mutations) {
        for (const removedNode of mutation.removedNodes) {
            if (removedNode === layersElement) {
                observerLayers.disconnect();
                checkUntilLayersExist();
            }
        }
    }
}