<template>
	<view class="container">
		<view class="top-container">
			<navigator :url="'myAccountBook?id='+userID+'&bookid='+bookID" open-type="redirect" class="top-item top-btn">x</navigator>
			<view class="top-item title_container">账本详情</view>
		</view>		
		
		
		<uni-group title="账本信息" mode="card">
			<view class="detail_container">
				<view @tap="createrFlag && popupNameInput()" class="detail_container_item">
					<view class="left_label">账本名称</view>
					<span class="detail_name">
						{{bookDetailObj.bookName}}
						<uni-icons v-if="createrFlag" type="right" size="16"></uni-icons>
					</span>
				</view>
				<view class="detail_container_item">
					<view class="left_label">创建者</view>
					<span class="detail_name">{{createrFlag?'自己':'uuid：'+bookDetailObj.createrID}}</span>
				</view>
				<navigator :url="'statistics?id='+userID+'&bookid='+bookID" open-type="navigate" class="detail_container_item">
					<view class="left_label">报表统计</view>
					<uni-icons class="detail_name" type="right" size="16"></uni-icons>
				</navigator>
				<navigator :url="'addCategory?id='+userID+'&bookid='+bookID+'&navFlag=true'" open-type="navigate" class="detail_container_item">
					<view class="left_label">分类管理</view>
					<uni-icons class="detail_name" type="right" size="16"></uni-icons>
				</navigator>
				<view class="detail_container_item">
					<view class="left_label">创建日期</view>
					<span class="detail_name">{{bookDetailObj.createTime}}</span>
				</view>
			</view>
		</uni-group>
		<uni-group title="操作" mode="card">
			<view class="detail_container">
				<view class="detail_container_item" v-if="createrFlag">
					<view class="left_label">删除账本</view>
					<uni-icons @click="popDelete" class="detail_name" type="right" size="16"></uni-icons>
				</view>
				<view class="detail_container_item" id="isShare_container">
					<view class="left_label">是否共享</view>
					<view id="switch_btn">
						<switch @click="changeIsShare" disabled :checked="bookDetailObj.isShare?true:false" color="#FFCC33" style="transform:scale(0.8)"/>
					</view>
				</view>
			</view>
		</uni-group>
		<uni-group title="账本成员" mode="card" top="20">
			<view class="detail_container" id="user_container">
				<navigator :url="'otherDetail?uuid='+item.userID+'&bookid='+bookID+'&userid='+userID"  open-type="navigate"  class="book_user_box" v-for="(item, i) in bookMemberArr" :key="i">
					<image v-if="item.avatarUrlPC==''" class="book_user_avatar_defaut" :src="defAvatar" mode="aspectFit"></image>
					<image v-else class="book_user_avatar" :src="$static_Url + '/static/bsDesignAvatar'+item.avatarUrlPC" mode="aspectFit"></image>		
					<view v-if="!item.isAgree" class="book_user_avatar_mask"></view>
					<view class="book_user_name">{{item.userName}}</view>
				</navigator>
				<span class="book_user_box" @click="openInviteInput" v-if="createrFlag && bookDetailObj.isShare">
					<image class="book_user_avatar" src="../../static/add2.png" mode="aspectFit"></image>		
					<view class="book_user_name">邀请成员</view>
				</span>
				
			</view>
		</uni-group>
		
		
		<uni-popup ref="bookNameInput" type="dialog">
				<uni-popup-dialog @confirm="savebookName" :value="bookDetailObj.bookName" mode="input" title="输入账本名称"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="newBookNameNull" type="dialog">
			<uni-popup-message type="error" message="账本新名称不可用为空" :duration="2000"></uni-popup-message>
		</uni-popup>
		<uni-popup ref="isShareClose" type="dialog">
			<uni-popup-dialog @confirm="changeSwitchStatus" type="warn" cancelText="取消" confirmText="确认" title="提示" content="关闭共享功能,除作者外其余人将无权读取和写入该账本"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="inviteInput" type="dialog">
			<uni-popup-dialog mode="input" title="输入被邀请用户的uuid" placeholder="请输入uuid" @confirm="turnToOtherDetail"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="noSuchUser" type="dialog">
			<uni-popup-message type="error" message="不存在该用户,请确认uuid是否正确" :duration="2000"></uni-popup-message>
		</uni-popup>
		<uni-popup ref="POPdeleteBook" type="dialog">
			<uni-popup-dialog @confirm="deleteAccountBook" type="error" cancelText="取消" confirmText="确认" title="警告" content="是否删除该账本(该操作不可逆)"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
			this.bookDetailInit();
			this.bookMemberInit();
			
		},
		data() {
			return {
				userID:0,
				bookID:0,
				bookDetailObj: {},
				bookMemberArr: [],
				createrFlag: false,
				defAvatar: this.$static_Url + '/static/bsDesignAvatar/def/nophoto.png'
			}
		},
		methods: {
			popupNameInput() {
				this.$refs.bookNameInput.open()
			},
			changeIsShare(e) {
				if(this.createrFlag) {
					// console.log(this.bookDetailObj.isShare)
					if(this.bookDetailObj.isShare == 1) {
						//要关闭共享
						this.$refs.isShareClose.open()
					}else {
						this.changeSwitchStatus();
					}
				}
			},
			changeSwitchStatus() {
				uni.request({
				    url: this.$baseUrl + '/updateAccountBookIsShare', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
						"isShare": !this.bookDetailObj.isShare
					},
				    success: (res) => {
						this.bookDetailObj.isShare = !this.bookDetailObj.isShare;
						this.bookMemberInit();
					}
				});
			},
			savebookName(val) {
				let newBookName = val.trim();
				if(newBookName) {
					uni.request({
					    url: this.$baseUrl + '/updateAccountBookName', 
						method: 'POST',
						data: {
							"bookID": this.bookID,
							"bookName": newBookName
						},
					    success: (res) => {
							this.bookDetailObj.bookName = newBookName;
						}
					});
				}else {
					//去除空格为空
					this.$refs.newBookNameNull.open();
				}
			},
			openInviteInput() {
				this.$refs.inviteInput.open();
			},
			turnToOtherDetail(val) {
				val = val.trim();
				if(/^\d+$/.test(val)) {
					//纯数字才去验证是否存在该用户
					uni.request({
					    url: this.$baseUrl + '/checkUserExist', 
						method: 'POST',
						data: {
							"userID": val
						},
					    success: (res) => {
							if(res.data[0]) {
								uni.navigateTo({url: 'otherDetail?uuid='+val+'&bookid='+this.bookID+'&userid='+this.userID})
							}else {
								this.$refs.noSuchUser.open();
							}
						}
					});
				}else {
					this.$refs.noSuchUser.open();
				}
				
			},
			bookDetailInit() {
				uni.request({
				    url: this.$baseUrl + '/getAccountBookDetail', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
					},
				    success: (res) => {
						this.bookDetailObj = res.data[0];
						if(this.userID == this.bookDetailObj.createrID) {
							this.createrFlag = true;
						}
					}
				});
			},
			bookMemberInit() {
				uni.request({
				    url: this.$baseUrl + '/accountBookAllUser', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
					},
				    success: (res) => {
						this.bookMemberArr = res.data;
					}
				});
			},
			popDelete() {
				this.$refs.POPdeleteBook.open();
			},
			deleteAccountBook() {
				uni.request({
				    url: this.$baseUrl + '/deleteAccountBook', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
					},
				    success: (res) => {
						uni.navigateTo({
							url: `myAccountBook?id=${this.userID}&bookid=${this.bookID}`
						});
					}
				});
			}
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
	.detail_container_item:not(:first-child) {
		margin-top: 10px;
	}
	.detail_name,
	.detail_ico {
		flex: 1;
		text-align: right;
		color: #a2a2a2;
	}
	#isShare_container {
		display: inline-block;
		position: relative;
		width: 90%;
	}
	#switch_btn {
		position: absolute;
		right: 0px;
		bottom: -2px;
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
	.book_user_avatar,
	.book_user_avatar_defaut,
	.book_user_avatar_mask{
		display: inline-block;
		width: 40px;
		height: 40px;
		border: 1px grey solid;
		border-radius: 50%;
		padding: 5px;
	}
	.book_user_avatar_mask {
		position: absolute;
		left: 10px;
		top: 10px;
		background-color: rgba(0, 0, 0, 0.5);
	}
	#user_container {
		padding-left: 10px;
	}
	#add_user_btn {
		margin: 0px;
		padding: 0px;
	}
	.book_user_box {
		flex: 1;
		display: inline-block;
		position: relative;
		/* background-color: pink; */
		padding: 10px;
	}
	.book_user_name {
		width: 50px;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 12px
		/* padding: 0px 5px; */
	}
</style>