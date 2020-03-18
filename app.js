import {Token} from "./utils/token";
let token = new Token();
token.verify();

App({
  onLaunch:function () {
      wx.getSystemInfo({
          success: res => {
              //导航高度
              wx.setStorageSync('navHeight', res.statusBarHeight);
              wx.setStorageSync('sWidth', res.screenWidth);
              wx.setStorageSync('sHeight', res.screenHeight);
              wx.setStorageSync('wHeight', res.windowHeight);
              wx.setStorageSync('tabbarHeight', res.screenHeight - res.windowHeight);
          },
          fail(err) {
              console.log(err);
          }
      })

  },
  Tp_login: function (eapi, that) { //用户登入
    console.log('进入登录')
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          wx.hideLoading();
          if (res.code) {
            var code = res.code

            let data = {
              code: code,
            }
            wx.request({
              url: 'https://lu99.api.029tulingling.com/api/v1/token/user',
              method: 'POST',
              data: data,
              success: function (ress) {

                if (ress.statusCode == 200) {
                  console.log(ress.data.token)
                  wx.setStorageSync("token", ress.data.token)
                  var value = wx.getStorageSync('token')
                  if (value) {
                    resolve();
                  }
                  if (ress.data.code == 20000) {

                  }
                } else {

                  reject(ress)
                }
              },
              fail: function (ress) {

              }
            })
          }
        }
      })
    })
  },
  request_T: function (url, data = {}, method = "GET", header = {}) {
    let that = this
    header = Object.assign({
      'Content-Type': 'application/json',
      'V-Litemall-Token': wx.getStorageSync('token')
    }, header)
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'Content-Type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
        
          if (res.data.error_code != 10001) {

            resolve(res);
          } else if (res.data.error_code == 10001) {
            console.log('请求失败')
            that.Tp_login().then(resLogin => {
              let header = Object.assign({
                'content-type': 'application/json',
                'token': wx.getStorageSync('token'),
              });
              that.request_T(url, data, method, header).then(res => {
                resolve(res);
              }, res => {
                reject(res.data);
              })
            }, resLogin => { })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (err) {
          reject(err)
        }
      })
    });
  },
})
