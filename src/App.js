import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BigRoutes } from './router/routes';


function App() {
  return (
    <BrowserRouter>
      {/* Your main layout or components */}
      <BigRoutes />
    </BrowserRouter>
  );
}

export default App;