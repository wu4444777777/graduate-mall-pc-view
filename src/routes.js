import React, {Component} from 'react'
import {HashRouter, Switch, Route} from 'react-router-dom'

//模板路径
import login from './biz/login/login'
import register from './biz/register/register'
import home from './biz/home/home'
import order from './biz/order/order'
import user from './biz/user/user'
import activity from './biz/activity/activity'

class RouteConfig extends Component { 
  constructor(props,context) {
    super(props,context)
    this.state = {

    }
  }

  componentWillMount() {
  }
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" exact component= {home}/>
          <Route path="/login" component={login}/>
          <Route path="/register" component={register}/>
          <Route path="/order" component={order}/>
          <Route path="/user" component={user}/>
          <Route path="/activity" component={activity}/>
        </Switch>
      </HashRouter>
    )
  }
}

export default RouteConfig;