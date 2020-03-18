// pages/image/index.js
import {
  Image
} from "../../model/image";
import {
  Box
} from "../../model/box";
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
    video_url: '',
    images: null,
    tabDefault: 'onItemTab',
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let that = this
    if (options.src) {
      let video_url = options.src;
      this.setData({
        video_url: video_url,
        navH: wx.getStorageSync('navHeight'),
        loadingHidden: true
      })

    } else {
      let id = options.id
      that.data.group_id = id
      const data = await Image.getListById(id)

      let grid = data.images
      console.log()
      for (let i = 0; i < grid.length; i++) {
        grid[i].checked = false
      }

      this.setData({
        images: data,
        grid: grid,
        navH: wx.getStorageSync('navHeight'),
        loadingHidden: true
      })
    }
    let user_id = await User.getUidByToken(); //用户ID
    that.setData({
      user_id: user_id
    })
  },
  onPreview(event) {
    let image = this.data.images.images
    let current = event.target.dataset.src;
    console.log(image)
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  },


  async onEdit() {
    let that = this;
    let image_id = that.data.images.user_id; //当前相集用户id
    let user_id = await User.getUidByToken(); //用户ID
    console.log(user_id)
    that.setData({
      user_id: user_id
    })
    let group_id = that.data.group_id
    let manager_id = wx.getStorageSync('manager_id')
    console.log(image_id, manager_id, user_id, image_id)
    let itemList = ['保存至照片盒'];

    if (image_id == user_id && manager_id != user_id) {
      console.log('2')
      itemList = ['删除照片', '保存至照片盒'];
    }

    if (image_id == user_id && manager_id == user_id) {
      console.log('3')
      itemList = ['删除照片', '保存至照片盒', '屏蔽照片'];
    }

    wx.showActionSheet({

      itemList: itemList,
      success(res) {

        switch (itemList[res.tapIndex]) {
          case "保存至照片盒":
            that.saveImgsToBox();
            break
          case "删除照片":
            that.deleteImages(group_id);
            break
          case "屏蔽照片":
            that.shieldImages();
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  saveImgsToBox() {
    console.log(this.data.images.description)
    let that=this
    let data={
      data: that.data.res_img
    }
    app.request_T(api.Box_save,data,'post').then(res=>{
      console.log(res)
      wx.showToast({
        title: '保存成功'
      })

      that.setData({
        tabDefault: 'onItemTab',
        res_img:''
      })
    },res=>{
      console.log(res)
    })
    return false
    //  Box_save
    // const res = await Box.saveImgs();
    if (res.code === 1) {
      wx.removeStorageSync('selectImg')
      wx.showToast({
        title: '保存成功'
      })
      this.setData({
        tabDefault: 'onItemTab'
      })
    }

  },

  async deleteImages() {
    let that=this
    let group_id = that.data.group_id
    const res = await Box.deleteImgsBySelf(group_id);
  },
  /*
   * tabDefault = checkbox
   *
   * */
  onSelect() {
    let tabDefault = this.data.tabDefault;
    if (tabDefault == 'onItemTab') {
      tabDefault = 'checkbox'
    } else {
      wx.removeStorageSync('selectImg')
      tabDefault = 'onItemTab'
    }


    this.setData({
      tabDefault: tabDefault
    })
  },

  checkbox: function(e) {
    let that=this
    let index = e.currentTarget.dataset.index; //获取当前点击的下标
    let grid = this.data.grid; //选项集合
    grid[index].checked = !grid[index].checked; //改变当前选中的checked值
    let res = [];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].checked) {
       
        let data={
          img_id: grid[i].id,
          description: this.data.images.description,
          user_id: that.data.user_id
        }
        res.push(data)
      }
    }

    console.log(res)
    wx.removeStorageSync('selectImg')
    wx.setStorageSync('selectImg', res)
    this.setData({
      grid: grid,
      res_img: res
    });


    console.log(grid)
  },

  onItemTab(event) {
    let images = this.data.grid;
    let urls = [];
    for (let i = 0; i < images.length; i++) {
      urls.push(images[i].img_url)
    }

    let current = event.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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