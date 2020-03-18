// components/box-grid/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    grid:Array
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




    onItemTab(event){
      let images = this.data.grid;
      let urls = [];
      for(let i = 0;i < images.length; i++){
        urls.push(images[i].img_url)
      }





      let current = event.target.dataset.src;

      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })

    }
  }
})
