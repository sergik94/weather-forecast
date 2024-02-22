import { useContext, useEffect, useState } from 'react';
import './App.scss';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Leftside } from './components/Leftside';
import { Rightside } from './components/Rightside';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from './api/firebase';
import { AuthType } from './types/AuthType';
import { TripsContext } from './components/TripsContextProvider/TripsContextProvider';

function App() {
  const { setCurrTrip } = useContext(TripsContext);
  const [user, setUser] = useState<AuthType>(auth.currentUser);
  const [isLogInError, setLogInError] = useState(false);

  const googleLogIn = () => {
    setLogInError(false);
    signInWithPopup(auth, googleAuthProvider).catch(() => setLogInError(true));
  };

  const logOut = async () => {
    await signOut(auth);
    setCurrTrip(null);
  };

  const guestLogIn = () => {
    setLogInError(false);
    setUser('guest');
  };

  const toggleLog = async () => {
    if (user === 'guest') {
      googleLogIn();
    } else {
      await logOut();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (user) {
    return (
      <div className="app">
        <Header user={user} toggleLog={toggleLog} />

        <main className="app__main _container">
          <Leftside />

          <Rightside />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="app__auth auth">
      <div className="auth__window">
        <h2 className="auth__title">Welcome</h2>

        <button
          className="auth__button auth__button--google"
          onClick={googleLogIn}
        >
          Sign in with Google
        </button>
        <p className="auth__or">or</p>
        <button className="auth__button" onClick={guestLogIn}>
          Continue like a guest
        </button>

        {isLogInError && (
          <p className="auth__notification">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
