import React, { useState } from 'react';
import cities from '../../data/cities';
import { Trip } from '../../types/Trip';

interface ContextType {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  currTrip: Trip | null;
  setCurrTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
}

const initialTrip = {
  id: 1,
  city: cities[0],
  from: '2024-02-25',
  to: '2024-02-29',
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
