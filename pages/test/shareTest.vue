<template>
    <button type="default" @click="uniShare">显示</button>
</template>
<script>
    import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
    const uniShare = new UniShare();
    export default {
        onBackPress({from}) {
            console.log(from);
            if(from=='backbutton'){
                this.$nextTick(function(){
                    uniShare.hide()
                })
                return uniShare.isShow;
            }
        },
        methods: {
            uniShare() {
                uniShare.show({
                    content: { //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
                        type: 0,
                        href: 'https://uniapp.dcloud.io/',
                        title: '标题',
                        summary: '描述',
                        imageUrl: 'https://img-cdn-aliyun.dcloud.net.cn/stream/icon/__UNI__HelloUniApp.png'
                    },
                    menus: [
						{
                            "img": "/static/app-plus/sharemenu/wx.png",
                            "text": "微信好友",
                            "share": { //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
                                "provider": "weixin",
                                "scene": "WXSceneSession"
                            }
                        },
                        {
                            "img": "/static/app-plus/sharemenu/wxpyq.png",
                            "text": "微信朋友圈",
                            "share": {
                                "provider": "weixin",
                                "scene": "WXSceneTimeline"
                            }
                        },
                        {
                            "img": "/static/app-plus/sharemenu/qq.png",
                            "text": "QQ",
                            "share": {
                                "provider": "qq"
                            }
                        },
                        {
                            "img": "/static/app-plus/sharemenu/copy.png",
                            "text": "复制",
                            "share": "copyurl"
                        },
                        {
                            "img": "/static/app-plus/sharemenu/more.png",
                            "text": "更多",
                            "share": "shareSystem"
                        }
                    ],
                    cancelText: "取消分享",
                }, e => { //callback
                    // console.log(uniShare.isShow);
                    // console.log(e);
                })
            }
        }
    }
</script>