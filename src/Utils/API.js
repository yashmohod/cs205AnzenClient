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
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    try {
        let response = await fetch(url, requestOptions)
        return response
    } catch {
        console.log("Error posting data")
    }
}