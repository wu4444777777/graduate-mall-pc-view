import React, { Component } from 'react';

class index extends Component{
  constructor(props,context) {
    super(props,context)
    this.state= {
    }
  }

  componentWillMount(){
    if(localStorage.getItem('userFlag') == 1){
      this.props.history.push("/home")
    }else{
      this.props.history.push("/login")
    }
  } 
  
  render(){
    return (
      <div className="index"></div>
    )
  }
}

export default index