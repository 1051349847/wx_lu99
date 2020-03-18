// pages/shop/shop.js
import {Box} from "../../model/box";
import {Product} from "../../model/product";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initAllData();


  },

  async initAllData() {
 const product = await Product.getAllProducts();
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      product:product,
      loadingHidden: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onProductTap(event) {

    let id = Product.getDataSet(event,'id')

    wx.navigateTo({
      url:'../product/product?id='+id
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