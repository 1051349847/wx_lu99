// pages/notify/index.js
import {User} from "../../model/user";
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
    this.initAllData();

  },


  async initAllData() {
    let grid = await User.getUserNotify()
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      navW: wx.getStorageSync('wHeight'),
      grid:grid,
      loadingHidden: true
    })
  },
  onDelUser(e){
    console.log(e.currentTarget.dataset.id)
    let that=this
    let data={
      id: e.currentTarget.dataset.id
    }
    app.request_T(api.Notify_del, data, 'POST').then(function (res) {
      console.log(res)
      wx.showToast({
        title: '删除成功',
        
      })
      that.initAllData();
    })
    // Notify_del
  },
  /**
   * 查看消息
   */
  async onRead(event) {
      let id = User.getDataSet(event,'id')
      await User.onReadNotify(id);
      wx.navigateTo({
        url:'./detail/index?id='+id
      })
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