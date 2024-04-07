<template>
	<view class="login-content">

		<view class="login-title">登录</view>
		<view class="iphone">
			<input type="number" placeholder="输入手机号" :value="iphoneValue" @input="clearInput" />
			<uni-icons type="closeempty" color="#808080" size="25" v-if="showClearIcon" @click="clearIcon"></uni-icons>
		</view>
		<view class="password">
			<input placeholder="请输入密码" v-model="passwordValue" :password="showPassword" />
			<uni-icons type="eye-filled" color="#808080" size="25" @click="changePassword"></uni-icons>
		</view>
		<checkbox-group  class="checkbox_container" @change="checkboxChange">
			<checkbox :checked="registrationFlag"/>未注册则自动注册
		</checkbox-group>	
		<view class="other_login_container">
			<view class="top_line"></view>
			<text id="weixin_ico" @tap="weixinOauthByLogin()"></text>
			<view>微信登录</view>
		</view>		
		<view class="login-btn" @tap="Login()">登录</view>	
	</view>
</template>

<script>
	//加密
	import { JSEncrypt } from 'jsencrypt'
	export default {
		data() {
			return {
				iphoneValue: '', //手机号码
				passwordValue: '', //密码
				showPassword: true, //是否显示密码
				showClearIcon: false, //是否显示清除按钮
				token: '',
				registrationFlag: true
			}
		},
		methods: {
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},
			clearInput: function(event) {
				this.iphoneValue = event.detail.value;
				if (event.detail.value.length > 0) {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearIcon: function() {
				this.iphoneValue = '';
				this.showClearIcon = false;
			},
			checkboxChange() {
				this.registrationFlag = !this.registrationFlag
				// console.log(this.registrationFlag)
			},
			Login() {
				let that = this;
				//当手机为空时
				// if (!that.iphoneValue) {
				// 	uni.showToast({
				// 		title: '请输入账号名称',
				// 		icon: 'none'
				// 	})
				// 	return false
				// }
				
				//当手机为空时 或不是11位
				let tpReg = /^1[3|4|5|7|8][0-9]{9}$/
				if (that.iphoneValue && tpReg.test(that.iphoneValue)) {}else {
					uni.showToast({
						title: '请输入正确的账号名称',
						icon: 'none'
					})
					return false
				}
				
				//未输入密码时
				if (!that.passwordValue) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false
				}
				
				/*
				var hashurl = "http://localhost:442/publicKeySend";
				fetch(hashurl)
				.then(data => {
					if(data.status == 200) {
						return data.text()
					}else {
						//本地没开就直接发送了，不加密
						return Promise.reject('nolocalhost')
					}
				})
				.then(data => {
					let encryptor = new JSEncrypt();  
					encryptor.setPublicKey(data);  
					let sendStr = encryptor.encrypt(that.passwordValue);
					uni.request({
					    url: 'http://localhost:442/RSAUnicode', 
						method: 'POST',
						data: {
							"txt": sendStr,
							'phone': that.iphoneValue,
							'userPassword': that.passwordValue,
							'model': this.registrationFlag
						},
					    success: (res) => {
							// console.log(res.data)
							if(res.data.code === 'err') {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								return false
							}else {
								// console.log(res.data.userID)
								that.setStorageeee(res.data.userID);
								uni.redirectTo({url: 'index?id=' + res.data.userID});
							}
						}
					});
				})
				.catch(data => {
					//直接发远程不加密
					uni.request({
						url: this.$baseUrl + '/phoneLogin',
						method: 'POST',
						data: {
							'phone': that.iphoneValue,
							'userPassword': that.passwordValue,
							'model': this.registrationFlag
							// model:true 没有手机号就注册
						},
						success: (res) => {
							// console.log(res.data)
							if(res.data.code === 'err') {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								return false
							}else {
								// console.log(res.data.userID)
								that.setStorageeee(res.data.userID);
								uni.redirectTo({url: 'index?id=' + res.data.userID});
							}
						}
					});
				})
				*/
			   
			   
			   
			    uni.request({
					url: this.$baseUrl + '/phoneLogin',
					method: 'POST',
					data: {
						'phone': that.iphoneValue,
						'userPassword': that.passwordValue,
						'model': this.registrationFlag
						// model:true 没有手机号就注册
					},
					success: (res) => {
						// console.log(res.data)
						if(res.data.code === 'err') {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							return false
						}else {
							// console.log(res.data.userID)
							that.setStorageeee(res.data.userID);
							uni.redirectTo({url: 'index?id=' + res.data.userID});
						}
					}
			    });
				
				
				
				// uni.request({
				//     url: 'http://192.168.43.29:442/publicKeySend', 
				// 	method: 'GET',
				// 	 sslVerify: false,
				//     success: (res) => {
				// 		// console.log(res.data)
				// 		console.log(res.data)
				// 	},
				// 	fail(err) {
				// 	console.log(err)
				// 	}
				// });
			   
				
			},
			setStorageeee(id) {
				// console.log(id)
				uni.setStorage({
					key: 'storage_userID',
					data: id,
					success: function () {
						// this.$USERID = id;
					}
				});

			},
			weixinOauthByLogin() {
				let that = this;
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						// console.log(res.provider)
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									// console.log(loginRes.authResult.openid);
									//返回no则表示没有该用户，需要注册;
									let tpOpenid = loginRes.authResult.openid
									uni.request({
									    url: that.$baseUrl + '/openidLogin',
										method: 'POST',
										data: {
											'openid':tpOpenid
										},
									    success: (res) => {
											if(res.data === 'no') {
												uni.getUserInfo({
													provider: 'weixin',
													success: function(infoRes) { //获取用户信息后向调用信息更新方法
														let userInfo = {};
														userInfo.userName = infoRes.userInfo.nickName;
														userInfo.avatarUrl = infoRes.userInfo.avatarUrl;
														userInfo.wechatOpenid = tpOpenid;
														// console.log(userInfo)
														uni.request({
														    url: that.$baseUrl + '/wxRegistration',
															method: 'POST',
															data: userInfo,
														    success: (ress) => {
																that.setStorageeee(ress.data.insertId);
																uni.redirectTo({url: 'index?id=' + ress.data.insertId});	
															}
														})
													}
												});
											}else {
												// console.log(res.data)
												that.setStorageeee(res.data.userID);
												uni.redirectTo({url: 'index?id=' + res.data.userID});
											}
										},
										fail:(res) => {
											console.log(res)
										}
									});
								}
							});
						}
					}
				});
			
			},
		}
	}
</script>


<style scoped>
	.login-content {
		padding: 70px 10px 10px;
		text-align: center;
		color: #333333;
	}
	.login-title {
		font-size: 26px;
		font-weight: bold;
		margin-bottom: 31px;
	}
	.login-content input {
		height: 50px;
		background: #F8F8F8;
		border-radius: 25px;
		text-align: left;
		padding: 15px;
		box-sizing: border-box;
		font-size: 15px;
	}
	.iphone,
	.password
	{
		position: relative;
		margin-bottom: 20px;
	}
	.iphone .uni-icons,
	.password .uni-icons {
		position: absolute;
		top: 14px;
		right: 30px;
	}
	.test-btn,
	.password-btn {
		color: #ff8b33;
		font-size: 15px;
		text-align: right;
	}

	.login-btn {
		width: 94%;
		height: 45px;
		background: #FF8B33;
		border-radius: 36px;
		color: #fff;
		font-size: 20px;
		text-align: center;
		line-height: 45px;
		position: fixed;
		bottom: 60px;
	}
	.inline_block {
		display: inline-block;
	}
	.other_login_container {
		margin-top: 20px;
		width: 100%;
		height: 200px;
	}
	.top_line {
		margin: 0px 30px;
		/* background-color: #F8F8F8; */
		height: 30px;
		border-top: 1px grey dotted;
	}
	#weixin_ico {
		display: inline-block;
		border: 1px grey solid;
		border-radius: 30px;
		padding: 5px;
		width: 64px;
		height: 64px;
		background: url('../../static/wx_logo.png') center no-repeat;
	}
</style>