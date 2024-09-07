console.log('[CONTENTSCRIPT] Popup opened')

const button = document.querySelector('button')
// chrome.storage.sync.clear()
let urls

chrome.storage.sync.get({ links: [] }).then(data => {
  console.log('this is beginning', data.links)
  urls = data.links
})

button.addEventListener('click', () => {
  // chrome.runtime.sendMessage({ message: 'turn blue' })
  // console.log('hello')
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: 'pick' })
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('this is the request content', request)
  console.log('urls before updating', urls)
  urls.push(request.url)
  chrome.storage.sync
    .set({ links: urls })
    .then(() => console.log('urls have been updated'))
  console.log('urls after updating', urls)
  sendResponse({ message: request, urls: urls })
})
