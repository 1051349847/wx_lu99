// pages/order/order.js
import {Order} from "../../model/order";
import {Cart} from "../../model/cart";
import {Product} from "../../model/product";
import {Address} from "../../model/address";
const App = new getApp()
const api = require('../../config/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromProductFlag:false,
    from:'',
    orderStatus:null,
    product:'',
    account:'',
    pay:'pay',
    addressInfo:null,
    count_num:1
  },
  /*
   * 订单数据来源包括2个：
   * 1.旧的订单
   * 2.直供
   * */


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {


    var flag = options.from == 'product',
        that = this;
    that.data.fromProductFlag = flag;
    that.data.from = options.from;
    that.data.account = options.price;
    let curr_arry = (options.curr_arry).split(',')
    console.log(curr_arry)
      that.setData({
        pay_id: options.id,
        curr_arry: curr_arry,
        s_name: options.s_name
      })
    //来自product
    if (flag) {

      const data = await Product.getProductDetail(options.id)
      data.counts = options.counts
      that.data.product = data
      /*显示收获地址*/
      let addressInfo = await Address.getAddress();

      that.setData({
        productsArr: that.data.product,
        account: options.price,
        navH: wx.getStorageSync('navHeight'),
        addressInfo: addressInfo,
        orderStatus: 0
      });



    } else if (options.from == 'default') {

      //来自历史订单
    }else {
      this.data.id=options.id;
    }
  },

  /*修改或者添加地址信息*/
  editAddress:function(){
    var that=this;
    wx.chooseAddress({
      success: async function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail:Address.setAddressInfo(res)
        };

        that._bindAddressInfo(addressInfo);
        const addres = await Address.submitAddress(res)


        if (!addres) {
          that.showTips('操作提示', '地址信息更新失败！');
        }
        //保存地址

      }
    })
  },

  /*绑定地址信息*/
  _bindAddressInfo:function(addressInfo){
    this.setData({
      addressInfo: addressInfo
    });
  },



  /*下单和付款*/
  pay(){

    let that = this
    that.setData({
      pay:''
    });

    if(that.data.orderStatus==0){
      this._firstTimePay();
      that.setData({
        pay:'pay'
      });
    }else{
      this._oneMoresTimePay();
    }
  },
  /*第一次支付*/
  _firstTimePay: async function () {
    var orderInfo = [],
        procuctInfo = this.data.productsArr
        procuctInfo.stylist = wx.getStorageSync('s_name');
    var that = this;
    //支付分两步，第一步是生成订单号，然后根据订单号支付
    const data = await Order.doOrder(procuctInfo)
    //订单生成成功
    if (data.pass) {
      //更新订单状态
      var id = data.order_id;
      that.data.id = id;
      that.data.fromCartFlag = false;

      //开始支付
      const payData = await Order.execPay(id);


      var timeStamp = payData.timeStamp;
      if (timeStamp) { //可以支付
        wx.requestPayment({
          'timeStamp': timeStamp.toString(),
          'nonceStr': payData.nonceStr,
          'package': payData.package,
          'signType': payData.signType,
          'paySign': payData.paySign,
          success: function (res) {
            console.log(res)
            that.deleteProducts(); //将已经下单的商品从购物车删除   当状态为0时，表示
            wx.showToast({
              title: '支付成功',
              duration: 2000
            })
            // setTimeout(function () {
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }, 2000)
          var flag = true;
            wx.navigateTo({
              url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
            });
          },

          fail: function (err) {
            wx.showToast({
              title: '支付失败',
              icon:'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)

            var flag = false;
            wx.navigateTo({
              url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
            });
          }


        });
      }}else {
      that._orderFail(data);
    }


  },

  /*
         *下单失败
         * params:
         * data - {obj} 订单结果信息
         * */
  _orderFail:function(data){

    console.log(data);
    var nameArr=[],
        name='',
        str='',
        pArr=data.pStatusArray;
    for(let i=0;i<pArr.length;i++){
      if(!pArr[i].haveStock){
        name=pArr[i].name;
        if(name.length>15){
          name = name.substr(0,12)+'...';
        }
        nameArr.push(name);
        if(nameArr.length>=2){
          break;
        }
      }
    }
    str+=nameArr.join('、');
    if(nameArr.length>2){
      str+=' 等';
    }
    str+=' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel:false,
      success: function(res) {

      }
    });
  },



  /*
* 提示窗口
* params:
* title - {string}标题
* content - {string}内容
* flag - {bool}是否跳转到 "我的页面"
*/
  showTips:function(title,content,flag){
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success: function(res) {
        if(flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },
  reduce(e){
    console.log(e.detail.count)
    let that=this
    let count_num = e.detail.count
    let count_num_cont = count_num * that.data.productsArr.price
    // console.log(count_num, count_num_cont)
    // return false
    that.setData({
      count_num: count_num,
      account: count_num_cont
    })
  },

  pay_T(e){
    let that=this
   
   
    this.data.productsArr.counts = (that.data.count_num)+''
    this.data.productsArr.price = (that.data.account)+''
    this.data.productsArr.stylist = that.data.s_name;
    this.data.productsArr.img_url = that.data.curr_arry;

    let data={
      products: this.data.productsArr
      // curr_arry
    }
    console.log(data)
    app.request_T(api.Order, data, 'POST').then(function (res) {
  
      let id = res.data.order_id
      let data={
        id: res.data.order_id
      }
      app.request_T(api.Pay_pre_order, data, 'POST').then(function (res) {
        console.log(res)
        let timeStamp = res.data.timeStamp
        let data=res.data
     
        wx.requestPayment({
          'timeStamp': timeStamp.toString(),
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          success: function (res) {
            // that.deleteProducts(); //将已经下单的商品从购物车删除   当状态为0时，表示
            wx.showToast({
              title: '支付成功',
              duration: 2000
            })
            var flag = true;
            wx.redirectTo({
              url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
            });
          },
          fail: function (err) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)

            var flag = false;
            wx.redirectTo({
              url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
            });
          }
        });

      })
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

  }
})