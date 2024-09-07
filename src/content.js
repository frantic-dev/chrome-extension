chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  const action = request.message

  if (action === 'pick') {
    const url = window.location.href
    console.log(url)

    const body = document.querySelector('body')

    function handleClick(e) {
      chrome.runtime.sendMessage(
        { episodes: e.target.innerHTML, url: url },
        response => {
          console.log(response)
        }
      )
      e.target.style.outline = ''
      // remove all event listeners from  body elements
      body.replaceWith(body.cloneNode(true))
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
