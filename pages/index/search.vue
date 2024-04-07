<template>
	<view class="container">
		<view class="top-container">
			<navigator open-type="navigateBack" :delta="1" class="top-item top-btn">x</navigator>
			<view class="top-item title_container">搜索</view>
		</view>	
		
		<uni-search-bar class="uni-mt-10" radius="10" bgColor="#EEEEEE" placeholder="输入关键字(分类和备注中)" clearButton="auto" cancelButton="none" @confirm="search" />
		<view class="detail-container">
			<view v-for="(val, key, i) in bookDetailArr" class="detail-item-container" :key="i">
				<view class="item-top-container">
					<span class="top-date">{{key}}</span>
					<span class="top-sum">共计：{{totalSumAll(key)}}</span>
				</view>
				<view v-for="(item, i) in val" @click="popupShow(item)" :key="i">
					<view :class="item.price>=0?'item-detail-container-green':'item-detail-container'">
						<!-- <view class="detail-category">{{item.c1Name}} - {{item.c2Name}}</view> -->
						<view v-if="!item.c2Name" class="detail-category">{{item.c1Name}}</view>
						<view v-if="item.c2Name" class="detail-category">{{item.c2Name}}</view>
						<view class="detail-name">{{item.billName}}</view>
						<!-- <span class="detail-price">{{item.price}}</span> -->
						<span :class="item.price>=0?'detail-price-green':'detail-price'">{{item.price}}</span>
					</view>
				</view>
			</view>
			<view class="noMore_txt_container">~ no more ~</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
		},
		data() {
			return {
				userID:0,
				bookID:0,
				accountBookArr:[],
				
				bookDetailArr: []
			}
		},
		methods: {
			search(e) {
				let tpSearchStr = e.value.trim();
				if(tpSearchStr) {
					uni.request({
					    url: this.$baseUrl + '/searchBillDetail', 
						method: 'POST',
						data: {
							"keyword": tpSearchStr,
							"bookID": this.bookID
						},
					    success: (res) => {
							this.bookDetailArr = res.data;
							console.log(this.bookDetailArr)
						}
					});
				}
			},
			totalSumAll(date){
				let tpArr = this.bookDetailArr[date];
				let tpSum = 0
				for (let i=0; i<tpArr.length; i++) {
					tpSum += tpArr[i].price
				}
				return tpSum.toFixed(2);
			},
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
	.noMore_txt_container {
		text-align: center;
	}
</style>
