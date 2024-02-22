import React, { RefObject, useContext, useMemo, useState } from 'react';
import cn from 'classnames';

import './TripsList.scss';
import { TripsContext } from '../TripsContextProvider/TripsContextProvider';
import { Trip } from '../../types/Trip';
import { formatDate } from '../../features/formatDate';
import { CreatingTripForm } from '../CreatingTripForm';

type Props = {
  ul: RefObject<HTMLUListElement>;
  li: RefObject<HTMLLIElement>;
  searchValue: string;
};

export const TripsList: React.FC<Props> = ({ ul, li, searchValue }) => {
  const { trips, currTrip, setCurrTrip } = useContext(TripsContext);
  const [isCreatingTrip, setCreatingTrip] = useState(false);

  const handleTripClick = (trip: Trip) => {
    setCurrTrip(trip);
  };

  const toggleCreatingTrip = () => {
    setCreatingTrip(!isCreatingTrip);
  };

  const modifiedTripsList = useMemo(() => {
    let tripList = [...trips];

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!searchValue) {
      tripList = trips.filter((t) =>
        t.city.title.toLowerCase().includes(searchValue.trim().toLowerCase()),
      );
    }

    return tripList.sort((t1, t2) => t1.from.localeCompare(t2.from));
  }, [trips, searchValue]);

  return (
    <div className="leftside__trips trips">
      <ul className="trips__list" ref={ul}>
        {modifiedTripsList.map((trip, idx) => {
          const formatedFrom = formatDate(trip.from);
          const formatedTo = formatDate(trip.to);

          return (
            <li
              className={cn('trips__card', {
                'trips__card--is-active': currTrip?.id === trip.id,
              })}
              ref={idx === 0 ? li : undefined}
              key={trip.id}
              onClick={() => handleTripClick(trip)}
            >
              <img
                src={trip.city.imgPath}
                alt={trip.city.title}
                className="trips__card-img"
              />
              <div className="trips__card-info">
                <p className="trips__card-title">{trip.city.title}</p>
                <p className="trips__card-date">
                  {formatedFrom} - {formatedTo}
                </p>
              </div>
            </li>
          );
        })}

        <li
          className="trips__card trips__card--add"
          onClick={toggleCreatingTrip}
        >
          <div>
            +<br />
            Add item
          </div>
        </li>
      </ul>

      {isCreatingTrip && (
        <CreatingTripForm toggleCreatingTrip={toggleCreatingTrip} />
      )}
    </div>
  );
};
