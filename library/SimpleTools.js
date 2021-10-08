async function Sleep(sleepSecs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, sleepSecs * 1000)
  })
}

async function WaitUntil(conditionFunc, sleepSecs) {
  sleepSecs = sleepSecs || 1
  return new Promise((resolve, reject) => {
    if (conditionFunc()) resolve()
    let interval = setInterval(() => {
      if (conditionFunc()) {
        clearInterval(interval)
        resolve()
      }
    }, sleepSecs * 1000)
  })
}

// GM_xmlhttpRequest
function Request(url, opt = {}) {
  Object.assign(opt, {
    url,
    timeout: 2000,
    responseType: 'json'
  })

  return new Promise((resolve, reject) => {
    /*
    for (let f of ['onerror', 'ontimeout'])
      opt[f] = reject
    */

    opt.onerror = opt.ontimeout = reject
    opt.onload = resolve

    // console.log('Request', opt)

    GM_xmlhttpRequest(opt)
  }).then(res => {
    if (res.status === 200) return Promise.resolve(res.response)
    else return Promise.reject(res)
  }, err => {
    return Promise.reject(err)
  })
}

function Get(url, opt = {}) {
  Object.assign(opt, {
    method: 'GET'
  })
  return Request(url, opt)
}

function Post(url, opt = {}) {
  Object.assign(opt, {
    method: 'POST'
  })
  return Request(url, opt)
}

function showToast(msg, doNotFade) {
  let style = `position: fixed; right: 10px; top: 80px; width: 300px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`

  let span = document.createElement('span')
  span.setAttribute('style', style)
  span.innerText = msg
  document.body.appendChild(span)
  if (!doNotFade) {
    setTimeout(() => {
      document.body.removeChild(span)
    }, 5000)
  }
}

async function GetElementByText(startElem, selector, text, exist) {
  /*
  selector: 选择器
  text: 内容
  exist: 是否只要存在就ojbk
  */
  exist = exist || false
  let elemList = startElem.querySelectorAll(selector)
  for (let i = 0; i < elemList.length; ++i) {
    let elem = elemList[i]
    if (exist) {
      if (elem.innerText.search(text) !== -1) return elem
    } else {
      if (elem.innerText === text) return elem
    }
  }
}
