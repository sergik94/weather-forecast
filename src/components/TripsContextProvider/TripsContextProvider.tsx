import React, { useState } from 'react';
import cities from '../../data/cities';
import { Trip } from '../../types/Trip';
import { getDateForCalendar } from '../../features/getDateForCalendar';

interface ContextType {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  currTrip: Trip | null;
  setCurrTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
}

const now = new Date();
const currDate = getDateForCalendar(now);
const dateInFiveDays = getDateForCalendar(
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
);

const initialTrip = {
  id: 1,
  city: cities[0],
  from: currDate,
  to: dateInFiveDays,
};

export const TripsContext = React.createContext<ContextType>({
  trips: [initialTrip],
  setTrips: () => {
    return;
  },
  currTrip: initialTrip,
  setCurrTrip: () => {
    return;
  },
});

type Props = {
  children: JSX.Element;
};

export const TripsProvider: React.FC<Props> = ({ children }) => {
  if (!window.localStorage.getItem('trips')) {
    window.localStorage.setItem('trips', JSON.stringify([initialTrip]));
  }

  const tripsFromMemory = JSON.parse(
    window.localStorage.getItem('trips') || '[]',
  ) as Trip[];
  const [trips, setTrips] = useState(tripsFromMemory);
  const [currTrip, setCurrTrip] = useState<Trip | null>(null);

  const contextValue = {
    trips,
    setTrips,
    currTrip,
    setCurrTrip,
  };

  return (
    <TripsContext.Provider value={contextValue}>
      {children}
    </TripsContext.Provider>
  );
};
