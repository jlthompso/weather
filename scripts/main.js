const OpenWeatherKey = '51cdbef27bd039d5afdb1422954ed64f'
const giphyKey = 'M0wpQeQkmKv00tYxcHtuWwlg9rRkocfJ'

let city = 'maple valley'
let system = 'imperial'

render()

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    city = e.target[0].value
    render()
    e.target.reset()
})

function render () {
    getWeatherData(formatInput(city)).then(wxData => {
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
        cells[0].innerHTML = titleCase(city)
        cells[1].innerHTML = wxData.main
        cells[2].innerHTML = `${wxData.temp}${tempUnits}` // add units, conversion
        cells[3].innerHTML = `${wxData.feels_like}${tempUnits}`
        cells[4].innerHTML = `${wxData.humidity}%`
        cells[5].innerHTML = `${wxData.speed}${speedUnits}`
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