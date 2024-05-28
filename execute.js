// This function will be stringified and injected into the page
function injectedFunction() {
    if (typeof mw !== 'undefined' && mw.eventLog && mw.eventLog.eventInSample) {
        if (!mw.eventLog.eventInSample(1 / 0.01)) {
            window.postMessage({ type: "FROM_PAGE", action: "reload" }, "*");
        } else {
            alert('yay');
        }
    } else {
        console.log("mw object or mw.eventLog.eventInSample function not available.");
    }
}

// Convert the function to a string and inject it into the page
const scriptContent = `(${injectedFunction.toString()})();`;
const script = document.createElement('script');
script.textContent = scriptContent;
(document.head || document.documentElement).appendChild(script);
script.remove();

// Listen for messages from the page and take action
window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source !== window)
        return;

    if (event.data.type && event.data.type === "FROM_PAGE" && event.data.action === "reload") {
        chrome.runtime.sendMessage({ action: "checkCondition" });
    }
});
