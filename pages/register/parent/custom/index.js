// pages/security/security.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      screenH: wx.getStorageSync('sHeight'),
      loadingHidden: true
    });
  },

  formSubmit(e){

    let {name} = e.detail.value;

    wx.setStorageSync('role',name)
    wx.navigateBack()

  }

})