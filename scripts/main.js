const OpenWeatherKey = '51cdbef27bd039d5afdb1422954ed64f'
const giphyKey = 'M0wpQeQkmKv00tYxcHtuWwlg9rRkocfJ'

let city

dispRandomGif('sun')

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    let city = e.target[0].value
    getWeatherData(formatInput(city)).then(wxData => {
        dispRandomGif(formatInput(wxData.description))

        let cells = document.querySelectorAll('.wxData')
        cells[0].innerHTML = city // fix capitalization
        cells[1].innerHTML = wxData.main
        cells[2].innerHTML = wxData.temp // add units, conversion
        cells[3].innerHTML = wxData.feels_like
        cells[4].innerHTML = wxData.humidity
        cells[5].innerHTML = wxData.speed
        cells[6].innerHTML = wxData.deg
    })
    e.target.reset()
})

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