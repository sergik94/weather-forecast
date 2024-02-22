import ReactDOM from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.css';
import App from './App';
import { TripsProvider } from './components/TripsContextProvider/TripsContextProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <TripsProvider>
    <App />
  </TripsProvider>,
);
