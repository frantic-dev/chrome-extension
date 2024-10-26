import { displayData, getData, insertData } from './indexDb'

console.log('[CONTENTSCRIPT] Popup opened')

displayData(displaySerie)

function send_mssg_to_content_script(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: message })
  })
}

function displaySerie(serie) {
  const seriesDiv = document.querySelector('#series')
  const id = document.querySelector('#series').childElementCount

  const serieDiv = document.createElement('div')
  serieDiv.className = 'serie'
  seriesDiv.append(serieDiv)

  const img = document.createElement('img')
  img.src = serie.image
  serieDiv.append(img)

  const emptyDiv = document.createElement('div')
  serieDiv.append(emptyDiv)

  const title = document.createElement('b')
  title.textContent = serie.title
  emptyDiv.append(title)

  const episodes = document.createElement('div')
  episodes.className = 'serie-episodes'
  episodes.textContent = 'Episodes: ' + serie.episodes
  emptyDiv.append(episodes)

  const button = document.createElement('button')
  button.id = `serie-${id}`
  button.textContent = 'check episodes'
  button.addEventListener('click', () => {
    scrapeSerie(serie)
  })
  emptyDiv.append(button)
}

const add_serie_btn = document.querySelector('#add-serie-btn')

add_serie_btn.addEventListener('click', () => {
  send_mssg_to_content_script('pick')
})

// button.addEventListener('click', () => {
// chrome.runtime.sendMessage({ message: 'turn blue' })
// console.log('hello')
//   send_mssg_to_content_script('pick')
// })

let serie = {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('this is the request content', request)

  if (request.target === 'image') {

    if (serie.image == undefined) {
      serie.image = './images/poster.png'
    } else {
      serie.image = request.image
    }
    console.log(serie)

  } else if (request.target === 'title') {
    serie.title = request.title

  } else if (request.target === 'episodes') {
    serie = { ...serie, ...request }
    console.log(serie)
    insertData(serie)
    displaySerie(serie)

    serie = {}
  }
  // sendResponse({ message: request, urls: urls })
})

async function scrapeSerie(serie) {
  console.log(serie)
  chrome.tabs.create({ url: serie.url, active: false })
  chrome.tabs.query({ url: serie.url }, function (tabs) {
    console.log(tabs);
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: check
      })
    }

  })
}

// let series = getData()
// console.log(getData());

function check() {
  const body = document.querySelector('body')
  const div = document.createElement('div')
  div.textContent = 'boyyyyy'
  body.append(div)
  chrome.runtime.sendMessage({ message: 'url acquired' })
}
