export interface Weather {
  resolvedAddress: string;
  days: {
    datetime: string;
    temp: number;
    tempmin: number;
    tempmax: number;
    icon: string;
  }[];
}
