export async function get(url) {
    try {
        let response = await fetch(url)
        return response
    } catch {
        console.log("Error getting data")
    }
}

export async function post(url, data) {
    let requestOptions = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data),
    }

    try {
        let response = await fetch(url, requestOptions)
        return response.json()
    } catch {
        console.log("Error posting data")
    }
}

export const API_URL = process.env.REACT_APP_DEV_API