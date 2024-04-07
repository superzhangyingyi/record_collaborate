<template>
	<view class="container">
		<view class="top-container">
			<view @click="showDrawer('showDrawerRef')" class="top-item top-btn icon iconfont">&#xe696;</view>
			<view class="top-item title_container">
				<picker mode="date" fields="month" :value="choiceDate" @change="dateChange($event)">
					<span class="choiceDate_show">{{choiceDate}}</span>
					<uni-icons type="bottom" size="20" color="white"></uni-icons>
				</picker>
				
			</view>
			<view @click="turnToCalendar()" class="top-item top-btn" id="add_btn">
				<uni-icons color="white" type="calendar-filled" size="30"></uni-icons>
			</view>
		</view>	
		<view class="detail-container">
			<view v-for="(val, key, i) in bookDetailArr" class="detail-item-container" :key="i">
				<view class="item-top-container">
					<span class="top-date">{{key}}</span>
					<span class="top-sum">共计：{{totalSumAll(key)}}</span>
				</view>
				<view v-for="(item, i) in val" @click="popupShow(item)" :key="i">
					<view :class="item.price>=0?'item-detail-container-green':'item-detail-container'">
						<view v-if="!item.c2Name" class="detail-category">{{item.c1Name}}</view>
						<view v-if="item.c2Name" class="detail-category">{{item.c2Name}}</view>
						<view class="detail-name">{{item.billName}}</view>
						<span :class="item.price>=0?'detail-price-green':'detail-price'">{{item.price}}</span>
					</view>
				</view>
			</view>
			<span>~ no more ~</span>
		</view>
		<uni-icons @tap="turnToIndex()" class="add_btn_container" type="plus-filled" size="80" color="#3a93fb"></uni-icons>
		<uni-drawer ref="showDrawerRef" mode="left" :width="260">
			<view class="drawer_container">
				<image @click="turnToMyDetail()" class="drawer_avatar" @error="setDefImage()" :src="tpImage" mode="aspectFit"></image>
				<view class="drawer_name">{{userDetailObj.userName}}</view>
				<view class="drawer_useTime">已经使用{{showUseTime}}天了</view>
				<view class="pageItem_container" open-type="redirect" url="">
					<navigator class="page_item" :url="'myAccountBook?id='+userID+'&bookid='+bookID" open-type="redirect">
						<span class="page_item_ico icon iconfont">&#xe60d;</span>
						<span class="page_item_txt">我的账本</span>
					</navigator>
					<navigator :url="'search?id='+userID+'&bookid='+bookID" open-type="navigate" class="page_item">
						<span class="page_item_ico icon iconfont">&#xe64e;</span>
						<span class="page_item_txt">搜索账单</span>
					</navigator>					
					<navigator :url="'statistics?id='+userID+'&bookid='+bookID" open-type="navigate" class="page_item">
						<span class="page_item_ico icon iconfont">&#xe642;</span>
						<span class="page_item_txt">统计信息</span>
					</navigator>
					<view class="page_item" @click="exportData()">
						<!-- <span class="page_item_ico icon iconfont">&#xe605;</span> -->
						<uni-icons class="page_item_ico" color="#869099" type="download" size="26"></uni-icons>						
						<span class="page_item_txt">导出数据</span>
					</view>
					<view class="page_item" @click="turnToMyDetail()">
						<span class="page_item_ico icon iconfont">&#xe605;</span>
						<span class="page_item_txt">设置</span>
					</view>
				</view>
			</view>
		</uni-drawer>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content">
				<view class="popup-top-container">
					<span class="popup-top-txt">账单详情</span>
					<span class="popup-top-btn-container">
						<span @click="showSharePoP(goodDetailObj)" class="popup-top-btn">分享</span>
						<span @click="changebillDetail(goodDetailObj.bid)" class="popup-top-btn">修改</span>
						<span @click="deleteDetail(goodDetailObj.bid)" class="popup-top-btn">删除</span>
					</span>
				</view>
				<view class="popup-item-container">
					<span class="popup-item-title">金额</span>
					<span class="popup-item-val">{{goodDetailObj.price}}</span>
				</view>
				<view class="popup-item-container">
					<span class="popup-item-title">分类</span>
					<span class="popup-item-val">{{goodDetailObj.useCName}}</span>
				</view>
				<view class="popup-item-container">
					<span class="popup-item-title">记账者id</span>
					<span class="popup-item-val">{{goodDetailObj.editUserId}}</span>
				</view>
				<view class="popup-item-container">
					<span class="popup-item-title">时间</span>
					<span class="popup-item-val popup-date-val-container">
						<view class="popup-date-val">{{goodDetailObj.date}}</view>
						<view class="popup-date-val">记录于{{goodDetailObj.createTime}}</view>
					</span>
				</view>
				<view class="popup-item-container">
					<span class="popup-item-title">备注</span>
					<span class="popup-item-val">{{goodDetailObj.billName}}</span>
				</view>
			</view>
		</uni-popup>			
	
		<uni-popup ref="noWritePermissions" type="dialog">
			<uni-popup-message type="error" message="您无权在该账本下记录信息" :duration="2000"></uni-popup-message>
		</uni-popup>
		
		<uni-popup ref="popupExportData" background-color="#fff">
			<view class="popup-content">
				<view class="ExportData_tip_content">
					数据导出成功，您可以通过
					<uni-link :href="exportDataURL" color="red" showUnderLine="false">点击此处</uni-link>
					下载导出的数据
				</view>
			</view>
		</uni-popup>	
		
		<uni-popup ref="notifyBeInviteUser" type="dialog">
			<uni-popup-dialog @confirm="answersInvite(1)" @close="answersInvite(0)" :content="BeInviteDataObj.msg" type="warn" cancelText="拒绝" confirmText="同意" title="提示" :mask-click="false"></uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
	import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare();
	export default {
		onLoad(options) {
			let that = this;
			this.userID = options.id;
			this.bookID = options.bookid;
			//TODO:
			let tpMonth = new Date().getMonth()+1
			this.choiceDate = new Date().getFullYear() + "-" + (tpMonth<10?'0'+tpMonth:tpMonth);
			// let tpMonth = 2
			// this.choiceDate = new Date().getFullYear() + "-" + (tpMonth<10?'0'+tpMonth:tpMonth);
			
			this.billInit();
			this.$selfGlobal.getUserDetail(this.userID, function(result) {
				that.userDetailObj = result;
				that.tpImage = that.$static_Url + `/static/bsDesignAvatar${result.avatarUrlPC}?`+Date.now()
				that.showUseTime = Math.floor((new Date().getTime()-new Date(result.RegistrantTime).getTime())/(1000*60*60*24))
			})
			//检查有无写权限
			this.checkAllPermissions();
			
			
			//bdInit 让服务器知道a用户选择的A账本
			this.$socket.emit('userInBook', {"userID":this.userID, "bookID":this.bookID});
			
			//接收服务器推送的该账本数据更新通知
			this.getSocketBookDataUpdate()
			//接收服务器推送的该用户被邀请加入账本通知
			this.getSocketBookInvite()
			//接收服务器推送的该用户被某账本删除关系
			this.getSocketBeDelete()
			//接收服务器推送的该用户某账本关闭共享模式
			this.getSocketBeCloseShare()
			//接收服务器推送的该用户某账本 权限改变
			this.getSocketBeChangeRole()
			
		},
		mounted(){
			//每次都去检查是否有新消息
			uni.request({
			    url: this.$baseUrl + '/newNotify', 
				method: 'POST',
				data: {
					"bookID": this.bookID,
					"userID": this.userID
				},
			    success: (res) => {
					//如果有消息，会主动唤醒socket.io推送过来，这里无需操作
				}
			});
		},
		data() {
			return {
				userID:0,
				bookID:0,
				bookDetailArr:[],
				choiceDate:'',
				goodDetailObj:{},
				userDetailObj:{},
				tpImage: '',
				showUseTime:{},
				BeInviteDataObj:{},
				WritePermissionsFlag: false,
				DeletePermissionsFlag: false,
				exportDataURL: ''
			}
		},
		methods: {
			turnToIndex() {
				//先检查是否可写，该账本无写入权限不能跳转
				if(this.WritePermissionsFlag) {
					uni.redirectTo({url: `index?id=${this.userID}&bookid=${this.bookID}`});
				}else {
					this.$refs.noWritePermissions.open();
				}

			},
			checkAllPermissions() {
				uni.request({
				    url: this.$baseUrl + '/checkWritePermissions', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
						"userID": this.userID
					},
				    success: (res) => {
						if(res.data[0].isWrite) {
							//可写
							this.WritePermissionsFlag = true;
						}else {
							this.WritePermissionsFlag = false;
						}
						if(res.data[0].isCreater) {
							//可删权限
							this.DeletePermissionsFlag = true;
						}else {
							this.DeletePermissionsFlag = false;
						}
						
					}
				});
			},
			exportData() {
				// plus.runtime.openUrl(encodeURI(this.$baseUrl + '/file/test.csv'));
				let that = this;
				uni.request({
				    url: that.$baseUrl + '/exportAllData', 
					method: 'POST',
					data: {
						"bookID": this.bookID
					},
				    success: (res) => {
						console.log(res.data.url);
						this.exportDataURL = res.data.url;
						this.$refs.showDrawerRef.close()
						this.$refs.popupExportData.open()
					}
				});
			},
			turnToMyDetail() {
				uni.redirectTo({url: `myDetail?id=${this.userID}&bookid=${this.bookID}`});
			},
			setDefImage() {
				// console.log('errrr');
				this.tpImage= this.$static_Url + "/static/bsDesignAvatar/def/nophoto.png"
			},
			showDrawer(e) {
				this.$refs[e].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				this.$refs[e].close()
			},
			dateChange(e) {
				this.choiceDate = e.detail.value;
				this.billInit()
			},
			billInit() {
				let dateArr = this.choiceDate.split('-');
				uni.request({
				    url: this.$baseUrl + '/getBillByMonth', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
						"year": dateArr[0],
						"month": dateArr[1]
					},
				    success: (res) => {
						
						this.bookDetailArr = res.data;
					}
				});
			},
			getSocketBookDataUpdate() {
				//收到通知，就重新初始化页面所有数据
				this.$socket.on('push_data', data => {
					if(data == 'getBillByMonth') {
						this.billInit();
					}
				});
			},
			getSocketBookInvite() {
				this.$socket.on('push_book_invite', data => {
					this.BeInviteDataObj = data;
					// 防止this.$refs.notifyBeInviteUser获取不到
					if(this.$refs.notifyBeInviteUser) {
						this.$refs.notifyBeInviteUser.open();
					}else {
						this.$nextTick(() => {
							//现在暂时没有this.$refs 就在下一个更新队列循环结束之后立即调用
							this.$refs.notifyBeInviteUser.open();
						})
					}				
				});
			},
			getSocketBeDelete() {
				this.$socket.on('push_book_beDelete', data => {
					let that = this;
					console.log(data)
					uni.showModal({
						title: '提示',
						content: `管理员将您从<${data[0][0].bookName}>账本移除`,
						showCancel: false,
						success: function (res) {
							if (res.confirm && data[0][0].bookID == that.bookID) {
								//点击确认且当前使用的账本就是 被解除关系的，才进行刷新
								that.bookID = data[1][0].bookID;
								that.billInit();
								that.checkAllPermissions();
							}
						}
					});	
				});
			},
			getSocketBeCloseShare() {
				this.$socket.on('push_book_closeShare', data => {
					let that = this;
					uni.showModal({
						title: '提示',
						content: `管理员关闭了<${data.closeBookName}>账本的共享模式，您暂时无权读写该账本`,
						showCancel: false,
						success: function (res) {
							if (res.confirm && data.closeBookID==that.bookID) {
								that.bookID = data.defaultBookID;
								that.billInit();
								that.checkAllPermissions();
							}
						}
					});	
				});
			},
			getSocketBeChangeRole() {
				let that = this;
				this.$socket.on('push_book_reCheck_permissions', data => {
					that.checkAllPermissions();
				});
			},
			answersInvite(isAgree) {
				// console.log(this.BeInviteDataObj.bookID);
				uni.request({
				    url: this.$baseUrl + '/answersInvite', 
					method: 'POST',
					data: {
						"bookID": this.BeInviteDataObj.bookID,
						"userID": this.userID,
						"agree": isAgree
					},
				    success: (res) => {
						this.$refs.notifyBeInviteUser.close();
					}
				});
			},
			turnToCalendar() {
				uni.redirectTo({url: `calendar?id=${this.userID}&bookid=${this.bookID}`});
				
			},
			totalSumAll(date){
				let tpArr = this.bookDetailArr[date];
				let tpSum = 0
				for (let i=0; i<tpArr.length; i++) {
					tpSum += tpArr[i].price
				}
				return tpSum.toFixed(2);
			},
			popupShow(itemObj) {
				this.goodDetailObj = itemObj;
				if(itemObj.c2Name) {
					this.goodDetailObj.useCName = itemObj.c2Name;
				}else {
					this.goodDetailObj.useCName = itemObj.c1Name;
				}
				this.$refs.popup.open('bottom');
			},
			changebillDetail(bid) {
				if(this.WritePermissionsFlag) {
					uni.redirectTo({url: `index?id=${this.userID}&bookid=${this.bookID}&bid=${bid}`});			
				}else {
					this.$refs.noWritePermissions.open();
				}
			},
			deleteDetail(bid) {
				let that = this;
				if(this.DeletePermissionsFlag) {
					uni.showModal({
						title: '提示',
						content: '是否删除该记录',
						success: function (res) {
							if (res.confirm) {
								uni.request({
								    url: this.$baseUrl + '/deleteDetail', 
									method: 'POST',
									data: {
										"bid": bid,
										"bookID": that.bookID,
										"userID": that.userID
									},
								    success: (res) => {
										that.$refs.popup.close();
										that.billInit();
									}
								});
							}
						}
					});
				}else {
					this.$refs.noWritePermissions.open();
				}
			},
			showSharePoP(obj) {
				// console.log(obj.date)
				//`bookID=1000&userID=100000&day=2023-05-23`
				//http://localhost:8080/#/?shareURL=1684991328920100000&shareCode=t6v80j
				let sendParameterStr = `bookID=${this.bookID}&userID=${this.userID}&day=${obj.date}`
				uni.request({
				    url: this.$baseUrl + '/newShareAdd', 
					method: 'POST',
					data: {
						"parameterStr": sendParameterStr,
						"shareModel": 'billDetail',
						"userID": this.userID,
						"bookID": this.bookID
					},
				    success: (res) => {
						// console.log(res.data)
						let sendObj = {
							type: 0,
							href: `http://49.234.49.11:81/#/?shareURL=${res.data.shareURL}&shareCode=${res.data.shareCode}`,
							title: `${res.data.userName}给您分享了ta的账单详情`,
							summary: `${res.data.userName}给您分享了在<${obj.date}>的账单详情，分享码为：${res.data.shareCode}`,
							imageUrl: '/static/app-plus/sharemenu/pig.jpg'
						}
						this.uniShare(sendObj);
					},
				})
			},
			uniShare(useObj) {
			    uniShare.show({
			        content: useObj,
			        menus: [
						{
			                "img": "/static/app-plus/sharemenu/wx.png",
			                "text": "微信好友",
			                "share": { 
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
			    }, e => {})
			}
		},
	}
</script>

<style scoped>
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
	#add_btn {
		width: 20%;
		color: white;
		font-size: 18px;
	}
	.title_container {
		color: white;
		font-size: 20px;
		width: 60%;
	}
	.input_container {
		background-color: white;
		border-radius: 20px;
		overflow: auto;
		margin: 20px;
		padding: 0px 20px;
	}
	.drawer_container {
		margin-top: 60px;
		margin-left: 10px;
	}
	.drawer_avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		
	}
	.drawer_name {
		margin-top: 20px;
		font-size: 18px;
		font-weight: 600;
	}
	.drawer_useTime {
		margin: 5px 0px;
		color: #a2a2a2;
	}
	.pageItem_container {
		padding-top: 10px;
	}
	.page_item {
		height: 40px;
		line-height: 40px;
		/* background-color: palegoldenrod; */
		margin: 15px 0px;
		font-size: 16px;
	}
	.page_item_ico {
		display: inline-block;
		font-size: 24px;
		color: #869099;
		padding-right: 30px;
	}
	.page_item_txt {
		vertical-align: top;
	}
	.detail-container {
		text-align: center;
		padding-bottom: 40px;
	}
	.detail-item-container {
		text-align: left;
	}
	.add_btn_container {
		width: 80px;
		height: 80px;
		line-height: 80px;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10px;
	}
	.ExportData_tip_content {
		width: 200px;
	}
</style>
