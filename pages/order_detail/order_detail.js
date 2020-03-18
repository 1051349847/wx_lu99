// pages/order_detail/order_detail.js
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
  onLoad: function (options) {
    let that = this
    that.setData({
      navH: wx.getStorageSync('navHeight'),
      screenH: wx.getStorageSync('sHeight'),
    })
    console.log(options.id)
    if (options){
      let data={
        id:options.id
      }
      app.request_T(api.Order_detail, data, 'GET').then(function (res) {
        console.log(res.data)
        that.setData({
          data:res.data
        })
      })
    }
   
  },
  buy(e){
    console.log(e.currentTarget.dataset.id)
    let that=this
    let data={
      id: e.currentTarget.dataset.id
    }
    app.request_T(api.Pay_pre_order,data, 'POST').then(function (res) {
      console.log(res.data)
      let timeStamp = res.data.timeStamp
      wx.requestPayment({
        'timeStamp': timeStamp.toString(),
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
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
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})