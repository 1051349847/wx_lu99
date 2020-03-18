import {Http} from "../utils/http";

export class User {
   static async getUserInfo() {
       return await Http.request({
           url: 'user/get_userInfo'
       })
   }

   static async getUserList(id) {
       return await Http.request({
           url: 'user/space?id='+id
       })
   }

   static async getUidByToken() {
       return await Http.request({
           url: 'user/get_uid'
       })
   }



   //获取用户消息提示
   static async getUserNotify() {
       return await Http.request({
           url: 'user/notify'
       })
   }

   static async setUserInfo(userData) {
       console.log(userData)
       return await Http.request({
           method:'POST',
           url: 'user/set_userInfo',
           data:{
               avatar_url:userData.avatarUrl,
               nickname:userData.nickName
           }
       })
   }


   static async onReadNotify(id) {

       return await Http.request({
           method:'POST',
           url: 'notify/read',
           data:{id:id}
       })

   }

   static async allowUser(id) {

       return await Http.request({
           method:'POST',
           url: 'notify/allow',
           data:{id:id}
       })

   }


   static async getNotifyDetail(id) {

       return await Http.request({
           url: 'notify/detail',
           data:{id:id}
       })

   }

    /*获得元素上的绑定的值*/
    static getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };

}

