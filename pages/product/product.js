// pages/product/product.js
import {
  Product
} from "../../model/product";
import {
  Cart
} from "../../model/cart";
import {
  Order
} from "../../model/order";
var WxParse = require('../wxParse/wxParse.js');

const api = require('../../config/api.js');
const app = getApp();
var curr_arry
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    productCounts: 1,
    s_name: '',
    currentTabsIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initAllData(options);
  },

  onShow() {
    let that = this
    if (that.data.curr_arry) {
      curr_arry = that.data.curr_arry
      that.setData({
        curr_arry_length: curr_arry.length
      })
      console.log(curr_arry, curr_arry.length)
    } else {
      console.log('没有选择图片')
    }
    if (that.data.s_name) {
      that.setData({
        s_name: that.data.s_name
      })
    }
  },
  async initAllData(options) {

    let that = this;
    let id = options.id
    that.setData({
      shop_id: options.id
    })
    if (options.s_id) {
      that.data.s_id = options.s_id;
    }
    console.log(options)
    const ProductDetail = await Product.getProductDetail(id);


    this.setData({
      product: ProductDetail,
      navH: wx.getStorageSync('navHeight'),
      loadingHidden: true

    })

    var temp = WxParse.wxParse('article', 'html', ProductDetail.content, this, 0);
  },
  //选择设计师
  onStylistSelect() {
    let that = this
    console.log(that.data.s_name)
    if (that.data.s_name) {
      wx.navigateTo({
        url: "./custom/index?s_name=" + that.data.s_name
      })
    } else {
      wx.navigateTo({
        url: "./custom/index"
      })
    }

  },
  onImageSelect() {
    let that = this
    if (!that.data.curr_arry) {
      wx.navigateTo({
        url: '/pages/Choose_photos/Choose_photos',
      })
    } else {
      wx.navigateTo({
        url: '/pages/Choose_photos/Choose_photos?curr_arry=' + that.data.curr_arry,
      })
    }
    return false
    wx.navigateTo({
      url: '/pages/Choose_photos/Choose_photos',
    })

  },
  gopay(event) {
    let that = this;

    let isRegister = wx.getStorageSync('is_register');
    if (!isRegister) {

      wx.showToast({
        title: '您未注册，请先注册。',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function() {
        that.setData({
          btnStatus: "goKillTap"
        })
        wx.navigateTo({
          url: '/pages/reg_nav/reg_nav',
        });
      }, 1000)



      return;
    }
    if (!that.data.curr_arry) {
      wx.showToast({
        title: '请选择照片',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (!that.data.s_name) {
      wx.showToast({
        title: '请选择设计师',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let id = event.currentTarget.dataset.id
    let price = event.currentTarget.dataset.price

    wx.navigateTo({
      url: '../order/order?id=' + id + '&counts=1' + '&price=' + price + '&from=product' + '&curr_arry=' + that.data.curr_arry + '&s_name=' + that.data.s_name,
    })
  },

  // 保存订单
  Order_save() {
    let that = this
    let isRegister = wx.getStorageSync('is_register');
    if (!isRegister) {

      wx.showToast({
        title: '您未注册，请先注册。',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function() {
        that.setData({
          btnStatus: "goKillTap"
        })
        wx.navigateTo({
          url: '/pages/reg_nav/reg_nav',
        });
      }, 1000)



      return;
    }
    if (!that.data.curr_arry) {
      wx.showToast({
        title: '请选择照片',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (!that.data.s_name) {
      wx.showToast({
        title: '请选择设计师',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let curr_arry_ = that.data.curr_arry
    let img_arry = []
    for (let i = 0; i < curr_arry_.length; i++) {
      let data = {
        img_url: that.data.curr_arry[i]
      }
      img_arry.push(data)
    }
    let data = {
      images: img_arry,
      products: {
          product_id: that.data.shop_id,
          stylist: that.data.s_name,
        }
      
      // products: [
      //   that.data.shop_id,
      //   that.data.s_name,
      // ]
    }
    console.log(data)

    app.request_T(api.Order_save, data, 'post').then(res => {
      console.log(res)
    }, res => {
      console.log(res)
    })
  },



})