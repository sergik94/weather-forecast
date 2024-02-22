import { useContext, useEffect, useMemo, useState } from 'react';
import './Rightside.scss';
import { TripsContext } from '../TripsContextProvider/TripsContextProvider';
import { getTodayForecast } from '../../api/fetchData';
import { Weather } from '../../types/Weather';
import { Loader } from '../Loader';
import { getDateForCalendar } from '../../features/getDateForCalendar';

type Timer = {
  [key: string]: number;
};

export const Rightside = () => {
  const { currTrip } = useContext(TripsContext);
  const [todayForecast, setTodayForecast] = useState<Weather>();
  const [timerTime, setTimerTime] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const dayOfWeek = useMemo(() => {
    const today = new Date().getDay();

    switch (today) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';

      default:
        return 'Today';
    }
  }, [currTrip]);

  const getTimerTime = () => {
    let countDownDate = new Date().getTime();

    if (currTrip) {
      countDownDate = new Date(currTrip.from).getTime();
    }
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimerTime({ days, hours, minutes, seconds });
  };

  const getTripWeatherForecast = async () => {
    if (currTrip) {
      setLoading(true);
      try {
        const data = await getTodayForecast(currTrip.city.title);

        setTodayForecast(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!currTrip) return;

    getTripWeatherForecast();

    const now = getDateForCalendar(new Date());

    if (now >= currTrip.from) {
      setTimerTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    } else {
      const intervalId = setInterval(() => {
        getTimerTime();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [currTrip]);

  return (
    <div className="app__rightside rightside">
      <div className="rightside__weather-container">
        <p className="rightside__day">{dayOfWeek}</p>

        {isError && (
          <p className="rightside__notification">
            Something went wrong. Please try again later.
          </p>
        )}

        {isLoading && (
          <div className="rightside__loader">
            <Loader />
          </div>
        )}

        {!currTrip && !isError && (
          <p className="rightside__notification">Please select a trip first</p>
        )}

        {currTrip && !isLoading && !isError && (
          <div className="rightside__weather-data">
            <img
              src={`./images/weather-icons/${todayForecast?.days[0].icon}.svg`}
              alt={todayForecast?.days[0].icon}
              className="rightside__weather-icon"
            />
            {todayForecast?.days[0].temp}
            <span className="rightside__unit">C</span>
          </div>
        )}
        <p className="rightside__city">{currTrip?.city.title}</p>
      </div>

      <ul className="rightside__timer timer">
        {Object.keys(timerTime).map((unit) => {
          if (timerTime[unit] === null) return;

          return (
            <li className="timer__item" key={unit}>
              <span className="timer__value">{timerTime[unit]}</span>
              {unit}
            </li>
          );
        })}
      </ul>

      <div className="rightside__bg-icons-container">
        <img
          src={`./images/weather-icons/${todayForecast?.days[0].icon}.svg`}
          alt=""
          className="rightside__bg-icon rightside__bg-icon--1"
        />
        <img
          src={`./images/weather-icons/${todayForecast?.days[0].icon}.svg`}
          alt=""
          className="rightside__bg-icon rightside__bg-icon--2"
        />
        <img
          src={`./images/weather-icons/${todayForecast?.days[0].icon}.svg`}
          alt=""
          className="rightside__bg-icon rightside__bg-icon--3"
        />
        <img
          src={`./images/weather-icons/${todayForecast?.days[0].icon}.svg`}
          alt=""
          className="rightside__bg-icon rightside__bg-icon--4"
        />
      </div>
    </div>
  );
};
