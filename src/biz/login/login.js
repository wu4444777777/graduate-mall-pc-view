import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import './login.less'
import api from '../api'

class login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loginData: {}
    }
  }

  componentWillMount(){
  }

  handleSubmit = (e) => {
    message.loading("loading...",0)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        api.adminLogin({
          params: {
            phone: values.userName,
            password: values.password
          }
        }).then(data=>{
          message.destroy()
          if(data.resultCode == 0){
            localStorage.setItem("userFlag",1)
            localStorage.setItem("userToken",data.data.userToken)
            message.success(data.resultMsg,3,()=>{
              this.props.history.push("/home")
            })
          }else{
            message.error(data.resultMsg)
          }
        })
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住密码</Checkbox>
            )}
            <a className="login-form-forgot" href="/register">忘记密码</a>
            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
            Or <a href="/#/register">去注册!</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const Login = Form.create({ name: 'normal_login' })(login);
export default Login; 