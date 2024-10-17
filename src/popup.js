import { displayData, insertData } from './indexDb'

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

  seriesDiv.innerHTML += `
  <div class="serie">
      <img src="${serie.image}">
      <div>
        <b>${serie.title}</b>
        <div class="serie-episodes">Episodes: ${serie.episodes}</div>
        <button id="serie-${id}">check episodes</button>
      </div>
    </div>
  `

  const buttons = document.querySelectorAll('.serie button')
  console.log(buttons)

  for (let button of buttons) {
    console.log(button)
    button.addEventListener('click', () => {
      scrapeSerie(serie)
    })
  }
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
}

