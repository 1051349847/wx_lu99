// pages/Shielding_photos/Shielding_photos.js

import { Image } from "../../model/image";
import { Box } from "../../model/box";
import { User } from "../../model/user";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabDefault: 'checkbox',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this
    if (options.src) {
      let video_url = options.src;
      this.setData({
        video_url: video_url,
        navH: wx.getStorageSync('navHeight'),
        loadingHidden: true
      })

    } else {
      let id = 253
      that.data.group_id = id
      const data = await Image.getListById(id)

      let grid = data.images
      console.log()
      for (let i = 0; i < grid.length; i++) {
        grid[i].checked = false
      }

      this.setData({
        images: data,
        grid: grid,
        navH: wx.getStorageSync('navHeight'),
        loadingHidden: true
      })
    }

  },
  checkbox: function (e) {
    let index = e.currentTarget.dataset.index;//获取当前点击的下标
    let grid = this.data.grid;//选项集合
    grid[index].checked = !grid[index].checked;//改变当前选中的checked值

    let res = [];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].checked) {
        res.push(grid[i].id)
      }
    }


    wx.removeStorageSync('selectImg')
    wx.setStorageSync('selectImg', res)
    this.setData({
      grid: grid
    });


    console.log(grid)
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