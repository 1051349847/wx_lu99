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
var servalue_Ar
var res_ary = []
var des_arry = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabDefault: 'checkbox',
    tabDefault: 'checkbox_N ',
    res_leng: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let that = this
    that.setData({
      navH: wx.getStorageSync('navHeight'),
    })
  
    if (options) {
      that.setData({
        type: options.type
      })
      if (options.type == 2) {
        let servalue = options.servalue
        let data = {
          title: servalue
        }
        app.request_T(api.Box_search, data, 'POST').then(function(res) {
          console.log(res.data)
          if (res.data.msg == '请输入有效参数' || res.data.msg =='无数据') {
            that.setData({
              N_data: true
            })
          } else {
            that.setData({
              N_data: false
            })
            console.log(res.data)
            let data = res.data
            for (let i = 0; i < data.length; i++) {
              data[i].index = i
              for (let j = 0; j < data[i].length; j++) {
                data[i][j].checked = false
                data[i][j].index = i
              }
            }
            console.log(res.data)
            that.setData({
              Search_res: res.data
            })
          }

          console.log(that.data.Search_res)
        })
      } else {
        let servalue = options.servalue
        servalue_Ar = servalue.split(",");
        let data_ = {
          class_id: wx.getStorageSync('class_id'),
          servalue: servalue_Ar
        }
        app.request_T(api.Index_search, data_, 'POST').then(function(res) {
          let data = res.data
          console.log(res)
          if (res.data.msg == '请输入有效参数' || res.data.msg=='无数据') {
            that.setData({
              N_data: true
            })
          } else {
            that.setData({
              N_data: false
            })
            console.log(res.data)
            for (let i = 0; i < data.length; i++) {
              data[i].index = i
              for (let j = 0; j < data[i].images.length; j++) {
                data[i].images[j].checked = false
              }
            }
            that.setData({
              Search_res: res.data
            })
          }
        })
      }
    }
    


  },
  previewImage(e) {
    let that = this
    let index = e.currentTarget.dataset.index; //获取当前点击图片的下标
    let ind = e.currentTarget.dataset.ind; //获取当前图片上一级的下标
    let img_src = e.currentTarget.dataset.src; //当前图片路径
    let Search_res_images = that.data.Search_res[ind].images
    let images_Arry = []
    for (let i = 0; i < Search_res_images.length; i++) {
      images_Arry.push(Search_res_images[i].img_url)
    }
    wx.previewImage({
      current: img_src, // 当前显示图片的http链接
      urls: images_Arry // 需要预览的图片http链接列表
    })
  },
  previewImage_T(e) {
    let that = this
    console.log(e)

    let ind = e.currentTarget.dataset.ind; //获取当前图片上一级的下标
    let img_src = e.currentTarget.dataset.src; //当前图片路径
    let Search_res_images = that.data.Search_res[ind]
    console.log(that.data.Search_res[ind])
    let images_Arry = []
    for (let i = 0; i < Search_res_images.length; i++) {
      images_Arry.push(Search_res_images[i].image.img_url)
    }
    wx.previewImage({
      current: img_src, // 当前显示图片的http链接
      urls: images_Arry // 需要预览的图片http链接列表
    })
  },
  checkbox: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index; //获取当前点击图片的下标
    let ind = e.currentTarget.dataset.ind; //获取当前图片上一级的下标
    let Search_res = this.data.Search_res; //选项集合
    Search_res[ind].images[index].checked = !Search_res[ind].images[index].checked; //改变当前选中的checked值
    let id = Search_res[ind].images[index].id
    let data = that.data.Search_res
    let index_ind = that.KeyValue(res_ary, "img_id", id);
    let ind_ = res_ary.indexOf(id)
    if (index_ind) {
      res_ary.splice(ind_, 1)
    } else {
      let obj = {
        img_id: id,
        description: that.data.Search_res[ind].description
      }
      res_ary.push(obj)
      console.log(res_ary)
    }
    that.setData({
      Search_res: Search_res,
      res_leng: res_ary.length,
      res_ary: res_ary
    });
  },
  // 查对象值
  KeyValue(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return i;
      }
    }
    return null;
  },
  operation_ope() {
    let that = this
    that.setData({
      tabDefault: 'checkbox',
    })
  },
  operation_ope_N() {
    let that = this
    let data = that.data.Search_res
    for (let i = 0; i < data.length; i++) {
      data[i].index = i
      for (let j = 0; j < data[i].images.length; j++) {
        data[i].images[j].checked = false
        data[i].images[j].index = i
      }
    }
    res_ary = []
    that.setData({
      tabDefault: 'checkbox_N',
      Search_res: data,
      res_leng: res_ary.length,
    })

  },
  operation_over() {
    let that = this
    console.log(that.data.res_ary)
    let data = {
      data: that.data.res_ary
    }
    app.request_T(api.Box_save, data, 'post').then(res => {
      wx.showToast({
        title: '保存成功',
      })
      that.setData({
        tabDefault: 'checkbox_N',
      })
      that.operation_ope_N()
    }, res => {
      console.log(res)
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