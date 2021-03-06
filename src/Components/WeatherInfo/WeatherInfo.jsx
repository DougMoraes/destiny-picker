import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import WeatherApi from "../../APIs/WeatherApi";
import "./WeatherInfo.scss";

const WeatherInfo = props => {
  const [forecasts, setForecasts] = useState([]);

  useEffect(() => {
    const getForecasts = cityKey => {
      WeatherApi.forecasts
        .get(`${cityKey}?apikey=G5jhNzZpn0iWknOJM3pZzf4mrGFdzDzI&metric=true`)
        .then(resp => resp.data.DailyForecasts)
        .then(forecasts => {
          setForecasts(forecasts);
        })
        .catch(err => console.log(err));
    };

    const getCityId = cityName => {
      WeatherApi.locations
        .get(`search?apikey=G5jhNzZpn0iWknOJM3pZzf4mrGFdzDzI&q=${cityName}`)
        .then(resp => resp.data[0].Key)
        .then(key => getForecasts(key))
        .catch(err => console.log(err));
    };

    props.cityName !== "" && getCityId(props.cityName);
  }, [props.cityName]);

  const mountDate = dateStr => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`weather-info-container ${props.className}`}>
      {forecasts.length > 0 &&
        forecasts.map(item => (
          <div className="weather-info-item">
            <Typography>{mountDate(item.Date)}</Typography>
            <img
              src={`https://developer.accuweather.com/sites/default/files/${
                item.Day.Icon < 10 ? "0" + item.Day.Icon : item.Day.Icon
              }-s.png`}
            />
            <Typography className={`temperature-description`}>
              {`${item.Day.IconPhrase}`}
            </Typography>
            <Typography className={`temperature-description`}>
              {`${item.Temperature.Maximum.Value}°C / ${item.Temperature.Minimum.Value}°C`}
            </Typography>
          </div>
        ))}
    </div>
  );
};

export default WeatherInfo;

WeatherInfo.propTypes = {
  cityName: PropTypes.string.isRequired
};
