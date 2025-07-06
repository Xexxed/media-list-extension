let mediaTabs = [];

function updateMediaTabs() {
  browser.tabs.query({ audible: true }).then((audibleTabs) => {
    const audibleTabIds = audibleTabs.map((tab) => tab.id);
    mediaTabs = mediaTabs.filter((mediaTab) =>
      audibleTabIds.includes(mediaTab.id)
    );

    audibleTabs.forEach((tab) => {
      const existingTab = mediaTabs.find((mediaTab) => mediaTab.id === tab.id);
      if (!existingTab) {
        browser.tabs
          .executeScript(tab.id, {
            file: "/content_script.js",
          })
          .then(() => {
            browser.tabs
              .sendMessage(tab.id, { command: "getMediaType" })
              .then((response) => {
                if (response) {
                  mediaTabs.push({
                    id: tab.id,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                    mediaType: response.mediaType,
                  });
                }
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    });
  });
}

browser.tabs.onUpdated.addListener(updateMediaTabs);
browser.tabs.onRemoved.addListener(updateMediaTabs);

setInterval(updateMediaTabs, 2000);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getMediaTabs") {
    sendResponse({ mediaTabs: mediaTabs });
  }
});
