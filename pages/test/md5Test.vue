<template>
	<view>
		md5
	</view>
</template>

<script>
	//加密
	import { JSEncrypt } from 'jsencrypt'
	export default {
		onLoad(options) {
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
				let sendStr = encryptor.encrypt('123456');
				uni.request({
				    url: 'http://localhost:442/RSAUnicode', 
					method: 'POST',
					data: {
						"txt": sendStr,
						'phone': that.iphoneValue,
						'userPassword': that.passwordValue,
						'model': this.registrationFlag,
					},
				    success: (res) => {
						console.log(res.data)
					}
				});
			})
			.catch(data => {
				//直接发远程不加密
				url: 'http://49.234.49.11:442/phoneLogin',
				method: 'POST',
				data: {
					'phone': that.iphoneValue,
					'userPassword': that.passwordValue,
					'model': this.registrationFlag,
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
			})
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
