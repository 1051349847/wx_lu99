import { Http } from "../utils/http";

export class Space {
  static async getIndexList() {
    return await Http.request({
      url: 'index/space_list',
    });
  }

  static async exitSpaceByCid(id) {
    return await Http.request({
      url: 'space/exit',
      method:'post',
      data:{
        class_id:id
      }
    });
  }


  static async delUserByManager(cid,uid) {
    return await Http.request({
      url: 'space/del_user',
      method:'post',
      data:{
        space_id:cid,
        uid:uid

      }
    });
  }

  static async joinSpaceByInvite(inviteId,classId) {
    return await Http.request({
      url: 'space/invited',
      method:'post',
      data:{
        class_id:classId,
        invite_id:inviteId
      }
    });
  }


  static async changeManager(cid,uid) {
    return await Http.request({
      url: 'space/make_over',
      method:'post',
      data:{
        space_id:cid,
        uid:uid
      }
    });
  }

  //是否管理员
  static async isManager(id) {
    return await Http.request({
      url: 'space/is_manager',
      data:{
        class_id:id
      }
    });
  }




  /*获得元素上的绑定的值*/
  static getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };
}