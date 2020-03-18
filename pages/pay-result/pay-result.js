const App = new getApp()
Page({
      data: {

      },
      onLoad: function (options){
        this.setData({
          payResult:options.flag,
          // payResult:'true',
          id:options.id,
          navH: wx.getStorageSync('navHeight'),
          from:options.from
        });
      },
  viewOrder_ind(e){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
      viewOrder:function(){
        if(this.data.from=='my'){
          wx.redirectTo({
            url: '../order/order?from=order&id=' + this.data.id
          });
        } else if (this.data.from == 'cut') {
          wx.redirectTo({
            url: '../myorder/myorder'
          });
        }else{
          //返回上一级
          wx.navigateTo({
            url: '../myorder/myorder?index=0'
          })
        }
      }
    }
)