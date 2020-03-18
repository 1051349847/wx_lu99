import {Register} from "../../../model/register";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCaptcha:'getCaptcha',
    text:'获取验证码',
    select1:'#FF6F8E',
    select2:'',
    select3:'',
    role:'妈妈',
    mobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      navH: wx.getStorageSync('navHeight'),
      role: '的妈妈',
      snavH: wx.getStorageSync('sHeight')
    })

    if (options.name){
      that.setData({
        role: options.name,
        select1: '',
        select2: '',
        select3: '#FF6F8E'
      })
    }

  },

//日期选择器
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },

// 获取验证码
  async getCaptcha() {
    let that = this;
    let mobile = that.data.mobile

    if(!(/^1[3456789]\d{9}$/.test(mobile))){
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      });
      return;
    }

    that.setData({
      getCaptcha:'',
      text:'重新发送',
    })

//获取验证码
    const captcha = await Register.sendSms(mobile)
  },

//倒计时结束事件
  resetCap(){
    this.setData({
      getCaptcha: 'getCaptcha',
      text: '获取验证码'
    })
  },

//输入手机号
  toNumber(e){
    this.data.mobile = e.detail.value;
  },

  onMomTap(){

    wx.setStorageSync('role','妈妈')
    this.setData({
      select1: '#FF6F8E',
      select2: '',
      select3: '',
      role:'妈妈'
    })
  },

  onDadTap(){
    wx.setStorageSync('role','爸爸')
    this.setData({
      select1: '',
      select2: '#FF6F8E',
      select3: '',
      role:'爸爸'
    })
  },

  onDiyTap(){
    this.setData({
      select1: '',
      select2: '',
      select3: '#FF6F8E',
    })
    wx.navigateTo({
      url:'./custom/index'
    })
  },


  //提交表单
  formSubmit: async function (e) {

    let {name, birthday, mobile} = e.detail.value;
    if (!mobile || !name || !birthday) {

      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });

      return;

    }
    if(!(/^1[3456789]\d{9}$/.test(mobile))){
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      });
      return;
    }

    const dataUser = [];
    dataUser['birthday'] = birthday;
    dataUser['name'] = name;
    dataUser['mobile'] = mobile;
    dataUser['type'] = 2;
    dataUser['role'] = '的'+wx.getStorageSync('role');
    dataUser['subjects'] = '';

    console.log(dataUser);
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

    setTimeout(function() {
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