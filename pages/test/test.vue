<template>
	<view class="websockets">
		<button type="primary" @tap="connectSocket">连接stocket</button>
		<button type="primary" @tap="sendSocket">点击发送请求</button>
		<button class="" @click="weixinOauthByLogin">微信授权登录</button>
		<button class="" @click="aa">授权表</button>
		<button class="" @click="fx">分享</button>
		<view class="show">
			{{dateShow}}
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {

		},
		data() {
			return {
				dateShow: 'date show area'
			}
		},

		methods: {
			connectSocket() {
				this.$socket.on("connect", (res) => {
					console.log('ws 已连接');
				})
				this.getSocketMsg()
			},
			sendSocket() {
				//这里发送消息给服务器
				//newPeople事件需与服务器一致
				this.$socket.emit('newPeople', 'zyy');
			},
			getSocketMsg() {
				//接收实时推送的数据
				this.$socket.on('push_data', data => {
					console.log('服务器发送来了：' + data)
				})
			},
			weixinOauthByLogin() {
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						// console.log(res.provider)
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) { //获取用户信息后向调用信息更新方法
											let userInfo = {};
											userInfo.userName = infoRes.userInfo.nickName
											userInfo.avatarUrl = infoRes.userInfo.avatarUrl
											userInfo.wechatOpenid = infoRes.userInfo.openid
											console.log(userInfo);
											this.dateShow = userInfo
										}
									});
								}
							});
						}
					}
				});

			},
			aa() {
				//获取授权列表
				plus.oauth.getServices(function(services) {
					console.log(services)
				}, function(e) {
					plus.nativeUI.alert("获取登录鉴权服务列表失败：" + JSON.stringify(e));
				});

			},
			fx() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "http://49.234.49.11",
					title: "uni-app分享",
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					imageUrl: "https://web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
						this.userInfo = JSON.stringify(res);
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});

			},

		}
	}
</script>
