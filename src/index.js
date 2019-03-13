import React from 'react';
import ReactDOM from 'react-dom';
import Route from './routes'
import {AppContainer} from 'react-hot-loader'
import { Provider } from "mobx-react"
import './index.css';
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
