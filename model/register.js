import {Http} from "../utils/http";

export class Register {

    static async validUserInfo(dataUser) {
        return await Http.request({
            url: 'user/s_register',
            method:'POST',
            data:{
                name:dataUser.name,
                birthday:dataUser.birthday,
                mobile:dataUser.mobile,
                captcha:dataUser.captcha,
                type:dataUser.type,
                role:dataUser.role,
                subjects:dataUser.subjects,
            }
        });
    }

    static async sendSms(mobile) {
        return await Http.request({
            url: 'sms/send',
            method:'POST',
            data:{
                mobile:mobile
            }
        });
    }

}