const color= "yellow"
chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.set({["color"]:color})
})