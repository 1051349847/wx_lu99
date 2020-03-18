import {Upload} from "../../model/upload";
import {Qiniu} from "../../model/qiniu";

Page({
  data: {
    img_url: [],
    date:'',
    content:'',
    mcount:9,
    send:'send',
    tempFiles:''
  },

  onLoad: function (options) {
    this.initAllData();
  },

  //舒适化页面数据
  async initAllData() {
    const token = await Qiniu.get_token();
    let upToken = token.uptoken;

// 获取当前日期
    var date = new Date();

// 获取当前月份
    var nowMonth = date.getMonth() + 1;

// 获取当前是几号
    var strDate = date.getDate();

// 添加分隔符“-”
    var seperator = "-";

// 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
      nowMonth = "0" + nowMonth;
    }

// 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }

// 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;

    this.setData({
      date:nowDate,
      navH: wx.getStorageSync('navHeight'),
      navW: wx.getStorageSync('wHeight'),
      upToken:upToken,
      loadingHidden: true
    })
  },

  //输入描述
  input:function(e){
    this.setData({
      content:e.detail.value
    })
  },

  //日期选择器
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },

  //选择视频
  chooseMedia(){
    let that = this
    let mcount = that.data.mcount
    let mediaType = ['image','video'];

    if(that.data.img_url.length>0){
      mediaType = ['image'];
    }


    wx.chooseMedia({
      count: mcount,
      mediaType: mediaType,
      sourceType: ['album', 'camera'],
      maxDuration: 15,
      camera: 'back',
      sizeType:['original'],
      success(res) {
        console.log(res)
        if (res.tempFiles[0].duration >15){
          wx.showToast({
            icon:'none',
            title: '暂支持15内视频',
          })
          return false
        }
        if (res.type === 'image'){

            that.data.mcount = mcount - res.tempFiles.length;
            //图如果满了9张，不显示加图
            if (mcount - res.tempFiles.length === 0){
              that.setData({
                hideAdd:'none'
              })
            }else{
              that.setData({
                hideAdd: 'flex'
              })
            }

            //把每次选择的图push进数组
            let img_url = that.data.img_url;
            for (let i = 0; i < res.tempFiles.length; i++) {
              img_url.push(res.tempFiles[i].tempFilePath)
            }
            that.setData({
              img_url: img_url
            })

        }else if (res.type === 'video'){

            //视频如果满了1张，不显示加号
            if (res.tempFiles.length > 0){
              that.setData({
                hideAdd:'none',
                tempFiles: res.tempFiles
              })
            }else{
              that.setData({
                hideAdd: 'flex',
                onPlay:true,

              })
            }



        }
      },
      fail(err){
        console.log(err)
      }
    })
  },

  //发布按钮事件
  send:function(){
    let that = this;
    that.setData({
      send: ''
    })

    let title = that.data.content;

    if (!title){
      wx.showToast({
        title:'请输入描述',
        icon:'none'
      })
      that.setData({
        send: 'send'
      })
      return;
    }


    wx.showLoading({
      title: '上传中',
    })

    if (that.data.tempFiles){
      that.video_upload()
    }else if (that.data.img_url.length > 0){
      that.img_upload()
    }else {
      wx.showToast({
        title:'请上传媒体',
        icon:'none'
      })
      that.setData({
        send: 'send'
      })
      return;
    }

  },

  //上传视频
  video_upload(){
    let that = this;
    let video_url = that.data.tempFiles;

    let d = new Date();
    let upToken = that.data.upToken;
    let cid = wx.getStorageSync('class_id')

    for (let i = 0; i < video_url.length; i++) {
      let key = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+"/"+video_url[i].tempFilePath.substring(6,7)+Math.random()*1000;
      let thumbKey = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+"/"+video_url[i].thumbTempFilePath.substring(6,6)+Math.random()*1000;

      wx.uploadFile({
        url: 'https://upload-z1.qiniup.com',
        filePath: video_url[i].thumbTempFilePath,
        name: 'file',
        formData: {
          'token':upToken,
          'key': thumbKey//这里是为文件设置上传后的文件名
        },
        success: async function (res) {

        }
      });




      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'https://upload-z1.qiniup.com',
        filePath: video_url[i].tempFilePath,
        name: 'file',
        formData: {
          'token':upToken,
          'key': key//这里是为文件设置上传后的文件名
        },
        success: async function (res) {

          //把上传成功的图片的地址放入数组中

            let content = that.data.content;
            let date = that.data.date;
            const upImgToService = await Upload.uploadVideoToServer(key,thumbKey, content,cid,date);

            if (upImgToService.code === 1) {
              wx.hideLoading()
              that.setData({
                send: 'send'
              })

              wx.showModal({
                title: '成功',
                content: '视频上传成功',
                showCancel:false,
                success (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/home/home?from=upload',
                    });
                  }
                }
              })

            }


        },

      })
    }

  },

  //上传图片
  img_upload: function () {
    let that = this;
    let img_url = that.data.img_url;
    let img_url_ok = [];
    //由于图片只能一张一张地上传，所以用循环
    let d = new Date();
    let upToken = that.data.upToken;
    let cid = wx.getStorageSync('class_id')

    for (let i = 0; i < img_url.length; i++) {
      let key = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+"/"+img_url[i].substring(6,6)+Math.random()*1000;

      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'https://upload-z1.qiniup.com',
        filePath: img_url[i],
        name: 'file',
        formData: {
          'token':upToken,
          'key': key//这里是为文件设置上传后的文件名
        },
        success: async function (res) {

          //把上传成功的图片的地址放入数组中
          img_url_ok.push(key)
          //如果全部传完，则可以将图片路径保存到数据库
          if (img_url_ok.length == img_url.length) {
            let content = that.data.content;
            let date = that.data.date;
            const upImgToService = await Upload.uploadToServer(img_url_ok, content,cid,date);

            if (upImgToService.code === 1) {
              wx.hideLoading()
              that.setData({
                send: 'send'
              })
              wx.showModal({
                title: '成功',
                content: '图片上传成功',
                showCancel:false,
                success (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/home/home?from=upload',
                    });
                  }
                }
              })

            }

          }
        },

      })
    }
  },
// 删除图片
  del_img(e){
    let that=this
    let index_=e.currentTarget.dataset.index
    let img_Arry =that.data.img_url
    img_Arry.splice(index_,1)
    that.setData({
      img_url: img_Arry
    })
  },
})
