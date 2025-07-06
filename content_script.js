browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getMediaType") {
    const hasVideo = !!document.querySelector("video");
    sendResponse({ mediaType: hasVideo ? "Video" : "Audio" });
  }
});
