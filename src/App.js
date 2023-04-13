import { useEffect, useState } from 'react'
import axios from 'axios'

const FilterForm = ({text, handler}) => {
  return(
    <div>
      <form>
        find countries:
        <input value={text} onChange={handler} />
      </form>
    </div>
  )
}

const ShowCountryName = ({country, handler}) => {
  return (
    <div>
      {country.name.common} <button onClick={() => handler(country)}>show</button>
    </div>
  )
}

const ShowCountry = ({country}) => {
  return (
    <div>
        <h2>{country.name.common}</h2>
        <p>
          capital {country.capital} <br />
          area {country.area}
        </p>
        <h3>languages:</h3>
        <div>
          <ul>
            {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
          </ul>
        </div>
        <ShowFlag country={country} />
        <ShowWeather country={country} />
      </div>
  )
}


const ShowFlag = ({country}) => {
  const flagURL = country.flags.png
  return (
    <div>
      <img src={flagURL} />
    </div>
  )
}

const ShowFilterResult = ({countries, handler, countryToShow}) => {
  if (countryToShow) {
    return (
      <ShowCountry country={countryToShow} />
    )
  } else if (countries.length > 10) {
    return (
      <div>
        Too many matches!
      </div>
    )
  } else if (countries.length === 1) {
    const country = countries[0]
    return (
      <ShowCountry country={country} />
    )
  } else {
    return (
    <div>
      {countries.map(country =>
        <ShowCountryName key={country.name.official} country={country} handler={handler} />)}
    </div>
    )
  }
}

const ShowWeather = ({country}) => {
  const [weather, setWeather] = useState()

  const weatherAPI = process.env.REACT_APP_WEATHER_API_KEY
  let lat = country.capitalInfo.latlng[0]
  let lon = country.capitalInfo.latlng[1]

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
    }, [])

  if (!weather) {
    return null
  } else {
    return (

      <div>
        <h2>Weather in {country.capital}</h2>
        Temperature {weather.main.temp} Celsius <br />
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} /> <br />
        Wind {weather.wind.speed} m/s
      </div>
  )}
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterString, setFilterString] = useState('')
  const [countryToShow, setCountryToShow] = useState(null)

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
    }, [])

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
    setCountryToShow(null)
  }

  const countriesToShow = filterString
    ? countries.filter(country => country.name.common.toLowerCase().includes(filterString.toLowerCase()))
    : countries


return (
  <div>
    <FilterForm text={filterString} handler={handleFilterChange} />
    <ShowFilterResult 
      countries={countriesToShow} 
      handler={setCountryToShow} 
      countryToShow={countryToShow} />
  </div>)
}

export default App;
