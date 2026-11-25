import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import {Provider as Redux} from 'react-redux';import {store} from './store.js';import {Provider} from './ctx.jsx';import App from './App.jsx';import './styles.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><Redux store={store}><Provider><App/></Provider></Redux></BrowserRouter>);
