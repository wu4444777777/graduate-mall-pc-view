import {observable,action,runInAction} from 'mobx';
import axios from 'axios'

class API {
  // @observable
    @observable  state = {
        product: {},
        loginout: false,
        formData: {

        },
        orderList: []
    }

    // 储存数据
    @action
    setStoreData(name,data) {
      this.state[name] = data
      console.log("server",this.state)
    }

    @action
    async getOrderList(){
      let { data } = await axios.get('http://localhost:4530/order/adminGetOrderList')
      return data
    }

    @action
    async getUserList(){
      let { data } = await axios.get('http://localhost:4530/user/getUserList')
      return data
    }

    @action
    async getProductList(){
      let { data } = await axios.get('http://localhost:4530/classify/getAllProduct')
      return data
    }

    @action
    async getActivityList(){
      let { data } = await axios.get('http://localhost:4530/activity/getActivityList')
      return data
    }

    @action
    async addNewActivity(params){
      let { data } = await axios.post('http://localhost:4530/activity/addActivityInfo',params)
      return data
    }

    @action
    async getUserAmount(params){
      let { data } = await axios.get('http://localhost:4530/user/getUserAmount',params)
      return data
    }

    @action
    async getOrderAmount(params){
      let { data } = await axios.get('http://localhost:4530/order/getOrderAmount',params)
      return data
    }

    @action 
    async adminSearchOrder(params){
      let { data } = await axios.get('http://localhost:4530/order/adminSearchOrderInfo',params)
      return data
    }

    @action
    async adminSearchProduct(params){
      let { data } = await axios.get('http://localhost:4530/search/adminSearchProduct',params)
      return data
    }

    @action
    async adminSearchUser(params){
      let { data } = await axios.get('http://localhost:4530/user/AdminSearchUserInfo',params)
      return data
    }

    @action 
    async adminSearchActivity(params){
      let { data } = await axios.get('http://localhost:4530/activity/adminSearchActivityInfo',params)
      return data
    }

    @action
    async setSellStatus(params){
      let { data } = await axios.get('http://localhost:4530/classify/setsellStatus',params)
      return data
    }

    @action
    async adminRegister(params){
      let { data } = await axios.post('http://localhost:4530/user/adminRegister',params)
      return data
    }

    @action
    async adminLogin(params){
      let { data } = await axios.get('http://localhost:4530/user/adminLogin',params)
      return data
    }
}

const api = new API();
export default api;