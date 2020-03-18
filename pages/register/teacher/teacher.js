import {Register} from "../../../model/register";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['语文', '数学', '英语', '物理','生物','化学','地理','历史','政治','体育','音乐','美术'],
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
    let index = e.detail.value
    let data = this.data.array
    this.setData({
      date: data[index]
    })
  },



//输入手机号
  toNumber(e){
    this.data.mobile = e.detail.value;
  },

  //提交表单
  formSubmit: async function (e) {

    let {name, subjects, mobile} = e.detail.value;
    if (!mobile || !name || !subjects) {

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
    dataUser['birthday'] = '';
    dataUser['name'] = name;
    dataUser['mobile'] = mobile;
    dataUser['type'] = 3;
    dataUser['role'] = '';
    dataUser['subjects'] = subjects;

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