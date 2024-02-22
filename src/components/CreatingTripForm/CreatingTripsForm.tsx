import React, { useContext, useState } from 'react';
import './CreatingTripForm.scss';
import { Dropdown } from '../Dropdown';
import cities from '../../data/cities';
import { formatDate } from '../../features/formatDate';
import { TripsContext } from '../TripsContextProvider/TripsContextProvider';
import { getDateForCalendar } from '../../features/getDateForCalendar';

type Props = {
  toggleCreatingTrip: () => void;
};

export const CreatingTripForm: React.FC<Props> = ({ toggleCreatingTrip }) => {
  const now = new Date();
  const minInputDate = getDateForCalendar(now);
  const maxInputDate = getDateForCalendar(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15),
  );
  const citiesList = cities
    .map((city) => city.title)
    .sort((a, b) => a.localeCompare(b));
  const [selectedCity, setSelectedCity] = useState('Please select a city');
  const [selectedFrom, setSelectedFrom] = useState('Select date');
  const [selectedTo, setSelectedTo] = useState('Select date');
  const [isCitySelected, setCitySelected] = useState(false);
  const [isFromSelected, setFromSelected] = useState(false);
  const [isToSelected, setToSelected] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const { trips, setTrips } = useContext(TripsContext);

  const handleCitySelection = (item: string) => {
    setSelectedCity(item);
    setCitySelected(true);
  };

  const handleFromSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFrom(e.currentTarget.value);
    setFromSelected(true);
  };

  const handleToSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTo(e.currentTarget.value);
    setToSelected(true);
  };

  const cancelForm = () => {
    setSelectedCity('Please select a city');
    setSelectedFrom('Select date');
    setSelectedTo('Select date');
    setCitySelected(false);
    setFromSelected(false);
    setToSelected(false);
    setSubmitted(false);
  };

  const closeModalWindow = () => {
    toggleCreatingTrip();
    cancelForm();
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const isError =
      selectedCity.includes('select') ||
      selectedFrom.includes('Select') ||
      selectedTo.includes('Select');

    if (isError) {
      setCitySelected(!selectedCity.includes('select'));
      setFromSelected(!selectedFrom.includes('Select'));
      setToSelected(!selectedTo.includes('Select'));

      return;
    }

    setTrips((prev) => {
      const newTrip = {
        city: cities.find((c) => c.title === selectedCity) || cities[0],
        from: selectedFrom,
        to: selectedTo,
        id: prev.length + 1,
      };

      window.localStorage.setItem('trips', JSON.stringify([...trips, newTrip]));

      return [...prev, newTrip];
    });

    closeModalWindow();
  };

  return (
    <div className="app__creating-trip creating-trip">
      <div className="creating-trip__container">
        <div className="creating-trip__header">
          <h2 className="creating-trip__title">Create trip</h2>
          <button className="creating-trip__close" onClick={closeModalWindow} />
        </div>
        <form className="creating-trip__form" onSubmit={handleSubmitForm}>
          <div className="creating-trip__category-header">
            <p className="creating-trip__category-title">City</p>
            {!isCitySelected && isSubmitted && (
              <p className="creating-trip__error">City is not selected</p>
            )}
          </div>
          <Dropdown
            value={selectedCity}
            itemsList={citiesList}
            callback={handleCitySelection}
          />

          <div className="creating-trip__category-header">
            <p className="creating-trip__category-title">Start date</p>
            {!isFromSelected && isSubmitted && (
              <p className="creating-trip__error">Start date is not selected</p>
            )}
          </div>
          <label className="creating-trip__date inputfield">
            <span>{formatDate(selectedFrom)}</span>
            <input
              type="date"
              min={minInputDate}
              max={selectedTo.includes('date') ? maxInputDate : selectedTo}
              onChange={handleFromSelection}
            />
          </label>

          <div className="creating-trip__category-header">
            <p className="creating-trip__category-title">End date</p>
            {!isToSelected && isSubmitted && (
              <p className="creating-trip__error">End date is not selected</p>
            )}
          </div>
          <label className="creating-trip__date inputfield">
            <span>{formatDate(selectedTo)}</span>
            <input
              type="date"
              min={selectedFrom.includes('date') ? minInputDate : selectedFrom}
              max={maxInputDate}
              onChange={handleToSelection}
            />
          </label>

          <div className="creating-trip__buttons">
            <button
              className="creating-trip__button creating-trip__button--cancel"
              onClick={cancelForm}
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="creating-trip__button creating-trip__button--save"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
