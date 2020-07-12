import React from 'react';

const Numbers = (props) => {
  let numbersArray = props.allNumbers;
  numbersArray = numbersArray.map((el) => {
    return (
      <div key={Math.random()}>
        <h2>{el}</h2>
      </div>
    );
  });

  return (
    <div>
      <button onClick={props.postClick}>Post a Random Number</button>
      <button onClick={props.getClick}>Get All Random Numbers</button>
      {numbersArray}
    </div>
  );
};

export default Numbers;
