chrome.action.onClicked.addListener((tab) => {
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['execute.js']
        });
    } else {
        console.log("Cannot run the extension on chrome:// URLs.");
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkCondition") {
        chrome.tabs.reload(sender.tab.id);
    } else if (message.action === 'copyToClipboard') {
        // Get the active tab
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const activeTab = tabs[0];
            // Execute the clipboard write operation in the context of the active tab
            chrome.scripting.executeScript({
                target: {tabId: activeTab.id},
                function: (text) => {
                    navigator.clipboard.writeText(text).then(() => {
                        window.alert('Text copied to clipboard!');
                    }).catch(err => {
                        console.error('Failed to copy text:', err);
                    });
                },
                args: [message.text]
            });
        });
    }
    return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab && tab.url && !tab.url.startsWith('chrome://')) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['execute.js']
        });
    }
});
