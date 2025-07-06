function updatePopup() {
  browser.runtime
    .sendMessage({ command: "getMediaTabs" })
    .then((response) => {
      const mediaList = document.getElementById("media-list");
      mediaList.innerHTML = "";

      if (response.mediaTabs && response.mediaTabs.length > 0) {
        response.mediaTabs.forEach((tab) => {
          const tabElement = document.createElement("div");
          tabElement.className = "media-item";

          const favIcon = document.createElement("img");
          favIcon.src = tab.favIconUrl || "../icons/icon-48.png";
          favIcon.className = "favicon";
          tabElement.appendChild(favIcon);

          const tabTitle = document.createElement("span");
          tabTitle.textContent = `${tab.title} (${tab.mediaType})`;
          tabElement.appendChild(tabTitle);

          tabElement.addEventListener("click", () => {
            browser.tabs.update(tab.id, { active: true });
          });

          mediaList.appendChild(tabElement);
        });
      } else {
        mediaList.textContent = "No media playing.";
      }
    })
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", updatePopup);
