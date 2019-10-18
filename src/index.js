import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { h, Component, render } from 'preact';
import App from './App/App.js'

render(
  <App />,
  document.getElementsByTagName("BODY")[0]
);
