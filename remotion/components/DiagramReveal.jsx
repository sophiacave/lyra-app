import React from 'react';

const DiagramReveal = ({ diagram }) => {
  return (
    <div>
      <h2>Diagram Reveal</h2>
      <img src={diagram} alt='Diagram' />
    </div>
  );
};

export default DiagramReveal;
