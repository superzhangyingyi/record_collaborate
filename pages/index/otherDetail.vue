<template>
	<view class="container">
		<view class="top-container">
			<navigator open-type="navigateBack" :delta="gobackNumb" class="top-item top-btn">x</navigator>
			<view class="top-item title_container">用户详情</view>
		</view>		
		
		<view class="inner_container">
			<span class="avatar_container">
				<image id="avatar" :src="avatarSrc" mode="aspectFit"></image>
			</span>
		</view>
		
		<uni-group title="资料" mode="card">
			<view class="detail_container">
				<view class="detail_container_item">
					<view class="left_label">昵称: </view>
					<span class="detail_name">{{otherUserInfoObj.userName}}</span>
				</view>
				<view class="detail_container_item">
					<view class="left_label">uuid: </view>
					<span class="detail_name">{{otherUserInfoObj.userID}}</span>
				</view>
				<view class="detail_container_item">
					<view class="left_label">注册日期</view>
					<span class="detail_name">{{otherUserInfoObj.RegistrantTime}}</span>
				</view>
				<view v-if="otherUserInfoObj.phone" class="detail_container_item">
					<view class="left_label">手机号</view>
					<span class="detail_name">{{otherUserInfoObj.phone}}</span>
				</view>
			</view>
		</uni-group>
		
		<uni-group title="操作" mode="card" top="20">
			<view class="detail_container">
				<view  v-if="otherUserInfoObj.bookID" class="detail_container_item">
					<view class="left_label">账本角色</view>
					<span v-if="!otherUserInfoObj.isAgree" class="detail_name">已邀请，待用户同意</span>					
					<span class="detail_name" v-else>
						<span v-if="otherUserInfoObj.isCreater">作者</span>
						<span v-else-if="otherUserInfoObj.isWrite">可读可写</span>
						<span v-else>只可读</span>
					</span>
				</view>
				
				
				
				<view v-if="!Boolean(otherUserInfoObj.bookID)">
					<view class="uni-title">邀请该用户作为账本的：</view>
					<radio-group class="radio_container" @change="changeInviteRole">
						<label class="radio"><radio value="0" :checked="inviteAsWatcher==0"/>参与者：可记录</label>
						<label class="radio"><radio value="1" :checked="inviteAsWatcher==1"/>观察者：只能读取</label>
					</radio-group>
				</view>
				
				<button @tap="changeUserRole" v-if="otherUserInfoObj.isWrite&&!otherUserInfoObj.isCreater&&Boolean(otherUserInfoObj.bookID)" type="primary" plain="true">切换为观察者</button>
				<button @tap="changeUserRole" v-if="!otherUserInfoObj.isWrite&&!otherUserInfoObj.isCreater&&Boolean(otherUserInfoObj.bookID)" type="primary" plain="true">给予编辑权限</button>
				<button @tap="POPoutSureRemoveRelation" v-if="Boolean(otherUserInfoObj.bookID) && !otherUserInfoObj.isCreater" type="warn" plain="true">解除关系</button>
				
				<button @tap="inviteBtn" :disabled="Boolean(otherUserInfoObj.bookID)" type="primary" plain="true">邀请</button>

				<uni-popup ref="sureRemoveRelation" type="dialog">
					<uni-popup-dialog @confirm="removeUserRelation" type="warn" cancelText="取消" confirmText="确认" title="提示" content="是否解除该用户与账本的关系"></uni-popup-dialog>
				</uni-popup>
			</view>
		</uni-group>


	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.userid;
			this.bookID = options.bookid;
			this.uuid = options.uuid;
			this.otherUserInit();
			
			// 发送在线信息，防止漏收
			this.$socket.emit('userInBook', {"userID":this.userID, "bookID":this.bookID});
			//接收服务器推送的 邀请加入账本结果
			this.getSocketBookInviteResult();
		},
		data() {
			return {
				gobackNumb:1,
				uuid: '',
				userID: 0,
				bookID: 0,
				otherUserInfoObj: {},
				avatarSrc: '',
				inviteAsWatcher:0 
			}
		},
		methods: {
			otherUserInit() {
				let that = this;
				uni.request({
				    url: this.$baseUrl + '/getOtherUserInfo', 
					method: 'POST',
					data: {
						uuid: this.uuid,
						bookID: this.bookID
					},
				    success: (res) => {
						this.otherUserInfoObj = res.data[0];
						if(this.otherUserInfoObj.avatarUrlPC) {
							this.avatarSrc = that.$static_Url + '/static/bsDesignAvatar'+this.otherUserInfoObj.avatarUrlPC;
						}else {
							this.avatarSrc = that.$static_Url + '/static/bsDesignAvatar/def/nophoto.png';
						}
					}
				});
			},
			inviteBtn() {
				// console.log(this.inviteAsWatcher)
				uni.request({
				    url: this.$baseUrl + '/inviteUser', 
					method: 'POST',
					data: {
						uuid: this.uuid,
						bookID: this.bookID,
						isWatcher: this.inviteAsWatcher,
						userID: this.userID
					},
				    success: (res) => {
						if(!res.data.errno) {
							this.otherUserInfoObj.bookID = this.bookID;
							this.otherUserInfoObj.isAgree = 0;
							this.otherUserInfoObj.isWrite = !this.inviteAsWatcher;
							//重置，防止不刷新页面，用户再选默认的就变成上次结果
							this.inviteAsWatcher = 0;
						}
					}
				});
			},
			changeInviteRole(e) {
				this.inviteAsWatcher = e.detail.value;
			},
			POPoutSureRemoveRelation() {
				this.$refs.sureRemoveRelation.open()
			},
			removeUserRelation() {
				uni.request({
				    url: this.$baseUrl + '/deleteUserRelationInBook', 
					method: 'POST',
					data: {
						uuid: this.uuid,
						bookID: this.bookID,
					},
				    success: (res) => {
						if(!res.data.errno) {
							this.otherUserInfoObj.bookID = null;
						}
					}
				});
			},
			changeUserRole() {
				uni.request({
				    url: this.$baseUrl + '/updateUserRoleInBook', 
					method: 'POST',
					data: {
						uuid: this.uuid,
						bookID: this.bookID,
						isWrite: !this.otherUserInfoObj.isWrite
					},
				    success: (res) => {
						if(!res.data.errno) {
							this.otherUserInfoObj.isWrite = !this.otherUserInfoObj.isWrite;
						}
					}
				});
			},
			getSocketBookInviteResult() {
				this.$socket.on('push_book_invite_result', data => {
					if(data == 'refresh'){
						console.log('get result from sky');
						this.otherUserInit();
					}	
				});
			},
			
		}
	}
</script>

<style scoped>
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
		padding: 20px 0px 10px;
	}
	#avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: gray 1px solid;
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
	.detail_container_item:not(:first-child) {
		margin-top: 10px;
	}
	.detail_ico {
		flex: 1;
		text-align: right;
		color: #a2a2a2;
		height: inherit;
		line-height: inherit;
		font-size: inherit;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.left_label {
		width: 70px;
	}
	.radio_container {
		font-size: 14px;
		margin: 10px 10px 15px;
	}
	.radio_container label:last-child {
		margin-left: 20px;
	}
	button {
		margin-bottom: 10px;
	}

</style>