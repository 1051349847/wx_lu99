import {User} from "../../../../model/user";
import {Space} from "../../../../model/space";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    this.initAllData();


  },


  async initAllData() {
    let id = wx.getStorageSync('class_id')
    let grid = await User.getUserList(id)
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      navW: wx.getStorageSync('wHeight'),
      grid:grid,
      loadingHidden: true
    })

  },
  onDelUser(event){
    let that = this
    wx.showModal({
      title: '',
      content: '您确定要删除该成员吗？',
      async success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let uid = Space.getDataSet(event, 'id');
          let cId = wx.getStorageSync('class_id');

          const data = await Space.delUserByManager(cId, uid);
          console.log(data)
          if (data.code === 1) {

            wx.showToast({
              title: data.msg,
              icon: 'success',
              duration: 2000
            })
            that.initAllData();

          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})