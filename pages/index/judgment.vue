<template>
	<view>
		<!-- 这里不写任何东西，以免启动页面跳转会闪一下 -->
	</view>
</template>

<script>
	export default {
		onLoad() {
			uni.getStorage({
				key: 'storage_rander_avatar',
				success: function (res) {
					//之前用户选择的头像没有保存到mysql上
					console.log('之前头像没保存呢兄弟')
					let tpArr = res.data.split("#")
					uni.request({
					    url: this.$baseUrl + '/updateAvatar', 
						method: 'POST',
						data: {
							"userID": tpArr[1],
							"src": `/def/${tpArr[0]}.png`,
						},
					    success: (res) => {
							uni.removeStorage({
								key: 'storage_rander_avatar',
								success: function (res) {}
							});	
						}
					});
				}
			});
			
			uni.getStorage({
				key: 'storage_userID',
				success: function (res) {
					uni.redirectTo({url: 'index?id=' + res.data});
				},
				fail: function (res) {
					uni.redirectTo({url: 'loginPage'});
				}
			});
					
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
