import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import './Dropdown.scss';

type Props = {
  value: string;
  itemsList: string[];
  callback: (item: string) => void;
};

export const Dropdown: React.FC<Props> = ({ value, itemsList, callback }) => {
  const [isListShown, setListShown] = useState(false);
  const ulRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleList = () => {
    setListShown(!isListShown);
  };

  const handleUserClick = (item: string) => () => {
    callback(item);
    toggleList();
  };

  const handleClick = useCallback(
    ({ target }: MouseEvent) => {
      const node = ulRef?.current;
      const button = buttonRef?.current;

      if (
        node &&
        target instanceof Node &&
        !node.contains(target) &&
        target !== button
      ) {
        setListShown(false);
      }
    },
    [isListShown, ulRef],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handleClick]);

  return (
    <div className="creating-trip__dropdown dropdown">
      <button
        type="button"
        className={classNames('dropdown__button inputfield', {
          'dropdown__button--is-active': !!isListShown,
        })}
        onClick={toggleList}
        ref={buttonRef}
      >
        {value}
      </button>

      <ul
        className={classNames('dropdown__list', {
          'dropdown__list--is-active': !!isListShown,
        })}
        ref={ulRef}
      >
        {itemsList.map((item) => (
          <li
            key={item}
            className="dropdown__item"
            onClick={handleUserClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
