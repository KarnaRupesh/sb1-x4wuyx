import { Application } from '@nativescript/core';
import { AppContainer } from './components/AppContainer';
import * as React from 'react';
import { start } from 'react-nativescript';

// Apply global styles
import './app.css';

// Register entry components
Application.run({
    create: () => {
        start(React.createElement(AppContainer, {}, null));
    }
});