// pages/home/s-control/index.js
import {Qiniu} from "../../../model/qiniu";
import {User} from "../../../model/user";
import {Upload} from "../../../model/upload";
import {Space} from "../../../model/space";
const utils = require('../../../utils/http.js');
const api = require('../../../config/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_manager:false
  },

  onLoad: function (options) {
    console.log(options)
    this.initAllData();


  },
  onShow(){

    let that = this
    app.request_T(api.Get_uid, 'POST').then(function (res) {
      console.log(res.data)
      that.setData({
        inviteId: res.data
      })
    })
  },

  async initAllData() {


    let id = wx.getStorageSync('class_id')
    let grid = await User.getUserList(id)
    let is_manager = await Space.isManager(id)
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      navW: wx.getStorageSync('wHeight'),
      is_manager:is_manager,
      grid:grid,
      loadingHidden: true
    })
  },
  async onChangeBg() {
    let that = this;

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        if (res.tempFilePaths.length > 0) {

          console.log(res.tempFilePaths)
          that.uploadImg(res);



        }

      }
    })
  },

  async uploadImg(res) {
    const token = await Qiniu.get_token();
    let upToken = token.uptoken;

//把每次选择的图push进数组
    let img_url = res.tempFilePaths;
    let cid = wx.getStorageSync('class_id')
    let d = new Date();
    let key = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate() + "/" + img_url[0].substring(6,7)+ Math.random() * 1000;

    wx.uploadFile({
      //路径填你上传图片方法的地址
      url: 'https://upload-z1.qiniup.com',
      filePath: img_url[0],
      name: 'file',
      formData: {
        'token': upToken,
        'key': key//这里是为文件设置上传后的文件名
      },
      success: async function (res) {
        console.log(123123123);
        console.log(res)
        const changeBg = await Upload.changeBg(key, cid);

        if (changeBg.code === 1) {
          wx.hideLoading()

          wx.showModal({
            title: '成功',
            content: changeBg.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {

              }
            }
          })

        }
      },

    })
  },
  onZhuan(){
    wx.navigateTo({
      url:'./zhuan/index'
    })
  },
  async exitSpace() {
    let that = this
    let id = wx.getStorageSync('class_id')
    const res = await Space.exitSpaceByCid(id)
    if(res.code === 1){
      wx.removeStorageSync('class_id')
        wx.showToast({
          title:'退出成功',
          icon: 'success',
          duration: 2000
        })

      wx.switchTab({
        url:'/pages/home/home'
      })
    }
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
  onShareAppMessage: function (res) {
    let that = this
    let inviteId = that.data.inviteId
    let classId = wx.getStorageSync('class_id')
    console.log(inviteId, classId)
    if (res.from === 'button') {
      console.log('按钮分享')
    } else {
      console.log('右上角分享')
    }
    return {
      title: '邀请您加入',
      desc: '邀请您加入空间',
      path: '/pages/home/home?inviteId=' + inviteId + '&classId=' + classId,
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    }
  }
})