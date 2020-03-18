// pages/user/user.js
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
    loadingHidden: false,
    addressInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initAllData();
  },
  onShow() {
    let that=this
    // 未读消息数
    app.request_T(api.Notify_unread, 'GET').then(function(res) {
      console.log(res.data)
      that.setData({
        msg_number:res.data
      })
    })
  },
  /**
   * 数据初始化函数 -- 数据绑定
   */
  initAllData() {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {

          console.log(res)

          that.setData({
            authorized: true,
            navH: wx.getStorageSync('navHeight'),
            screenH: wx.getStorageSync('sHeight'),
            loadingHidden: true

          })
        } else {

          that.setData({
            navH: wx.getStorageSync('navHeight'),
            screenH: wx.getStorageSync('sHeight'),
            authorized: false,
            loadingHidden: true
          });
        }

      }
    })



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  async onGotUserInfo(e) {
    let that = this;
    let userData = e.detail.userInfo
    if (e.detail.userInfo) {
      await User.setUserInfo(userData);
      that.setData({
        authorized: true
      })
    }
  },

  /*修改或者添加地址信息*/
  edit() {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        if (res.telNumber) {
          that._bindAddressInfo(addressInfo);
          //保存地址
          address.submitAddress(res, (flag) => {
            if (!flag) {
              that.showTips('操作提示', '地址信息更新失败！');
            }
          });
        } else {
          //模拟器上使用
          that.showTips('操作提示', '地址信息更新失败,手机号码信息为空！');
        }
      }
    })
  },
  // 优惠券 暂未开放
  onCoupon() {
    wx.showModal({
      title: '提示',
      content: '暂未开放',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  //联系方式
  onTel() {
    wx.makePhoneCall({
      phoneNumber: '029-63077358'
    })
  },
  //消息列表
  onNotify() {
    wx.navigateTo({
      url: '../notify/index'
    })
  },
  onNotify_T(){
    wx.navigateTo({
      url: '/pages/Shielding_photos/Shielding_photos'
    })
  },
  //订单列表
  OnTapOrder(event) {

    let index = event.currentTarget.dataset.index

    wx.navigateTo({
      url: '../myorder/myorder?index=' + index
    })
  },

  /**
   * 账号与安全
   */
  onSecurity() {
    wx.navigateTo({
      url: '/pages/security/security'
    })
  }
})