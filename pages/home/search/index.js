// pages/home/search/index.js
import {Box} from "../../../model/box";
import {Homes} from "../../../model/homes";
const api = require('../../../config/api.js');
const app = getApp();
var tag_Array=[]
var tag_name=''
var Arry_=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:false,
    select:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initAllData();
  },

  async initAllData() {

    const slable = await Homes.getSearchLabel();
    for (let i = 0; i < slable.data.length;i++){
      slable.data[i].select=false
    }
    this.setData({
      slable:slable.data,
      navH: wx.getStorageSync('navHeight'),
      loadingHidden: true
    })
  },
  /**
   * 点击取消
   */
  onCancel: function () {
    wx.navigateBack()
  },
  InputChange(e){
    let that=this
    that.setData({
      tag_name: e.detail.value,
      tag_name_T: e.detail.value,
    })
    console.log(tag_name)
  },

  // 搜索清除事件
  onClearTap(e){
    console.log(e)
    let that=this
    tag_Array=[]
    that.setData({
      tag_name: '',
      tag_name_T:''
    })
  },
  // linblur(e){
  //   console.log(e.detail.value)
  //   let that=this
  //   let val = e.detail.value
  //   that.setData({

  //     tag_name: e.detail.value,
  //   })
  //   if (!val){
  //     Arry_=[]
  //   }else{
  //     Arry_.push(e.detail.value)
  //   }
  // },
  tag_slid(e){
 
    let that=this
    let index = e.currentTarget.dataset.index
    that.data.slable[index].select = !that.data.slable[index].select
    let select = that.data.slable[index].select
    let index_nmae = that.data.slable[index].name
    if (select==true){
      console.log('选中状态')
      
      let tag_name = that.data.tag_name
      
      if (tag_name){
        let tag_name_arry = (that.data.tag_name).split(',')

        let tag_name_arry_ind = tag_name_arry.indexOf(index_nmae)
        if (tag_name_arry_ind != -1) {
          tag_name_arry.splice(tag_name_arry_ind, 1)
          let tag_String = tag_name_arry.toString();
          that.setData({
            tag_name: tag_String
          })
        } else {
          tag_name_arry.push(index_nmae)
          let tag_String = tag_name_arry.toString();
          that.setData({
            tag_name: tag_String
          })
        }
      }else{
        that.setData({
          tag_name: index_nmae
        })
      }
    }else{
      console.log('取消状态')

      let tag_name = that.data.tag_name
      if (tag_name) {
        let tag_name_arry = (that.data.tag_name).split(',')
        let tag_name_arry_ind = tag_name_arry.indexOf(index_nmae)
        if (tag_name_arry_ind != -1) {
          tag_name_arry.splice(tag_name_arry_ind, 1)
          let tag_String = tag_name_arry.toString();
          that.setData({
            tag_name: tag_String
          })
        } else {
          tag_name_arry.push(index_nmae)
          let tag_String = tag_name_arry.toString();
          that.setData({
            tag_name: tag_String
          })
        }
      } else {
        that.setData({
          tag_name: index_nmae
        })
      }
    }
  },
  seach_submit(){
    let that=this

    if (!that.data.tag_name){
      wx.showToast({
        title: '搜索内容不可为空',
        icon:'none'
      })
      return false
    }
    let data={
      class_id: wx.getStorageSync('class_id'),
      servalue: that.data.tag_name
    }
    wx.navigateTo({
      url: '/pages/search_results/search_results?servalue=' + that.data.tag_name +'&type='+1,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // tag_Array = []
    // this.setData({
    //   tag_name:''
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // tag_Array = []
    // this.setData({
    //   tag_name: ''
    // })
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
  onShareAppMessage: function () {

  }
})