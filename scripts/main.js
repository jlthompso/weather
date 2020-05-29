const OpenWeatherKey = '51cdbef27bd039d5afdb1422954ed64f'
const giphyKey = 'M0wpQeQkmKv00tYxcHtuWwlg9rRkocfJ'

let prevCity
let currentCity = 'maple valley'
let system = 'imperial'

render(currentCity)

document.querySelector('#cityForm').addEventListener('submit', e => {
    e.preventDefault()
    prevCity = currentCity
    currentCity = e.target[0].value
    render(currentCity)
    e.target.reset()
})

document.querySelector('#unitsForm').addEventListener('change', e => {
    system = e.target.value
    render(currentCity)
})

function render (city) {
    getWeatherData(formatInput(city)).then(wxData => {
        wxData === undefined ? currentCity = prevCity : prevCity = city
        let tempUnits, speedUnits
        switch (system) {
            case 'imperial':
                tempUnits = '°F'
                speedUnits = 'mph'
                break
            case 'metric':
                tempUnits = '°C'
                speedUnits = 'kph'
                break
            default:
                break
        }
        let cells = document.querySelectorAll('.wxData')
        cells[0].innerHTML = titleCase(currentCity)
        cells[1].innerHTML = wxData.main
        cells[2].innerHTML = `${Math.round(convertUnits(wxData.temp, 'kelvin', system === 'imperial' ? 'fahrenheit' : 'celsius'))}${tempUnits}`
        cells[3].innerHTML = `${Math.round(convertUnits(wxData.feels_like, 'kelvin', system === 'imperial' ? 'fahrenheit' : 'celsius'))}${tempUnits}`
        cells[4].innerHTML = `${wxData.humidity}%`
        cells[5].innerHTML = `${Math.round(convertUnits(wxData.speed, 'milesPerHour', system === 'imperial' ? 'milesPerHour' : 'kilometersPerHour'))} ${speedUnits}`
        cells[6].innerHTML = `${wxData.deg}°`
        dispRandomGif(formatInput(wxData.description))
    })
}

async function getWeatherData (city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${formatInput(city)}&appid=${OpenWeatherKey}`, {mode: 'cors'})
        const wxData = await response.json()
        return {
            'main': wxData.weather[0].main,
            'description': wxData.weather[0].description,
            'temp': wxData.main.temp,
            'feels_like': wxData.main.feels_like,
            'humidity': wxData.main.humidity,
            'speed': wxData.wind.speed,
            'deg': wxData.wind.deg
        }
    } catch (error) {
        alert('OpenWeather API call failed.')
    }
}

function formatInput (city) {
    return city.toLowerCase().replace(/\s+/g, '%20')
}

async function dispRandomGif (currentWeather) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${formatInput(currentWeather)}&limit=25&offset=0&rating=G&lang=en`, {mode: 'cors'})
        const img = await response.json()
        document.getElementById('wxIcon').setAttribute('src', img.data[0].images.fixed_height_small.url)
    } catch {
        alert('GIPHY API call failed.')
    }
}

function titleCase (string) {
    let words = string.toLowerCase().split(' ')
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
    }
    return words.join(' ')
}

function convertUnits (val, fromUnits, toUnits) {
    let ret = null
    switch (fromUnits) {
        case 'kelvin':
            switch (toUnits) {
                case 'fahrenheit':
                    ret = (val - 273.15) * 9/5 + 32
                    break
                case 'celsius':
                    ret = val - 273.15
                    break
                default:
                    ret = val
                    break
            }
            break
        case 'milesPerHour':
            switch (toUnits) {
                case 'kilometersPerHour':
                    ret = val * 1.609
                    break
                default:
                    ret = val
                    break
            }
            break
        default:
            break
    }
    return ret
}