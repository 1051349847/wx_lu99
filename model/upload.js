import {Http} from "../utils/http";

export class Upload {
        static async uploadToServer(img_url,description,cid,date) {
        return await Http.request({
            url: 'user/upload_img',
            method:'post',
            data:{
                class_id:cid,
                images: img_url,
                description: description,
                date:date
            },
        });
    }


    static async uploadVideoToServer(video,thumb,description,cid,date) {
        return await Http.request({
            url: 'user/upload_video',
            method:'post',
            data:{
                class_id:cid,
                video: video,
                description: description,
                thumb:thumb,
                date:date
            },
        });
    }

    static async changeBg(img_url,cid) {
        return await Http.request({
            url: 'user/change_bg',
            method:'post',
            data:{
                class_id:cid,
                image: img_url
            },
        });
    }
}