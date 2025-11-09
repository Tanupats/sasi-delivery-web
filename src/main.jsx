import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Context from './ContextData.jsx'
import { Container } from 'react-bootstrap'
import './index.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Context>
      <Container fluid>
        <App />
      </Container>
    </Context>
  </React.StrictMode>,
)
