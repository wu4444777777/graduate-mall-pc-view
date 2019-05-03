import React from 'react';
import ReactDOM from 'react-dom';
import Route from './routes'
import {AppContainer} from 'react-hot-loader'
import { Provider } from "mobx-react"
import './index.css';
import * as serviceWorker from './serviceWorker';
import './config/rem'

const render = Component => {
  ReactDOM.render(
    <Provider>
      <AppContainer>
        <Component/>
      </AppContainer>
    </Provider>,
    document.getElementById('root')
  )
}

render(Route)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
