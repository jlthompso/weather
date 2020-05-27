const apiKey = '51cdbef27bd039d5afdb1422954ed64f'

//let city = prompt('Enter city name')
//getWeatherData(city)
let city

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    getWeatherData(formatCity(e.target[0].value))
    e.target.reset()
})

async function getWeatherData (city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${formatCity(city)}&appid=${apiKey}`, {mode: 'cors'})
        response.json().then(function (response) {
            console.log(response.weather[0].main)
        })
    } catch (error) {
        alert('API call failed.')
    }
}

function formatCity (city) {
    return city.toLowerCase().replace(/\s+/g, '%20')
}