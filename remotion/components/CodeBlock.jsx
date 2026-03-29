import React from 'react';

const CodeBlock = ({ code }) => {
  return (
    <div>
      <h2>Code Block</h2>
      <pre>{code}</pre>
    </div>
  );
};

export default CodeBlock;
