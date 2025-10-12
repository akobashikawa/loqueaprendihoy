import React, { useState } from 'react';

const MyReactComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>React Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
};

export default MyReactComponent;
