// pages/register/students/students.js

import { Register } from "../../model/register";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCaptcha: 'getCaptcha',
    text: '获取验证码',
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      navH: wx.getStorageSync('navHeight'),
      snavH: wx.getStorageSync('sHeight')

    })
  },

  //日期选择器
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  // 获取验证码
  async getCaptcha() {
    let that = this;
    let mobile = that.data.mobile

    if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      });
      return;
    }

    that.setData({
      getCaptcha: '',
      text: '重新发送',

    })

    //获取验证码
    const captcha = await Register.sendSms(mobile)
  },
  resetCap() {
    this.setData({
      getCaptcha: 'getCaptcha',
      text: '获取验证码'

    })
  },
  toNumber(e) {
    console.log(e.detail.value)
    this.data.mobile = e.detail.value;
  },
  //提交表单
  formSubmit: async function (e) {

    let { name, birthday, mobile, captcha } = e.detail.value;
    if (!mobile || !name || !captcha) {

      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });

      return;

    }
    if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      });
      return;
    }

    const dataUser = [];
    dataUser['birthday'] = birthday;
    dataUser['captcha'] = captcha;
    dataUser['name'] = name;
    dataUser['mobile'] = mobile;
    dataUser['type'] = 4;
    dataUser['role'] = '';
    dataUser['subjects'] = '';

    const register = await Register.validUserInfo(dataUser);

    if (register.code === 0) {
      wx.showToast({
        title: register.msg,
        icon: 'none'
      });

      return;
    }
    wx.showToast({
      title: '注册成功',
      icon: 'success'
    });

    wx.setStorageSync('is_register', true)

    setTimeout(function () {
      wx.switchTab({
        url: '/pages/home/home',
      });
    }, 1000)


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})