import {Order} from "../../model/order";

const App = new getApp()
const api = require('../../config/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this._loadData();
  },

  _loadData: async function () {

    const res = await Order.getMyOrder();

    this.setData({
      myOrderList: res.data,
      navH: wx.getStorageSync('navHeight')
    })

  },

  async receipt(event) {
    const res = await Order.receipt();
  },
  /*
   * 进行第二次支付
   */
  rePay(event) {
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    this._execPay(id, index);
  },

  _execPay: async function (id, index) {
    var that = this;
    //调用支付返回结果有延迟 1-2秒
    const payData = await Order.execPay(id);

    let timeStamp = payData.timeStamp;

    if (timeStamp) { //可以支付
      wx.requestPayment({
        'timeStamp': timeStamp.toString(),
        'nonceStr': payData.nonceStr,
        'package': payData.package,
        'signType': payData.signType,
        'paySign': payData.paySign,
        success: function (res) {
          wx.showToast({
            title: '支付成功',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)

        },

        fail: function (err) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)

        }

      });

    } else {
      that.showTips('支付失败', '商品已下架或库存不足');
    }
  },
  orde_detail(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
   
    wx.navigateTo({
      url: "/pages/order_detail/order_detail?id=" + id,
    })
  },
  InputChange(e){
    console.log(e.detail.value)
    let that=this
    that.setData({
      Input: e.detail.value
    })
  },
  Order_search(){
    let that=this
    let data={
      name: that.data.Input
    }
    app.request_T(api.Order_search, data, 'POST').then(function (res) {
      console.log(res)
      that.setData({
        myOrderList:res.data
      })
    })
  },
  onClearTap(){
    this._loadData();
  }

})