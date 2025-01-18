import React from 'react';

function ErrorPage() {
  return (
    <div className='container'>
      <h1>503</h1>
      <h3>Could not connect to backend. (Is the backend running?)</h3>
    </div>
  );
}

export default ErrorPage;