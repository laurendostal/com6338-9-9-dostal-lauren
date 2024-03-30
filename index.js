const weatherURLfirstpart = 'https://api.openweathermap.org/data/2.5/weather?q='
const appId = '&appid=a1e5c995547a69253016f38705d20293'
const unitParameter = "&units=imperial"
const weatherDiv = document.getElementById('weather-app')
const formElement = document.querySelector('form')
const input = document.getElementById('weather-search')
const sectionElement = document.getElementById('weather')

formElement.onsubmit = fetchWeatherData

async function fetchWeatherData(e) {
    e.preventDefault()
    const searchTerm = input.value.trim()
    if(!searchTerm) {
        return
    }
    input.value = ""
    weatherURL = weatherURLfirstpart + searchTerm + unitParameter + appId
    try {
        const res = await fetch(weatherURL)  
        if(res.status !== 200) {
            throw new Error('Location not found')
        }
        const weatherData = await res.json()
        renderWeatherInfo(weatherData)
    } catch(err) {
        renderErrorInfo(err)
    }
}

const renderErrorInfo = (err) => {
    sectionElement.innerHTML = ""
    const h2 = document.createElement('h2')
    h2.textContent = err.message
    sectionElement.appendChild(h2)
}

function renderWeatherInfo(weatherData) {
    console.log(weatherData)
    const {name, coord:{lon, lat}, main:{temp, feels_like}, dt, sys:{country}} = weatherData
    sectionElement.innerHTML = ""
    const h2 = document.createElement('h2')
    h2.textContent = `${name}, ${country}`
    sectionElement.appendChild(h2)
    let mapURL = "https://www.google.com/maps/search/?api=1&query="
    mapURL = mapURL + lat + "," + lon
    
    const anchor = document.createElement("a")
    anchor.href = mapURL
    anchor.target = "_blank"
    anchor.text = "Click to view map"
    sectionElement.appendChild(anchor)

    const weatherIconImgElement = document.createElement("img")
    const weatherIconCode = weatherData.weather[0].icon
    const weatherIconFileName = weatherIconCode + "@2x.png"
    let weatherIconURL = "https://openweathermap.org/img/wn/"
    weatherIconURL = weatherIconURL + weatherIconFileName
    weatherIconImgElement.src = weatherIconURL
    sectionElement.appendChild(weatherIconImgElement)

    const weatherDescriptionParaElement = document.createElement("p")
    const weatherDescription = weatherData.weather[0].description
    weatherDescriptionParaElement.style = "text-transform : capitalize;"
    let textNode = document.createTextNode(weatherDescription)
    weatherDescriptionParaElement.appendChild(textNode)
    sectionElement.appendChild(weatherDescriptionParaElement)

    sectionElement.appendChild(document.createElement('br'))

    const weatherCurrentTempParaElement = document.createElement("p")
    const weatherCurrentTemp = temp
    textNode = document.createTextNode(`Current: ${weatherCurrentTemp}° F`)
    weatherCurrentTempParaElement.appendChild(textNode)
    sectionElement.appendChild(weatherCurrentTempParaElement)

    const weatherFeelsLikeTempParaElement = document.createElement("p")
    const weatherFeelsLikeTemp = feels_like
    textNode = document.createTextNode(`Feels like: ${weatherFeelsLikeTemp}° F`)
    weatherFeelsLikeTempParaElement.appendChild(textNode)
    sectionElement.appendChild(weatherFeelsLikeTempParaElement)

    sectionElement.appendChild(document.createElement('br'))

    const weatherLastUpdatedParaElement = document.createElement("p")
    const weatherLastUpdated = dt
    
    const date = new Date(weatherLastUpdated * 1000)
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
    textNode = document.createTextNode(`Last updated: ${timeString}`)
    weatherLastUpdatedParaElement.appendChild(textNode)
    sectionElement.appendChild(weatherLastUpdatedParaElement)
}