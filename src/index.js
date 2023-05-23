import React from 'react';
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'css/index.css';
import Mapbox from 'Mapbox';

const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
      <Mapbox />
    </React.StrictMode>
);
