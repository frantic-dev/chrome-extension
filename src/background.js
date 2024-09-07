console.log('[BACKGROUND] Background initialized')

chrome.runtime.onInstalled.addListener(() => {
  console.log('[BACKGROUND] Chrome extension installed')
})

// chrome.runtime.onMessage.addListener(function (message, send, sendResponse) {
//   console.log(message)
// })
