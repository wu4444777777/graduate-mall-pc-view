import React, { Component } from 'react'
import { Table, Spin, Layout, Form, Row, Col, Input, Button, Icon, message } from 'antd';
import api from '../api'
import './productManage.less'
const { Header, Content } = Layout;

class product extends Component {
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
          title: '商品名称',    
          dataIndex: 'name',
        },
        {
          title: '价格',    
          dataIndex: 'price',
        },
        {
          title: '类型',    
          dataIndex: 'type',
          render: (val) => {
            switch (val){
              case "cloth":
                return <div>衣服</div>
              case "food":
                return <div>食品</div>
              case "pill":
                return <div>药品</div>
              case "life":
                return <div>生活用品</div>
              case "digital":
                return <div>数码产品</div>  
              case "decorate":
                return <div>饰品</div>
              case "shoes":
                return <div>鞋子</div>
              case "bag":
                return <div>箱包</div>
              break;
            }
          }
        },
        {
          title: '主图链接',    
          dataIndex: 'imageUrl',
          render: (value) => (
            <div style={{width:'200px',margin: "0 auto"}}>
              <img style={{width: '100%'}} src={value}/>
            </div>
          )
        },
        {
          title: '热推？',    
          dataIndex: 'prior',
          render: (value)=> {
            console.log("prior",value)
            if(value == 1) {
              return <span>是</span>
            }else{
              return <span>否</span>
            }
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          render: (item) => {
            if(item.sellStatus == 1){
              return(
                <div className="action" onClick={()=> this.setSellStatus(item.id,0)}>下架</div>
              )
            }else{
              return(
                <div className="action" onClick={()=> this.setSellStatus(item.id,1)}>上架</div>
              )
            }
          }
        }
      ],
      productList: []
    }
  }

  componentWillMount(){
    console.log("props",this.props)
    let { productList } = this.state
    api.getProductList().then((data) => {
      data.data.map((item,i)=>{
        productList.push({
          key: i+1,
          name: item.name,
          price: item.price,
          type: item.type,
          imageUrl: item.imageUrl,
          prior: item.prior,
          action: item
        })
      })
      this.setState({
        productList
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
      api.adminSearchProduct({
        params: {
          ...values
        }
      }).then(data => {
        message.destroy()
        if(data.resultCode == 0){
          data.data.map((item,index) => {
            temp.push({
              key: index+1,
              name: item.name,
              price: item.price,
              type: item.type,
              imageUrl: item.imageUrl,
              prior: item.prior,
              action: item
            })
          })
          this.setState({
            productList: temp
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

  setSellStatus(val,status){
    message.loading("加载中...",0)
    let temp = []
    api.setSellStatus({
      params: {
        id: val,
        sellStatus: status
      }
    }).then(data =>{
      message.destroy()
      if(data.resultCode == 0){
        message.success(data.resultMsg)
        data.data.map((item,index) => {
          temp.push({
            key: index+1,
            name: item.name,
            price: item.price,
            type: item.type,
            imageUrl: item.imageUrl,
            prior: item.prior,
            action: item
          })
        })
        this.setState({
          productList: temp
        })
      }else{
        message.info(data.resultMsg)
      }
    })
  }

  url(path){
    let go = this.props.props
    go.history.push(path)
  }
  render() {
    const { selectedRowKeys, columns, productList } = this.state;
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
      <div className="product">
        <Layout>
          <Header style={{ background: '#fff', padding: 0, height: "auto" }}>
            <Form
              className="ant-advanced-search-form"
              onSubmit={(e)=>this.handleSearch(e)}
            >
              <Row gutter={24}>
                <Col span={8} key="1">
                  <Form.Item label="商品名称">
                    {getFieldDecorator('productname', {
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
            <Spin spinning={productList && productList.length>0 ? false: true} tip="加载中...">
              {/* <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">新增商品</Button> */}
              <Table rowSelection={rowSelection} columns={columns} dataSource={productList} pagination={{defaultPageSize: 6}}/>
            </Spin>
          </Content>
        </Layout>
      </div>
    );
  }
}

const Product = Form.create({ name: 'product_search' })(product);
export default Product; 