import React, { Component } from 'react'
import {
  Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message,
} from 'antd';
import './register.less'
import api from '../api'
import util from '../../utils/index'
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class register extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
    }
  }

  componentWillMount(){

  }

  handleSubmit = (e) => {
    message.loading("loading...",0)
    let registerDate = util.formatNowTime(0).split(" ")[0]
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        api.adminRegister({
          username: values.nickname,
          phone: values.phone,
          password: values.password,
          email: values.email,
          registerDate,
          userToken: "admin"+values.phone+util.formatNowTime(1)
        }).then(data=>{
          message.destroy()
          if(data.resultCode == 0){
            message.success(data.resultMsg,3,()=>{
              this.props.history.push("/login")
            })
          }else{
            message.error(data.resultMsg)
          }
        })
        console.log('Received values of form: ', values);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleSearch = (value) => {
    console.log(value)
    let autoCompleteResult;
    if (!value || value.indexOf('@') >= 0) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const children = autoCompleteResult.map(email => <AutoCompleteOption key={email}>{email}</AutoCompleteOption>);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 3,
        },
      },
    };

    const btnFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 10,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    return (
      <div className="register">
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="register-form">
          <Form.Item
            label={(
              <span>
                姓名&nbsp;
                <Tooltip title="请输入真实姓名?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请输入姓名!', whitespace: true }],
            })(
              <Input  placeholder="请输入姓名"/>
            )}
          </Form.Item>
          <Form.Item
            label="密码"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password"  placeholder="请输入密码"/>
            )}
          </Form.Item>
          <Form.Item
            label="再次确认密码"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认您的密码是否与以上输入一致!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请再次输入密码"/>
            )}
          </Form.Item>
          {/* <Form.Item
            label="Habitual Residence"
          >
            {getFieldDecorator('residence', {
              initialValue: ['zhejiang', 'hangzhou', 'xihu'],
              rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
            })(
              <Cascader options={residences} />
            )}
          </Form.Item> */}
          <Form.Item
            label="电话号码"
          >
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入手机号!' }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="请输入电话号码"/>
            )}
          </Form.Item>
          <Form.Item
            label="邮箱"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: '无效的邮箱',
              }, {
                required: true, message: '请输入邮箱地址',
              }],
            })(
              <AutoComplete
                onSearch={(value)=>this.handleSearch(value)}
                placeholder="请输入正确的邮箱"
              >
                {children}
              </AutoComplete>
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>我已阅读 <a href="">协议</a></Checkbox>
            )}
          </Form.Item>
          <Form.Item {...btnFormItemLayout}>
            <Button type="primary" htmlType="submit">注册</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const Register = Form.create({ name: 'register' })(register);

export default Register; 