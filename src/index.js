import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-table/react-table.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import Layout from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((<BrowserRouter><Layout /></BrowserRouter>), document.getElementById('root'));

registerServiceWorker();
