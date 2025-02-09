import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ServiceResponse } from './types';

const mountPoint = document.getElementById('root');

if (mountPoint) {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        mountPoint
    );
} else {
    console.error('Root element not found');
}

export type { ServiceResponse }; 