chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("www.imdb.com/title")) {
        console.log("Found imdb website");
        const match = tab.url.match(/\/title\/(tt[0-9]+)\/reviews/);
        if (match && match[1]) {
            console.log("we are here");
            const imdbId = match[1];
            console.log("IMDb ID:", imdbId);

            console.log("Sending message to content script");

            chrome.tabs.sendMessage(tabId, {
                type : "NEW", 
                imdbId: imdbId
            })

        }

    }
})


