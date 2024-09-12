
console.log('[BACKGROUND] Background initialized')

chrome.runtime.onInstalled.addListener(() => {
  console.log('[BACKGROUND] Chrome extension installed')
})

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(error => console.error(error))

// chrome.runtime.onMessage.addListener(function (message, send, sendResponse) {
//   console.log(message)
//   if (message.action === 'insertData') {
//     insertData(message.serie)
//   }
// })
