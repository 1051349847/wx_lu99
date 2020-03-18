// pages/box/box.js

import {
  Box
} from "../../model/box";
import { Image } from "../../model/image";

import { User } from "../../model/user";
const utils = require('../../utils/http.js');
const api = require('../../config/api.js');
const app = getApp();
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabDefault: 'checkbox_N',
    loadingType: 'loading',
  },
  nav_back(){
    console.log(1)
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options){

    let that=this
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
  },
  checkbox: function (e) {
    console.log(e)
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
   * 跳转到商城
   */
  onShopTap() {
    wx.navigateTo({
      url: '../shop/shop'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    let data = {
      page: page
    }
    app.request_T(api.Box_box_list, data, 'GET').then(res => {
      let data=res.data
      var data_list=[]
      for (let i in data){

        let arry = data[i]
        let arry_slic=arry.slice(0, 10000)
        data[i] = arry_slic
        for (let j = 0; j < data[i].length;j++){
          data[i][j].ind = i
        }
        
        data_list.push(arry_slic)
      }
      
      console.log(data_list)
      that.setData({
        grid_: data_list,
        navH: wx.getStorageSync('navHeight'),
        loadingHidden: true
      })
      wx.stopPullDownRefresh();
    }, res => {

    })
  },
  previewImage(e) {
    // console.log(e)
    // console.log(e.currentTarget.dataset.index)
    let that = this
    let index = e.currentTarget.dataset.index//当前图片index
    let ind = e.currentTarget.dataset.ind// 上一级index
    let img_src = e.currentTarget.dataset.src//当前图片路径
    let img_arry = that.data.grid_
    let image_arry=[]
    for (let i = 0; i < img_arry[ind].length;i++){
      image_arry.push(img_arry[ind][i].image.img_url)
    }
    wx.previewImage({
      current: img_src, // 当前显示图片的http链接
      urls: image_arry // 需要预览的图片http链接列表
    })
    console.log(image_arry)
  },
  InputChange(e) {
    let that = this
    that.setData({
      title: e.detail.value,
    })
  },
  seach_submit() {
    let that = this
    if (!that.data.title){
      wx.showToast({
        title: '搜索内容不可为空',
        icon:'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/search_results/search_results?servalue=' + that.data.title+'&type='+2,
    })
    that.setData({
      title:''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    page = 1
    this.onShow()
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