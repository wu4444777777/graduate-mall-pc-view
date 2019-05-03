import React, {Component} from 'react'
import {HashRouter, Switch, Route} from 'react-router-dom'

//模板路径
import index from './biz/indexPage/index'
import login from './biz/login/login'
import register from './biz/register/register'
import home from './biz/home/home'
// import addProduct from './biz/addProduct/addProduct'
// import productDetail from './biz/productDetail/productDetail'

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
          <Route path="/" exact component={index}/>
          <Route path="/home"component= {home}/>
          <Route path="/login" component={login}/>
          <Route path="/register" component={register}/>
          {/* <Route path="/addProduct" component={addProduct}/> */}
          {/* <Route path="/productDetail" component={productDetail}/> */}
        </Switch>
      </HashRouter>
    )
  }
}

export default RouteConfig;