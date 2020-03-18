// pages/home/homes.js
import {
  Token
} from '../../utils/token.js';
import {
  Homes
} from "../../model/homes";
import {
  Space
} from "../../model/space";
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
    className: '',
    exitStatus: 'none',
    defaultBg: 'http://qiniu.bmty123.com/uploads/0121/1579573931000814e.jpg',
    is_show: false,
    sHeight: null,
    loadingHidden: false,
    loadingType: 'loading',
    paging: null
  },

  /**
   * 生命周期函数--监听页面加载
  //  */
  // async 
  onLoad(options) {
    console.log(options)
    let that = this;
    // // 如果是被邀请的用户
    // console.log(options)
    if (options) {
      if (options.inviteId && options.classId) {
        let data = {
          class_id: options.classId,
          invite_id: options.inviteId
        }
        app.request_T(api.Space_invited, data, 'POST').then(function(res) {
          console.log('分享进来')
          that.initAllData();
        })
        // const res = await Space.joinSpaceByInvite(options.inviteId, options.classId)
        // if (res.code) {
        //   that.initAllData();
        // }
      }
    }
   
   



    this.setData({
      sHeight: wx.getStorageSync('sHeight')
    })
    // that.initAllData()


    /*    let interval = setInterval(function () {
          let tokens = Homes.validToken();

          if (wx.getStorageSync('token') && tokens) {
            that.initAllData()
            clearInterval(interval)
          }
        }, 100) //循环间隔 单位ms

        setTimeout(function () {
          clearInterval(interval)
        }, 20000)*/


  },

  onShow() {

    let that = this
    app.request_T(api.Get_uid, 'POST').then(function(res) {
      console.log(res.data)
      that.setData({
        inviteId: res.data
      })
    })
    app.request_T(api.User_token, 'POST').then(function (res) {
      that.initAllData();
    })
    this.setData({
      managerId: wx.getStorageSync('manager_id'),
    })
  },
// 创建个人空间
  add_space(){
    wx.navigateTo({
      url: '/pages/add_space/add_space',
    })

  },
  async initAllData() {
    let that = this
    //从缓存获取空间id
    let manager_id = 725
    let classId = wx.getStorageSync('class_id');
    let defaultSpace;


    const space = await Space.getIndexList();

    if (space.length > 0 && classId) {

      defaultSpace = space.find(t => t.class_id === classId);

    }
    //么有缓存取第一个
    if (space.length > 0 && !classId) {

      defaultSpace = space[0];
      classId = defaultSpace.class_id
      manager_id = 725
    }



    const paging = await Homes.getImgListIndex(classId);
    this.data.paging = paging
    const pagingData = await paging.getMoreData()


    if (!pagingData) {
      return
    }

    if (!paging.moreDate) {
      that.setData({
        loadingType: 'end'
      })
    } else {
      that.setData({
        loadingType: 'loading'
      })

    }
    this.setData({
      navH: wx.getStorageSync('navHeight'),
      defaultSpace: defaultSpace,
      space: space,
      datalist: pagingData.items,
      loadingHidden: true
    })

    wx.setStorageSync('class_id', classId)
    wx.setStorageSync('manager_id', manager_id)
    wx.stopPullDownRefresh();
  },
  //邀请
  invite() {

  },
  visibleIcon(e) {

    this.setData({
      exitStatus: 'block',
    })
  },

  exitSpace(event) {
    let that = this
    wx.showModal({
      title: '退出空间',
      content: '确定要退出当前空间',
      async success(res) {
        if (res.confirm) {

          let id = event.currentTarget.dataset['id'];

          const result = await Space.exitSpaceByCid(id);
          if (result.code === 1) {
            if (id === wx.getStorageSync('class_id')) {
              wx.removeStorageSync('class_id')
            }
          }
          await that.initAllData()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  search() {
    wx.navigateTo({
      url: './search/index'
    })
  },

  Leave_me(e){
    console.log(e.currentTarget.dataset)
    let that=this
    let id = e.currentTarget.dataset.id
    let ind = e.currentTarget.dataset.index
    that.setData({
      Leave_inout: false,
      Leave_ind: ind
    })
    that.setData({
      Leave_inout:true
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.initAllData(); //重新加载onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function() {

    let that = this;
    const paging = that.data.paging
    const pagingData = await paging.getMoreData()

    console.log(paging)
    if (!paging.moreDate) {
      that.setData({
        loadingType: 'end'
      })
    } else {
      that.setData({
        loadingType: 'loading'
      })

    }
    if (pagingData) {
      that.setData({
        datalist: paging.accmulator
      })


    }

  },
  async onClassTap(e) {
    console.log(e.currentTarget.dataset.mid, this.data.inviteId)
    let classId = Space.getDataSet(e, 'id');
    this.setData({
      managerId: e.currentTarget.dataset.mid,
    })
    if (classId === wx.getStorageSync('class_id')) {
      return;
    }

    let defaultSpace;

    const space = this.data.space;
    defaultSpace = space.find(t => t.class_id === classId);

    this.hideSpaceList();
    wx.showLoading({
      title: '加载中',
    });

    let paging = await Homes.getImgListIndex(classId);

    this.data.paging = paging
    const pagingData = await paging.getMoreData()

    if (!pagingData) {
      return
    }
    this.setData({
      defaultSpace: defaultSpace,
      datalist: pagingData.items,
    
    })

    wx.setStorageSync('class_id', classId)
    wx.setStorageSync('manager_id', e.currentTarget.dataset.mid)
    wx.hideLoading();

  },

  uploadImg() {
    // 未注册跳转注册页面
    let is_register = wx.getStorageSync('is_register')

    if (!is_register) {
      wx.showModal({
        title: '未注册',
        content: '点击前往注册',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/reg_nav/reg_nav',
            });

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else {
      let classId = wx.getStorageSync('class_id');
      if (!classId) {
        wx.showToast({
          title: '请选择空间',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.navigateTo({
        url: '/pages/upload-img/index',
      });
    }


  },

  showSpaceList() {
    this.setData({
      is_show: true,
      exitStatus: 'none'
    })
  },

  hideSpaceList() {
    this.setData({
      is_show: false,
      exitStatus: 'none'
    })
  },

  spaceControl() {
    wx.navigateTo({
      url: './s-control/index',
    });
  },
  onImgList(event) {
    let id = Space.getDataSet(event, 'id')
    wx.navigateTo({
      url: '/pages/image/index?id=' + id,
    });

  },

  onVideoList(event) {
    let id = Space.getDataSet(event, 'id')
    let src = Space.getDataSet(event, 'src')
    wx.navigateTo({
      url: '/pages/image/index?id=' + id + '&src=' + src,
    });

  },
onHide(){
  console.log(1)
  // this.showSpaceList()
  this.hideSpaceList()
  this.setData({
    Leave_ind:2020
  })
},
onUnload(){
  this.setData({
    Leave_ind: 2020
  })
},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
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