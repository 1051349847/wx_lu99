import {User} from "../../../../model/user";
import {Space} from "../../../../model/space";

Page({
    data: {
    },
    onLoad: function (options) {
        this.initAllData();

    },


    async initAllData() {
        let id = wx.getStorageSync('class_id')
        let grid = await User.getUserList(id)
        this.setData({
            navH: wx.getStorageSync('navHeight'),
            navW: wx.getStorageSync('wHeight'),
            grid:grid,
            loadingHidden: true
        })
    },

    async onChange(e) {
        wx.showModal({
            title: '',
            content: '您确定要转让权限吗？',
            async success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    let uid = Space.getDataSet(e, 'id');
                    let cId = wx.getStorageSync('class_id');

                    const data = await Space.changeManager(cId, uid);
                    console.log(data)
                    if (data.code === 1) {

                        wx.showToast({
                            title: data.msg,
                            icon: 'success',
                            duration: 2000
                        })
                    } else {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })



    }
});