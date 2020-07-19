import React from 'react';
import states from '../util/states';

export default () => {
  let optionArray = states.map((el) => {
    return <option value={el.name} />;
  });
  return <datalist id='states'>{optionArray}</datalist>;
};
