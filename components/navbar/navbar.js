// pages/components/navbar/navbar.js
const App = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    showBack: {
      type: Boolean,
      value: false
    },
    showIndex: {
      type: Boolean,
      value: false
    },
    showBg: {
      type: Boolean,
      value: true
    },
    showBottom: {
      type: Boolean,
      value: true
    },
    showDefault: {
      type: Boolean,
      value: true,
      observer: function(newVal, oldVal) {
        console.log(newVal)
        console.log(oldVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  //******************************扯淡 */
  // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在  lifetimes  字段内进行声明（这是推荐的方式，其优先级最高）。
  //****************************** */
  // lifetimes: {
  //   attached() {
  //     console.log('navH' + App.globalData.navHeight)
  //     this.setData({
  //       navH: App.globalData.navHeight
  //     })
  //   }
  // },
  attached() {
    this.setData({
      navH: wx.getStorageSync('navHeight')
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },

    toIndex: function () {
      wx.switchTab({
        url: '/pages/home/home',
      });
    }
  }
})