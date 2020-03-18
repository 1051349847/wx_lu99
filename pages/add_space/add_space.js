// pages/add_space/add_space.js
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
    let that=this
    that.setData({
      authorized: true,
      navH: wx.getStorageSync('navHeight'),
      screenH: wx.getStorageSync('sHeight'),
      loadingHidden: true
    })
  },
  space_name(e){
    // console.log(e.detail.value)
    this.setData({
      space_name: e.detail.value
    })
  },
  // 确认创建空间
  submit(){
    let that=this
    if (!that.data.space_name){
      wx.showToast({
        title: '空间名不可为空',
        success:'none'
      })
      return false
    }
    let data={
      name: that.data.space_name
    }
    app.request_T(api.Space_create,data,'post').then(res=>{
      console.log(res)
      wx.switchTab({
        url: '/pages/home/home'
      })
    },res=>{
      console.log(res)
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