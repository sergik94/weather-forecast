import React from 'react';
import { AuthType } from '../../types/AuthType';
import './Header.scss';

type Props = {
  user: AuthType;
  toggleLog: () => void;
};

export const Header: React.FC<Props> = ({ user, toggleLog }) => {
  return (
    <header className="app__header header">
      <div className="header__container _container">
        <a href="" className="header__logo">
          Weather <strong>Forecast</strong>
        </a>
        <div className="header__user-wrapper">
          <button className="header__logout" onClick={toggleLog}>
            {user === 'guest' ? 'Sign in' : 'Sign out'}
          </button>
          <div className="header__user" title="Guest">
            {typeof user !== 'string' && (
              <img
                src={user?.photoURL || ''}
                alt={user?.displayName || ''}
                title={user?.displayName || ''}
                className="header__user-photo"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
