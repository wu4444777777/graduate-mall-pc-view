import React, { Component } from 'react'
import { Table, Spin, Layout, Form, Row, Col, Input, Button, Icon, message } from 'antd';
import api from '../api'
import './orderManage.less'
const { Header, Content } = Layout;

class order extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
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
          title: '联系电话',
          dataIndex: 'userphone',
        },
        {
          title: '商品名称',
          dataIndex: 'productname',
        },
        {
          title: '单价',
          dataIndex: 'price',
        },
        {
          title: '购买数量',
          dataIndex: 'num',
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
        },
        {
          title: '收货地址',
          dataIndex: 'address',
        },
        {
          title: '下单时间',
          dataIndex: 'confirmTime'
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          render: (value)=>{
            console.log("status",value)
            if(value == 101){
              return (
                <div>已支付</div>
              )
            }else{
              return (
                <div>未支付</div>
              )
            }
          }
        }
      ],
      orderList: []
    }
  }

  componentWillMount(){
    let { orderList } = this.state
    api.getOrderList().then(data => {
      data.data.map((item,i) => {
        orderList.push({
          key: i+1,
          username: item.username,
          userphone: item.userphone,
          productname: item.productName,
          price: item.price,
          num: item.num,
          totalPrice: item.totalPrice,
          address: item.address,
          orderStatus: item.orderStatus,
          confirmTime: item.confirmTime
        })
      })
      this.setState({
        orderList
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
      api.adminSearchOrder({
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
              userphone: item.userphone,
              productname: item.productName,
              price: item.price,
              num: item.num,
              totalPrice: item.totalPrice,
              address: item.address,
              orderStatus: item.orderStatus,
              confirmTime: item.confirmTime
            })
          })
          this.setState({
            orderList: temp
          })
        }else{
          message.info(data.resultMsg)
        }
      })
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { selectedRowKeys, columns, orderList } = this.state;
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
      }, {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      }, {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      }],
      onSelection: this.onSelection,
    };
    return (
      <div className="order">
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
                  <Form.Item label="联系电话">
                    {getFieldDecorator('userphone', {
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
                  <Form.Item label="商品名称">
                    {getFieldDecorator('productName', {
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
                  <Form.Item label="订单状态">
                    {getFieldDecorator('orderStatus', {
                      rules: [{
                        // required: true,
                        message: 'Input something!',
                      }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} key="5">
                  <Form.Item label="收货地址">
                    {getFieldDecorator('address', {
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
            <Spin spinning={orderList && orderList.length>0 ? false: true} tip="加载中...">
              <Table rowSelection={rowSelection} columns={columns} dataSource={orderList} pagination={{defaultPageSize: 6}}/>
            </Spin>
          </Content>
        </Layout>
      </div>
    );
  }
}
const Order = Form.create({ name: 'Order_search' })(order);

export default Order; 