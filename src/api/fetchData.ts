import { Weather } from '../types/Weather';

const API_KEY = 'LGWU8ZWAMZ2E44AN2HEYCQXFP';

function request<T>(city: string, date: string): Promise<T> {
  const BASE_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date}?unitGroup=metric&include=current&key=${API_KEY}&contentType=json`;

  return fetch(BASE_URL).then((res) => {
    if (!res.ok) {
      throw new Error();
    }

    return res.json();
  });
}

const client = {
  get: <T>(city: string, date: string) => request<T>(city, date),
};

export const getTodayForecast = (city: string) => {
  return client.get<Weather>(city, 'today');
};

export const getPeriodForecast = (city: string, from: string, to: string) => {
  return client.get<Weather>(city, `${from}/${to}`);
};
