// component/category-grid/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    grid:Array,
    is_manager:null
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDelUserTab(){
      wx.navigateTo({
        url:'/pages/home/s-control/del-user/index'
      })
    },
    onInviteTab(){
      console.log(123)
    }
  }
})
