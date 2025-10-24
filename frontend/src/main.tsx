import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom'; // <-- IMPORT

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- BỌC Ở ĐÂY */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);