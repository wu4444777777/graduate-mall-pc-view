import React, { Component } from 'react'
import { Form, Spin, Layout, Row, Col, Input, DatePicker, Upload, Icon, message, Button, Table, Modal } from 'antd' 
import api from '../api'
import './activityManage.less'
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class activity extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      selectedRowKeys: [], // Check here to configure the default column
      columns: [
        {
          title: '序号',    
          dataIndex: 'key',
        },
        {
          title: '活动名称',
          dataIndex: 'activityName',
        },
        {
          title: '开始时间',
          dataIndex: 'beginTime',
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
        },
        {
          title: '广告语',
          dataIndex: 'advertise',
        },
        {
          title: '活动主图',
          dataIndex: 'activityImage',
          render: (value)=>{
            console.log(value)
            if(value){
              return (
                <div style={{width: 120}}>
                  <img style={{width: '100%'}} src={require("E:/image/"+value)} alt=""/>
                </div>
              )
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          render: ()=>{
            return(
              <div>
                <span style={{color: "#1890ff"}}>编辑</span>
                <span style={{padding: "0 10px"}}>|</span>
                <span style={{color: "#1890ff"}}>删除</span>
              </div>
            )
          }
        }
      ],
      activityList: [],
      visible: false,
      confirmLoading: false,
    }
  }

  componentWillMount(){
    let { activityList } = this.state
    api.getActivityList().then(data=>{
      data.data.map((item,index)=>{
        activityList.push({
          key: index+1,
          activityName: item.activityName,
          beginTime: item.beginTime,
          endTime: item.endTime,
          advertise: item.advertise,
          activityImage: item.imageUrl
        })
      })
      this.setState({
        activityList
      })
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    let temp = []
    this.props.form.validateFields((err, values) => {
      const rangeTimeValue = values['activityTime'];
      const timeValues = {
        'activityTime': [
          rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        ]
      };
      values["beginTime"] = timeValues.activityTime[0]
      values["endTime"] = timeValues.activityTime[1]
      console.log('收到的数据', values,timeValues);
      api.addNewActivity({
        activityName: values.activityName,
        advertise: values.advertise,
        beginTime: values.beginTime,
        endTime: values.endTime,
        imageSrc: values.imageUrl.file.name
      }).then(data => {
        if(data.resultCode == 0){
          data.data.map((item,index)=>{
            temp.push({
              key: index+1,
              activityName: item.activityName,
              beginTime: item.beginTime,
              endTime: item.endTime,
              advertise: item.advertise,
              activityImage: item.imageUrl
            })
          })
        }
        this.setState({
          activityList: temp
        })
      })
    });
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    else if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageSrc: info.file.originFileObj.name,
          imageUrl,
          loading: false,
        })
      })
    }else{
      message.error("上传失败")
    }
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleSearch = (e) => {
    message.loading("加载中...",0)
    let temp = []
    let { activityName, beginTime, endTime} = this.state
    e.preventDefault();
    api.adminSearchActivity({
      params: {
        activityName,beginTime,endTime
      }
    }).then(data =>{
      message.destroy()
      if(data.resultCode == 0){
        data.data.map((item,index) =>{
          temp.push({
            key: index+1,
            activityName: item.activityName,
            beginTime: item.beginTime,
            endTime: item.endTime,
            advertise: item.advertise,
            activityImage: item.imageUrl
          })
        })
        this.setState({
          activityList: temp
        })
      }else{
        message.info(data.resultMsg)
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  changeSearchInput(e,name){
    this.setState({
      [name]: e
    })
  }

  render(){
    let { imageUrl, selectedRowKeys, columns, activityList, visible, confirmLoading } = this.state 
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择时间!' }],
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'alldata',
        text: '全选',
        onSelect: () => {
          this.setState({
            selectedRowKeys: [...Array(46).keys()], // 0...45
          });
        },
      }],
      onSelection: this.onSelection,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div className="activity">
        <div className="addActivity">
          <Modal
            title="新增活动"
            visible={visible}
            onOk={()=>this.handleOk()}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <Form {...formItemLayout} >
              <Form.Item label="活动名称">
                {getFieldDecorator('activityName', {
                  rules: [{ required: true, message: '请输入活动名称' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="广告语">
                {getFieldDecorator('advertise', {
                  rules: [{ required: true, message: '请输入广告语' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label="活动时间"
              >
                {getFieldDecorator('activityTime', rangeConfig)(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </Form.Item>
              <Form.Item
                label="活动主图"
              >
                {getFieldDecorator('imageUrl', {
                  rules: [{ required: true, message: '请上传活动主图' }],
                })(
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="http://localhost:4530/activity/handlePicLoader"
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                  </Upload>
                )}
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, height: "auto" }}>
            <Form
              className="ant-advanced-search-form"
            >
              <Row gutter={24}>
                <Col span={8} key="1">
                  <Form.Item label="活动名称">
                    <Input placeholder="请输入" onChange={(e) => this.changeSearchInput(e.target.value,"activityName")}/>
                  </Form.Item>
                </Col>
                <Col span={8} key="2">
                  <Form.Item label="开始时间">
                    <Input placeholder="请输入" onChange={(e) => this.changeSearchInput(e.target.value,"beginTime")}/>
                  </Form.Item>
                </Col>
                <Col span={8} key="3">
                  <Form.Item label="结束时间">
                    <Input placeholder="请输入" onChange={(e) => this.changeSearchInput(e.target.value,"endTime")} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit"
              onClick={(e)=>this.handleSearch(e)}>搜索</Button>
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
            <Spin spinning={activityList && activityList.length>0 ? false: true} tip="加载中...">
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" onClick={this.showModal.bind(this)}>新增活动</Button>
              <Table rowSelection={rowSelection} columns={columns} dataSource={activityList} pagination={{defaultPageSize: 8}}/>
            </Spin>
          </Content>
        </Layout>
      </div>
    )
  }
}
const Activity = Form.create({ name: 'activity' })(activity);

export default Activity; 