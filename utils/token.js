// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头

import {Http} from "./http";

class Token {

    verify() {
        let that = this;
        let token = wx.getStorageSync('token');
        console.log(token)
        if (!token) {
            that.getTokenFromServer().then(r => {});
        }
        else {
            that.veirfyFromServer(token).then(r => {});
        }
    }

    async veirfyFromServer(token) {

        let that = this;

        const valid = await Http.request({
            url: 'token/verify',
            method: 'POST',
            data: {
                token: token
            }
        })

        if(!valid.isValid){
            that.getTokenFromServer();
        }


    }

    async getTokenFromServer() {

        wx.login({
            success: async function (res) {

                const token = await Http.request({
                    url: 'token/user',
                    method: 'POST',
                    data: {
                        code: res.code
                    }

                });

                wx.setStorageSync('token', token.token)
                wx.setStorageSync('is_register', token.is_register)

            }
        })




    }
}

export {Token};