chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    watermark: false,
    repostHelper: true,
    workflow: "remux-first"
  });
});