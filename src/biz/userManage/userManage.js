import React, { Component } from 'react'
import { Table, Spin, Layout, Form, Row, Col, Input, Button, Icon, message} from 'antd';
import api from '../api'
import './userManage.less'

const { Header, Content } = Layout;

class user extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      userList: [],
      columns: [
        {
          title: '序号',    
          dataIndex: 'key',
        },
        {
        title: '用户名',
        dataIndex: 'username',
        }, 
        {
          title: '手机号码',
          dataIndex: 'phone',
        }, 
        {
          title: 'email',    
          dataIndex: 'email',
        },
        {
          title: 'qq',    
          dataIndex: 'qq',
        },
        {
          title: '注册时间',    
          dataIndex: 'registerDate',
        },
      ],
      expand: false,
    }
  }

  componentWillMount(){
    let { userList } = this.state
    console.log("用户")
    api.getUserList().then(data => {
      data.data.map((item,index) => {
        userList.push({
          key: index+1,
          username: item.username,
          phone: item.phone,
          email: item.email,
          qq: item.qq,
          registerDate: item.registerDate 
        })
      })
      this.setState({
        userList
      })
    })
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleSearch = (e) => {
    message.loading("加载中...",0)
    let temp = []
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      api.adminSearchUser({
        params: {
          ...values
        }
      }).then(data => {
        message.destroy()
        if(data.resultCode == 0){
          data.data.map((item,index) => {
            temp.push({
              key: index+1,
              username: item.username,
              phone: item.phone,
              email: item.email,
              qq: item.qq,
              registerDate: item.registerDate 
            })
          })
          this.setState({
            userList: temp
          })
        }else{
          message.info(data.resultMsg)
        }
      })
      console.log('Received values of form: ', values);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { selectedRowKeys, columns, userList } = this.state;
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: 'Select All Data',
        onSelect: () => {
          this.setState({
            selectedRowKeys: [...Array(46).keys()], // 0...45
          });
        },
      }],
      onSelection: this.onSelection,
    };
    return (
      <div className="user">
        <Layout>
          <Header style={{ background: '#fff', padding: 0, height: "auto" }}>
            <Form
              className="ant-advanced-search-form"
              onSubmit={(e)=>this.handleSearch(e)}
            >
              <Row gutter={24}>
                <Col span={8} key="1">
                  <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                      rules: [{
                        // required: true,
                        message: 'Input something!',
                      }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} key="2">
                  <Form.Item label="手机号码">
                    {getFieldDecorator('phone', {
                      rules: [{
                        // required: true,
                        message: 'Input something!',
                      }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} key="3">
                  <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                      rules: [{
                        // required: true,
                        message: 'Input something!',
                      }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} key="4">
                  <Form.Item label="qq">
                    {getFieldDecorator('qq', {
                      rules: [{
                        // required: true,
                        message: 'Input something!',
                      }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </Header>
          <Content style={{
            background: '#fff'
          }}>
            <Spin spinning={userList && userList.length>0 ? false: true} tip="加载中...">
              <Table rowSelection={rowSelection} columns={columns} dataSource={userList} pagination={{defaultPageSize: 8}}/>
            </Spin>
          </Content>
        </Layout>
      </div>
    );
  }
}
const User = Form.create({ name: 'advanced_search' })(user);
export default User; 