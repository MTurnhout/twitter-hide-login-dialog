const loginUrlRegEx = /^https:\/\/twitter.com\/(?:i\/|login).*/;
const photoUrlRegEx = /.*\/photo\/\d+$/;
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

    if (!loginUrlRegEx.test(details.url) &&
        !photoUrlRegEx.test(details.url)) {
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
    details => {
        updateCss(details);

        if (photoUrlRegEx.test(details.url)) {
            // Remove login pop-up on top of photo
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                func: () => {
                    const spanSearchResult = document.querySelectorAll("#layers div[role=group] div[role=button] span");
                    const loginButton = Array.from(spanSearchResult).find(el => el.innerHTML === "Log in");
                    if (loginButton) {
                        const parentGroup = loginButton.closest("div[role=group]");
                        parentGroup.style.display = "none";
                    }
                }
            });
        }
    },
    filter
);