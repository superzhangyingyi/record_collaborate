<template>
	<view class="container">
		<view class="top-container">
			<view @click="turnToBillPage()" class="top-item top-btn">x</view>
			<view class="top-item title_container">我的</view>
		</view>		
		<view class="inner_container">
			<span class="avatar_container">
				<uni-collapse>
					<uni-collapse-item title-border="none" :border="false" :show-arrow="false">
						<template v-slot:title>
							<span class="positionR">
								<image id="avatar" @error="setDefImage()" :src="tpImage" mode="aspectFit"></image>		
								<span class="avatar_ico icon iconfont">&#xe653;</span>
							</span>
						</template>
						<view class="content">
							<view class="avatar_btn_container">
								<span @tap.stop="randerAvatar()" class="avatar_btn">随机</span>
								<span @tap.stop="uploadAvatar()" class="avatar_btn">上传</span>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</span>
		</view>
		
		<uni-group title="资料" mode="card">
			<view class="detail_container">
				<view class="detail_container_item">
					<view class="left_label">uuid: </view>
					<span class="detail_name">{{userDetailObj.userID}}</span>
				</view>
				<view @tap="popupNameInput()" class="detail_container_item">
					<view class="left_label">昵称</view>
					<span class="detail_name">
						{{userDetailObj.userName}}
						<uni-icons type="right" size="16"></uni-icons>
					</span>
				</view>
				<view class="detail_container_item">
					<view class="left_label">注册日期</view>
					<span class="detail_name">{{showRegistrantTime}}</span>
				</view>
				<view class="detail_container_item" v-if="userDetailObj.wechatOpenid">
					<view class="left_label">注册账号</view>
					<span class="detail_name">微信</span>
				</view>
				<view class="detail_container_item" v-if="!userDetailObj.wechatOpenid">
					<view class="left_label">注册账号</view>
					<span class="detail_name">手机</span>
				</view>
				<view class="detail_container_item" v-if="!userDetailObj.wechatOpenid">
					<view class="left_label">手机号</view>
					<span class="detail_name">{{userDetailObj.phone}}</span>
				</view>
			</view>
		</uni-group>
		<uni-group title="操作" mode="card" top="20">
			<view class="detail_container">
				<view class="detail_container_item" @tap="changePassword()" v-if="!userDetailObj.wechatOpenid">
					<view class="left_label">修改密码</view>
					<uni-icons class="detail_ico" type="right" size="16"></uni-icons>
				</view>
				<view class="detail_container_item" @tap="removeStorageee()">
					<view class="left_label">退出登录</view>
					<uni-icons class="detail_ico" type="right" size="16"></uni-icons>
				</view>
			</view>
		</uni-group>
		
		
		<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog @confirm="saveUserName" :value="userDetailObj.userName" ref="inputClose" mode="input" title="输入昵称"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupPassWord" type="center" :mask-click="false">
			<view class="popup_container">
				<span class="password_title">修改密码</span>
				<uni-easyinput v-model="oldPassword" class="password_input" type="password" placeholder="请输入原密码"></uni-easyinput>
				<uni-easyinput v-model="newPassword" class="password_input" type="password" placeholder="请输入新密码"></uni-easyinput>
				<span class="warm_txt">{{warmTxt}}</span>
				<view class="popup_bottom_container">
					<span @tap="cancelChangePaaword()" class="popup_bottom_btn">取消</span>
					<span @tap="changePaaword()" class="popup_bottom_btn">确定</span>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
			this.refreshUserDetail();
		},
		data() {
			return {
				userID:0,
				bookID:0,
				userDetailObj:{},
				tpImage:'',
				randerNumb:0,
				changeAvatarFlag:false,
				showRegistrantTime:'',
				oldPassword:'',
				newPassword:'',
				warmTxt:''
			}
		},
		methods: {
			turnToBillPage() {
				if(this.changeAvatarFlag) {
					//先把Storage的头像存了才跳转					
					let that = this;
					uni.request({
					    url: this.$baseUrl + '/updateAvatar', 
						method: 'POST',
						data: {
							"userID": this.userID,
							"src": `/def/${this.randerNumb}.png`,
						},
					    success: (res) => {
							uni.removeStorage({
								key: 'storage_rander_avatar',
								success: function (res) {
									uni.redirectTo({url: `billDetailPage?id=${that.userID}&bookid=${that.bookID}`});
								}
							});	
						},
						fail: (err) => {
							console.log(err)
							uni.redirectTo({url: `billDetailPage?id=${that.userID}&bookid=${that.bookID}`});
						}
					});
				}else {
					uni.redirectTo({url: `billDetailPage?id=${this.userID}&bookid=${this.bookID}`});
				}
			},
			setDefImage() {
				this.tpImage=this.$static_Url + "/static/bsDesignAvatar/def/nophoto.png"
			},
			randerAvatar() {
				//这里不保存，防止用户狂按随机，消耗性能。
				//在turnToBillPage前保存url
				let that = this;
				let nextNumb = (that.randerNumb + 1)%12
				this.changeAvatarFlag = true;
				uni.setStorage({
					key: 'storage_rander_avatar',
					data: `${nextNumb}#${that.userID}`,
					success: function () {
						that.randerNumb = nextNumb;
						that.tpImage = that.$static_Url + `/static/bsDesignAvatar/def/${nextNumb}.png`
					}
				});
			},
			uploadAvatar() {
				let that = this;
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success:(res)=>{
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: this.$baseUrl + '/uploadAvatar',
							filePath:tempFilePaths[0],
							name:'file',	
							formData: {
								'userID': this.userID  //除图片外的数据 req.body.uerID
							},
							success: (res) => {
								that.changeAvatarFlag = false;
								uni.removeStorage({
									key: 'storage_rander_avatar',
								});
								that.tpImage = tempFilePaths[0]
							}
						})
					}
				})

			},
			removeStorageee() {
				uni.removeStorage({
					key: 'storage_userID',
					success: function (res) {
						uni.redirectTo({url: `loginPage`});
					}
				});		
			},
			refreshUserDetail() {
				let that = this;
				this.$selfGlobal.getUserDetail(this.userID, function(result) {
					that.userDetailObj = result;
					console.log(that.userDetailObj)
					that.showRegistrantTime = result.RegistrantTime.split(' ')[0];
					that.tpImage = that.$static_Url + `/static/bsDesignAvatar${result.avatarUrlPC}?`+Date.now()
				})
			},
			popupNameInput() {
				this.$refs.inputDialog.open()
			},
			saveUserName(val) {
				let tpStr = val.trim();
				if(tpStr) {
					uni.request({
					    url: this.$baseUrl + '/updateUserDetail', 
						method: 'POST',
						data: {
							"userID": this.userID,
							"userName": tpStr
						},
					    success: (res) => {
							this.refreshUserDetail();
						}
					});
				}
			},
			changePassword() {
				this.$refs.popupPassWord.open();
			},
			cancelChangePaaword() {
				this.$refs.popupPassWord.close();
			},
			changePaaword() {
				if(this.oldPassword != this.userDetailObj.userPassword) {
					this.warmTxt = '原密码不正确';
					return false;
				}
				if(!this.newPassword) {
					this.warmTxt = '新密码不能为空';
					return false;
				}
				this.warmTxt = '';
				uni.request({
				    url: this.$baseUrl + '/updateUserDetail', 
					method: 'POST',
					data: {
						"userID": this.userID,
						"userPassword": this.newPassword
					},
				    success: (res) => {
						this.$refs.popupPassWord.close();
						this.oldPassword = '';
						this.newPassword = '';
						this.refreshUserDetail();
					}
				});
			},
			
		}
	}
</script>

<style scoped>
	.warm_txt {
		color: red;
	}
	page {
		background-color: #fff;
	}
	.top-container {
		width: 100%;
		height: 60px;
		padding-top: 20px;
		background-color: rgb(58, 147, 251);
	}
	.top-item {
		display: inline-block;
		line-height: 60px;
		text-align: center;
	}
	.top-btn {
		width: 20%;
		color: white;
		font-size: 30px;
	}
	.title_container {
		color: white;
		font-size: 20px;
		width: 60%;
	}
	.inner_container {
		text-align: center;
		padding: 40px 0px 20px;
	}
	#avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-bottom: 10px;
	}
	.positionR {
		position: relative;
	}
	.avatar_ico {
		position: absolute;
		width: 26px;
		height: 26px;
		line-height: 26px;
		font-size: 22px;
		color: white;
		background-color: black;
		opacity: 0.8;
		border-radius: 50%;
		right: 0px;
		bottom: 14px;
	}
	.avatar_btn {
		display: inline-block;
		padding: 5px 10px;
		border: 1px solid #2a2a2a;
		border-radius: 5px;
	}
	.avatar_btn:last-child {
		margin-left: 30px;
	}
	image{will-change: transform}


	.detail_container_item {
		height: 30px;
		line-height: 30px;
		font-size: 16px;
		display: flex;
		position: relative;
		padding: 0px 15px;
	}
	.detail_ico {
		position: absolute;
		right: 15px;
	}
	.detail_container_item:not(:first-child) {
		margin-top: 10px;
	}
	.left_label {
		width: 70px;
	}
	.popup_container {
		width: 260px;
		height: 200px;
		background-color: white;
		padding: 20px;
		border-radius: 20px;
		text-align: center;
		position: relative;
	}
	.password_title {
		font-size: 18px;
		color: #a2a2a2;
	}
	.password_input {
		margin-top: 20px;
	}
	.popup_bottom_container {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 60px;
		line-height: 60px;
		border-top: 1px solid #f4f4f4;
		font-size: 18px
	}
	.popup_bottom_btn {
		display: inline-block;
		width: 50%;
	}
	.popup_bottom_btn:last-child {
		color: #0d81ff;
		border-left: 1px solid #f4f4f4;
		box-sizing: border-box;
	}
</style>