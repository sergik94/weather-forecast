export interface Trip {
  id: number;
  city: {
    title: string;
    imgPath: string;
  };
  from: string;
  to: string;
}
