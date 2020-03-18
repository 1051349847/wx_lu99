// pages/product/custom/index.js
import {Product} from "../../../model/product";
import {Stylist} from "../../../model/stylist";
const api = require('../../../config/api.js');
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
      navH: wx.getStorageSync('navHeight'),
    })
    app.request_T(api.Stylelist_get_all, 'GET').then(function (res) {
      console.log(res.data)
      let images=res.data
      for (let i = 0; i < images.length; i++) {
        images[i].checked = false
      }
      if (options) {
        if (options.s_name) {
          let s_name = options.s_name
          for (let i = 0; i < images.length;i++){
            if (images[i].name == s_name){
              images[i].checked=true
            }
          }
        }
        
      }
      that.setData({
        images: res.data,
        loadingHidden: true
      })
    })
  },

  async initAllData() {
    let that = this;
    const images = await Stylist.getAll()
    for(let i=0; i<images.length; i++){
      images[i].checked = false
    }
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      images:images,
      loadingHidden: true

    })

  },
  onItemTab(event){
    let index = event.currentTarget.dataset.index;//获取当前点击的下标
    let images = this.data.images;//选项集合
    for(let i=0; i<images.length; i++){
      images[i].checked = false
    }
    images[index].checked = !images[index].checked;//改变当前选中的checked值
    let res=images[index].name;
    wx.setStorageSync('s_name',res)
    this.setData({
      images:images,
      s_name: res
    })
  },
  onSubmit(){
    let that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];   //当前页面
    let prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      s_name: that.data.s_name
    });
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})