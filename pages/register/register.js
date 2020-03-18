
import {Register} from "../../model/register";
import {User} from "../../model/user";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let is_register = wx.getStorageSync('is_register')

/*    if(is_register){
      wx.switchTab({
        url: '/pages/home/home'
      });
    }*/

    let _this = this;
    _this.setData({
      navH:wx.getStorageSync('navHeight')
    })

  },
  async onGotUserInfo(e) {
    let that = this;
    let userData = e.detail.userInfo

    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      const user = await User.setUserInfo(userData);

      if (user.code === 1){
        that.setData({
          userInfo: true
        })
      }

    }


  },
  /**
   * 跳转学生注册页
   */
  onStudentsTap: function(e) {
    wx.navigateTo({
      url: 'students/students'
    })

  },

  onTeacherTap(){
    wx.navigateTo({
      url: 'teacher/teacher'
    })
  },

  onParentsTap(){
    wx.navigateTo({
      url: 'parent/parent'
    })
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