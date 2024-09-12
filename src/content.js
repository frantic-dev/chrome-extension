const body = document.querySelector('body')

function sendMssgToPopup(message) {
  chrome.runtime.sendMessage(message)
}

function createNotificationElement() {
  const notification = document.createElement('div')

  notification.setAttribute('id', 'notification')
  notification.textContent = 'click on serie image'
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    zIndex: 100,
    color: 'black',
    width: '400px',
    backgroundColor: 'white',
    fontSize: '20px',
    left: 'calc((100vw - 400px) / 2)',
    padding: '5px 10px',
  })
  body.appendChild(notification)
  return notification
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  const action = request.message

  if (action === 'pick') {
    const body = document.querySelector('body')
    const notification = createNotificationElement()
    console.log(notification)
    const url = window.location.href
    let target = 'image'

    function handleClick(e) {
      if (target === 'image') {
        sendMssgToPopup({ target: 'image', image: e.target.src })
        target = 'title'
        notification.textContent = 'click on serie title'
      } else if (target === 'title') {
        sendMssgToPopup({ target: 'title', title: e.target.textContent })
        target = 'episodes'
        notification.textContent = 'click on serie episodes container'
      } else if (target === 'episodes') {
        sendMssgToPopup({
          target: 'episodes',
          episodes: e.target.querySelectorAll('a').length,
          container: e.target.innerHTML,
          url: url,
        })

        e.target.style.outline = ''
        notification.remove()
        // remove all event listeners from  body elements
        body.replaceWith(body.cloneNode(true))
      }
    }

    body.addEventListener('mouseover', e => {
      e.target.style.outline = '1px solid red'
      e.target.addEventListener('click', handleClick)
    })

    body.addEventListener('mouseout', e => {
      e.target.style.outline = 'none'
      e.target.removeEventListener('click', handleClick)
    })
  }
})
