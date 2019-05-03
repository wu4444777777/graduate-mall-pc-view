import React, { Component } from 'react'
import { Layout, Menu, Icon, Statistic, Row, Col, Card } from 'antd';
import './home.less'
import OrderManage from '../orderManage/orderManage'
import UserManage from '../userManage/userManage'
import ProductManage from '../productManage/productManage'
import ActivityManage from '../activityManage/activityManage'
import api from '../api'
import util from '../../utils/index'
const { Sider, Content } = Layout;

class home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      collapsed: false,
      tabIndex: [
        {
          name: "首页",
          index: "0",
          icon: 'user'
        },
        {
          name: "订单管理",
          index: "1",
          icon: 'user'
        },
        {
          name: "用户管理",
          index: "2",
          icon: 'user'
        },
        {
          name: "活动中心",
          index: "3",
          icon: 'user'
        },
        {
          name: "商品管理",
          index: "4",
          icon: 'user'
        }
      ],
      selectTab: "0"
    }
  }

  componentWillMount(){
    let dateNow = util.formatNowTime().split(" ")[0]
    api.getUserAmount({
      params: {
        registerDate: dateNow
      }
    }).then(data => {
      this.setState({
        todayAddNewUser: data.data.userAmount,
        addUserPercentage: data.data.addUserPercentage
      })
    })
    api.getOrderAmount({
      params: {
        confirmTime: dateNow
      }
    }).then(data => {
      this.setState({
        todayAddNewOrder: data.data.orderAmount,
        todayAddAmount: data.data.totalPrice,
        addOrderPercentage: data.data.orderPercentage
      })
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  setSelectedTab(e){
    this.setState({
      selectTab: e.key
    })
  }
  render() {
    let { tabIndex, selectTab, todayAddNewUser, todayAddNewOrder, todayAddAmount, addUserPercentage, addOrderPercentage } = this.state
    return (
      <div className="home">
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
              {
                tabIndex.map((item,index) =>(
                  <Menu.Item key={index} onClick={(e)=> this.setSelectedTab(e)}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Menu.Item>
                ))
              }
            </Menu>
            <div className="collapseIcon">
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </div>
          </Sider>
          <Layout>
            <Content style={{
              margin: '24px 16px', padding: 24, background: '#fff', minHeight: "auto",
            }}
            >
            {
              selectTab == '0' && (
                <div className="statistic">
                  <Row gutter={36}>
                    <Col span={8}>
                      <Statistic title="今日新增用户" value={todayAddNewUser} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="今日新增订单" value={todayAddNewOrder} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="今日新增销售额" value={todayAddAmount} precision={2} />
                    </Col>
                  </Row>
                  <Row gutter={16} className="percentage">
                    <Col span={12}>
                      <Card>
                        <Statistic
                          title="新增用户百分比"
                          value={addUserPercentage}
                          precision={2}
                          valueStyle={{ color: '#3f8600' }}
                          // prefix={<Icon type="arrow-up" />}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card>
                        <Statistic
                          title="新增订单百分比"
                          value={addOrderPercentage}
                          precision={2}
                          valueStyle={{ color: '#cf1322' }}
                          // prefix={<Icon type="arrow-down" />}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
            {selectTab == "1" && <OrderManage/>}
            {selectTab == "2" && <UserManage/>}
            {selectTab == "4" && <ProductManage props={this.props}/>}
            {selectTab == "3" && <ActivityManage/>}
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default home; 