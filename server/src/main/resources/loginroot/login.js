function initLogin(callback, queryParamOptional) {
  const encoder = new TextEncoder()
  const algorithm = 'sha-256'
  const queryParam = queryParamOptional || 'token'
  let salt = null
  let userId = null

  function hex(buff) {
    return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('')
  }

  async function digest(text) {
    console.log(`digesting ${text}`)
    let digested = await window.crypto.subtle.digest(algorithm, encoder.encode(text))
    return hex(digested)
  }

  function login(e) {
    e.preventDefault()
    let password = document.querySelector('form > input[type=password]').value
    digest(`${salt}${password}`).then(function(digested) {
      fetch(`login/token/${userId}/${digested}`)
        .then(function(response) {
          if (!response.ok) throw Error(response.statusText || 'login error')
          return response.text()
        })
        .then(function(token) {
          window.location.href = `${callback}?${queryParam}=${token}`
        })
        .catch(function(error) {
          console.log('Cannot login, invalid credentials?')
          console.log(error)
        })
    })
  }

  function newsalt(e) {
    userId = e.target.value
    fetch(`login/salt/${userId}`).then(function(response) {
      if (!response.ok) throw Error(response.statusText)
      return response.text()
    }).then(function(newSalt) {
      salt = newSalt
    }).catch(function(error) {
      console.log('Cannot fetch salt - invalid username?')
      console.log(error)
    })
  }

  return {
    login:   login,
    newsalt: newsalt
  }
}

function init() {
  const urlParams = new URLSearchParams(window.location.search)
  const login = initLogin(urlParams.get('callback'), urlParams.get('queryParam'))
  document.querySelector('form > input[type=text]').addEventListener('blur', login.newsalt)
  document.querySelector('form > input[type=submit]').addEventListener('click', login.login)
}
