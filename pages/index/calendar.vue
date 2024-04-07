<template>
	<view class="container">
		<view class="top-container">
			<view @click="turnToBillPage()" class="top-item top-btn">x</view>
			<view class="top-item title_container">
				统计视图
			</view>
		</view>		
		<view class="calendar_container">
			<uni-calendar @change="calendarChange" @monthSwitch="monthSwitch" :selected="calendarInitArr" :showMonth="true"/>
		</view>
		
		
		<view class="data_container">
			<view class="detail-container">
				<view class="detail-item-container">
					<view class="item-detail-container" v-for="(item, i) in detailShowArr" @click="popupShow(item)" :key="i">
						<view v-if="!item.c2Name" class="detail-category">{{item.c1Name}}</view>
						<view v-if="item.c2Name" class="detail-category">{{item.c2Name}}</view>
						<view class="detail-name">{{item.billName}}</view>
						<span class="detail-price">{{item.price}}</span>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content">
				<view class="popup-top-container">
					<span class="popup-top-txt">账单详情</span>
					<span class="popup-top-btn-container">
						<span @click="changebillDetail(goodDetailObj.bid)" class="popup-top-btn">修改</span>
						<span class="popup-top-btn">删除</span>
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
		
		
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
			let tpYear = new Date().getFullYear();
			let tpMonth = new Date().getMonth()+1;
			this.refreshCalendar(tpYear, tpMonth);
			// this.billInit(tpYear, tpMonth)
		},
		data() {
			return {
				userID: 0,
				bookID: 0,
				calendarInitArr:[],
				billDetailObj:{},
				detailShowArr:[],
				goodDetailObj:{}
			}
		},
		methods: {
			calendarChange(e) {
				this.detailShowArr = this.billDetailObj[e.fulldate];
			},
			monthSwitch(e) {
				this.refreshCalendar(e.year, e.month);
			},
			turnToBillPage() {
				uni.redirectTo({url: `billDetailPage?id=${this.userID}&bookid=${this.bookID}`});
			},
			changebillDetail(bid) {
				uni.redirectTo({url: `index?id=${this.userID}&bookid=${this.bookID}&bid=${bid}`});			
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
			refreshCalendar(year, month) {
				uni.request({
				    url: this.$baseUrl + '/calendarInit', 
					method: 'POST',
					data: {
						"bookID": this.bookID,
						"year": year,
						"month": month
					},
				    success: (res) => {
						this.calendarInitArr = res.data
						uni.request({
						    url: this.$baseUrl + '/getBillByMonth', 
							method: 'POST',
							data: {
								"bookID": this.bookID,
								"year": year,
								"month": month
							},
						    success: (res) => {
								this.billDetailObj = res.data;							
							}
						});
					}
				});
			},
		}
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
	.title_container {
		color: white;
		font-size: 20px;
		width: 60%;
	}
	.data_container {
		border-radius: 10px;
		background-color: white;
	}
</style>
