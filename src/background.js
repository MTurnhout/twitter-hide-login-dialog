const filter = {
    url: [
        {
            hostSuffix: "twitter.com"
        }
    ]
};

function updateCss(details) {
    chrome.scripting.removeCSS({
        files: ["extension.css"],
        target: {
            tabId: details.tabId
        }
    });

    if (!details.url.startsWith("https://twitter.com/i/") &&
        !details.url.startsWith("https://twitter.com/login")) {
        chrome.scripting.insertCSS({
            files: ["extension.css"],
            target: {
                tabId: details.tabId
            }
        });
    }
}

chrome.webNavigation.onCompleted.addListener(
    updateCss,
    filter
);
chrome.webNavigation.onHistoryStateUpdated.addListener(
    updateCss,
    filter
);