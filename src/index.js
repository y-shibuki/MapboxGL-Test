import React from 'react';
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'css/index.css';
import Map from 'Map';

const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
      <Map />
    </React.StrictMode>
);
