import './Leftside.scss';
import { TripsList } from '../TripsList';
import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getPeriodForecast } from '../../api/fetchData';
import { TripsContext } from '../TripsContextProvider/TripsContextProvider';
import { Weather } from '../../types/Weather';
import { formatDate } from '../../features/formatDate';
import { Loader } from '../Loader';

export const Leftside = () => {
  const ul = useRef() as RefObject<HTMLUListElement>;
  const li = useRef() as RefObject<HTMLLIElement>;
  const { trips, currTrip } = useContext(TripsContext);
  const [periodForecast, setPeriodForecast] = useState<Weather>();
  const [searchValue, setSearchValue] = useState('');
  const [isScrollButtonsShown, setScrollButtonsShown] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const scrollList = (direction: 'left' | 'right') => {
    const scrollingBy =
      +(li.current?.clientWidth || 0) + +(li.current?.style.marginRight || 0);
    ul.current?.scrollBy(-scrollingBy, 0);

    switch (direction) {
      case 'left':
        ul.current?.scrollBy(-scrollingBy, 0);
        break;

      case 'right':
        ul.current?.scrollBy(scrollingBy, 0);
        break;
    }
  };

  const getTripWeatherForecast = async () => {
    if (currTrip) {
      try {
        setLoading(true);
        const data = await getPeriodForecast(
          currTrip.city.title,
          currTrip.from,
          currTrip.to,
        );

        setPeriodForecast(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  useEffect(() => {
    getTripWeatherForecast();
  }, [currTrip]);

  useEffect(() => {
    const isButtonsSwown =
      +(ul.current?.clientHeight || 0) !== +(ul.current?.offsetHeight || 0);
    setScrollButtonsShown(isButtonsSwown);
  }, [trips.length, searchValue]);

  return (
    <div className="app__leftside leftside">
      <div className="leftside__actions">
        <label className="leftside__searchbox searchbox">
          <input
            type="text"
            placeholder="Search your trip"
            value={searchValue}
            onChange={handleSearch}
          />
          <i className="fa-solid fa-magnifying-glass" />
        </label>

        {isScrollButtonsShown && (
          <div className="leftside__scrollbuttons">
            <button
              className="leftside__scrollbutton leftside__scrollbutton--left"
              onClick={() => scrollList('left')}
            />
            <button
              className="leftside__scrollbutton leftside__scrollbutton--right"
              onClick={() => scrollList('right')}
            />
          </div>
        )}
      </div>

      <TripsList ul={ul} li={li} searchValue={searchValue} />

      <div className="leftside__week-weather week-weather">
        <h2 className="week-weather__title">Week</h2>

        {isError && (
          <p className="week-weather__notification">
            Something went wrong. Please try again later.
          </p>
        )}

        {isLoading && (
          <div className="week-weather__loader">
            <Loader />
          </div>
        )}

        {!currTrip && !isError && (
          <p className="week-weather__notification">
            Please select a trip first
          </p>
        )}

        {currTrip && !isLoading && !isError && (
          <ul className="week-weather__list">
            {periodForecast?.days.map((day) => (
              <li className="week-weather__card" key={day.datetime}>
                <p className="week-weather__day">{formatDate(day.datetime)}</p>
                <div className="week-weather__icon-container">
                  <img
                    src={`./images/weather-icons/${day.icon}.svg`}
                    alt=""
                    className="week-weather__icon"
                  />
                </div>
                <p>
                  <span className="week-weather__temp">{day.tempmin}</span>/
                  <span className="week-weather__temp">{day.tempmax}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
