import "./weather.css";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import sunny from "../assets/sunny.png";
import cloudy from "../assets/cloudy.png";
import drizzle from "../assets/drizzle.png";
import rainy from "../assets/rainy.png";
import snowy from "../assets/snowy.png";

const API_KEY = import.meta.env.VITE_APP_ID;

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": sunny,
    "01n": sunny,
    "02d": cloudy,
    "02n": cloudy,
    "03d": cloudy,
    "03n": cloudy,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rainy,
    "09n": rainy,
    "10d": rainy,
    "10n": rainy,
    "13d": snowy,
    "13n": snowy,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Add a city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        alert(data.message.toUpperCase());
        return;
      }
      console.log(data);
      
      const icon = allIcons[data.weather[0].icon] || sunny;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        maxtemp: Math.floor(data.main.temp_max),
        mintemp: Math.floor(data.main.temp_min),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching data from the weather API");
    }
  };
  useEffect(() => {
    search("Gothenburg");
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search(inputRef.current.value);
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={handleKeyDown}
        />
        <AiOutlineSearch
          className="search-icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          {weatherData && weatherData.icon && (
            <img
              src={weatherData.icon}
              className="weather-icon"
              alt="Weather icon"
            />
          )}

          <p className="temperature">{weatherData.temperature}°c</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <WiHumidity className="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">

              <div className="middle-col">
                <p>H: {weatherData.maxtemp}°c</p>
                <p>L: {weatherData.mintemp}°c</p>
              </div>
            </div>
            <div className="col">
              <FaWind className="wind-speed" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
