// pages/notify/detail/index.js
import {User} from "../../../model/user";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id
    this.data.id = options.id
    const detail = await User.getNotifyDetail(id);
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      navW: wx.getStorageSync('wHeight'),
      loadingHidden: true,
      detail: detail
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */ async allow() {
    let that = this;
    let id = that.data.id
    await User.allowUser(id);
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