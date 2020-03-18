// pages/Shielding_photos/Shielding_photos.js

import {
  Image
} from "../../model/image";
import {
  Box
} from "../../model/box";
import {
  User
} from "../../model/user";
const api = require('../../config/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabDefault: 'checkbox',
    select_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let that = this
    that.setData({
      navH: wx.getStorageSync('navHeight'),
    })
    let data = {
      page: 1
    }
    app.request_T(api.Box_box_list, data, 'GET').then(res => {
      let data = res.data
      var data_list = []
      for (let i in data) {
        console.log(data[i])

        for (let j = 0; j < data[i].length; j++) {
          data[i][j].ind = i
          data[i][j].checked = false
          data_list.push(data[i][j])
        }
      }
      that.setData({
        grid_: data_list,
      })
      if (options) {
        if (options.curr_arry) {
          let curr_arry = (options.curr_arry).split(',')
          console.log(curr_arry)
          let grid_ = that.data.grid_
          console.log(that.data.grid_)
          for (let i = 0; i < grid_.length;i++){
            for (let j = 0; j < curr_arry.length;j++){
              if (curr_arry[j] == grid_[i].image.img_url){
                grid_[i].checked=true
              }
            }
          }
          that.setData({
            select_count: curr_arry.length
          })
        }
      }
      console.log(data_list)
      that.setData({
        grid_: data_list,

      })
    }, res => {})

  },
  checkbox: function(e) {
    let index = e.currentTarget.dataset.index; //获取当前点击的下标
    let grid = this.data.grid_; //选项集合
    grid[index].checked = !grid[index].checked; //改变当前选中的checked值

    let res = [];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].checked) {
        res.push(grid[i].image.img_url)
      }
    }
    console.log(res)
    wx.removeStorageSync('selectImg')
    wx.setStorageSync('selectImg', res)
    this.setData({
      grid_: grid,
      select_count: res.length,
      res_arry: res
    });
  },
  select_but() {
    let that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      curr_arry: that.data.res_arry
    });
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})