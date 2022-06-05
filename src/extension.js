const loginUrlRegEx = /^\/(?:i\/|login).*/;
const observerLayers = new MutationObserver(hideLoginLayer);
let observerParent;

window.addEventListener('load', checkUntilLayersExist);

/**
 * Wait till React application is done loading and
 * start observing layers elements.
 */
function checkUntilLayersExist() {
    const checkExistInterval = setInterval(() => {
        const layersElement = document.getElementById("layers");
        if (layersElement) {
            clearInterval(checkExistInterval);
            
            observerLayers.disconnect();
            observerLayers.observe(layersElement, { childList: true });
            
            if (!observerParent) {
                observerParent = new MutationObserver(checkUntilLayersExist);
                observerParent.observe(layersElement.parentNode, { childList: true });
            }
        }
    }, 100);
}

/**
 * Hide layer that contains login on appropriate pages.
 */
function hideLoginLayer() {
    if (loginUrlRegEx.test(window.location.pathname))
        return;

    const layersElement = document.getElementById("layers");
    const loginButton = document.evaluate(
        ".//div[@role='dialog']//span[text()='Log in']",
        layersElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;

    if (loginButton) {
        const loginLayer = loginButton.closest("#layers > div");
        loginLayer.style.display = "none";
        
        document.documentElement.style.overflow = "auto";
    }
}
