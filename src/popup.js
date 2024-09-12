import * as cheerio from 'cheerio'
import * as css from './popup.css'
import { displayData, insertData } from './indexDb'

console.log('[CONTENTSCRIPT] Popup opened')

const button = document.querySelector('button')

displayData(displaySerie)

function send_mssg_to_content_script(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: message })
  })
}

function displaySerie(serie) {
  const seriesDiv = document.querySelector('#series')
  seriesDiv.innerHTML += `
  <div class="serie">
      <img src="${serie.image}">
      <div>
        <b id="pick-title">${serie.title}</b>
        <div id="pick-episodes">${serie.episodes}</div>
      </div>
    </div>
  `
}

const add_serie_btn = document.querySelector('#add-serie-btn')

add_serie_btn.addEventListener('click', () => {
  send_mssg_to_content_script('pick')
})

button.addEventListener('click', () => {
  // chrome.runtime.sendMessage({ message: 'turn blue' })
  // console.log('hello')
  send_mssg_to_content_script('pick')
})

let serie = {}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('this is the request content', request)
  if (request.target === 'image') {
    serie.image = request.image
    console.log(serie)
  } else if (request.target === 'title') {
    serie.title = request.title
  } else if (request.target === 'episodes') {
    serie = { ...serie, ...request }
    console.log(serie)
    displaySerie(serie)
    insertData(serie)
    serie = {}
  }
  // sendResponse({ message: request, urls: urls })
})

async function scrape() {
  const url = 'https://www.example.com'
  const response = await fetch(url)

  const $ = cheerio.load(await response.text())
  console.log($.html())

  const $p = $('body')
  console.log($p.text())
}

// scrape()

function getEpisodes() {
  const episodes_html =
    '<li class="nav-item"><a id="episode-68733" data-id="68733" class="nav-link btn btn-sm btn-secondary eps-item" href="javascript:;" title="Eps 1: A New Day"><i class="fas fa-play mr-2"></i><strong>Eps 1:</strong> A New Day</a></li><li class="nav-item"><a id="episode-68734" data-id="68734" class="nav-link btn btn-sm btn-secondary eps-item" href="javascript:;" title="Eps 2: The Death Zone"><i class="fas fa-play mr-2"></i><strong>Eps 2:</strong> The Death Zone</a></li><li class="nav-item"><a id="episode-68735" data-id="68735" class="nav-link btn btn-sm btn-secondary eps-item" href="javascript:;" title="Eps 3: Get a Room"><i class="fas fa-play mr-2"></i><strong>Eps 3:</strong> Get a Room</a></li><li class="nav-item"><a id="episode-68736" data-id="68736" class="nav-link btn btn-sm btn-secondary eps-item" href="javascript:;" title="Eps 4: Feeding the Rat"><i class="fas fa-play mr-2"></i><strong>Eps 4:</strong> Feeding the Rat</a></li><li class="nav-item">        <a id="episode-68737" data-id="68737" class="nav-link btn btn-sm btn-secondary eps-item" href="javascript:;" title="Eps 5: Marthas and Caitlins" style="outline: none;"><i class="fas fa-play mr-2"></i><strong style="outline: none;">Eps 5:</strong> Marthas and Caitlins</a></li><li class="nav-item"><a id="episode-68738" data-id="68738" class="nav-link btn btn-sm btn-secondary eps-item" href="javascript:;" title="Eps 6: Affairs of State"><i class="fas fa-play mr-2"></i><strong>Eps 6:</strong> Affairs of State</a>      </li>'

  const episodes_dom = new DOMParser().parseFromString(
    episodes_html,
    'text/html'
  )
  console.log(episodes_dom)
  const episodes = episodes_dom.querySelectorAll('a')
  console.log(episodes)
  console.log(episodes.length)
  let titles = []
  for (const episode of [...episodes]) {
    console.log(episode.title)
    titles.push(episode.title)
  }
  console.log(titles)
}

// getEpisodes()
