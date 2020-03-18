// pages/components/payModal/payModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price: String,
    showModal: {
      type: Boolean,
      value: false
    },
    alljifen: Number,
    zhehoujia: Number,
    iptval: {
      value: '',
      type: String
    }
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
    inputValue: function(e) {
      if (e.detail.value == '') {
        return
      }
      let value = parseFloat(e.detail.value)
      let allprice = parseFloat(this.properties.price)
      let alljifen = parseFloat(this.properties.alljifen)
      //如果总价大于总积分
      if (allprice > alljifen) {
        //如果输入数量大于总积分
        if (value > alljifen) {
          // value = alljifen
        }
      }
      //如果总积分大于总价
      if (alljifen > allprice) {
        //如果输入数量大于总价
        if (value > allprice) {
          //value = allprice
        }
      }
      let tempVal = parseFloat(allprice) - parseFloat(value)
      this.setData({
        zhehoujia: (tempVal < 0 ? 0 : tempVal).toFixed(2),
        iptval: value.toFixed(2)
      })
    },
    cancel: function() {
      this.triggerEvent('cancel')
    },
    confirm: function() {
      //去支付
      // this.tapToPay()
      let _this = this
      wx.showLoading({
        title: '请稍等',
      })
      setTimeout(function() {
        wx.hideLoading()
        _this.triggerEvent('confirm', _this.data.iptval)
      }, 500)

    },
  }
})