<template>
	<view class="container">
		<view class="top-container">
			<navigator open-type="navigateBack" :delta="1" class="top-item top-btn">x</navigator>
			<view class="top-item title_container">
				<picker mode="date" fields="month" :value="choiceDate" @change="dateChange">
					<span class="choiceDate_show">{{choiceDate}}</span>
					<uni-icons type="bottom" size="20" color="white"></uni-icons>
				</picker>
		
			</view>
			<view class="top-item top-btn" id="add_btn">
				<uni-icons @tap="showSharePoP" class="top-btn_first_item" color="white" type="redo-filled" size="30"></uni-icons>
				<uni-icons @tap="showDrawer" color="white" type="settings-filled" size="30"></uni-icons>
			</view>
		</view>	
		<view class="detail-container" id="outIn_overview_detail-container">
			<view class="detail_container_title">收支总览</view>
			<view class="outIn_overview_line">
				<span class="outIn_overview_line_left">
					<view class="outIn_overview_line_title">支出</view>
					<view class="outIn_overview_line_value">{{overviewObj.out}}</view>
				</span>
				<span class="outIn_overview_line_right">
					<view class="outIn_overview_line_title">收入</view>
					<view class="outIn_overview_line_value">{{overviewObj.in}}</view>
				</span>
			</view>
			<view class="outIn_overview_line">
				<span class="outIn_overview_line_left">
					<view class="outIn_overview_line_title">结余</view>
					<view class="outIn_overview_line_value">{{overviewObj.balance}}</view>
				</span>
				<span class="outIn_overview_line_right">
					<view class="outIn_overview_line_title">日均支出</view>
					<view class="outIn_overview_line_value">{{overviewObj.eachDay}}</view>
				</span>
			</view>	
		</view>
		
		
		
		<view v-if="DataFlag" class="detail-container" id="eachDay_line_detail-container">
			<view class="detail_container_title">每日统计</view>
			<view class="detail_container_uchart_area">
				<qiun-data-charts type="area" :chartData="eachDayLineObj" :canvas2d="true" :opts="lineOption" canvasId="yGFIpasaRvlnmcBQnhTmojNFJbRxpQqM"/>
			</view>
		</view>
		<view v-if="DataFlag" class="detail-container" id="category_bin_detail-container">
			<view class="detail_container_title">分类报表</view>	
			<view class="detail_container_uchart_area">
				<qiun-data-charts type="ring" :opts="pieOption" :chartData="categoryPieObj" :canvas2d="true" canvasId="oXAybhUVhOydbmNZAdroEYlzJqafcQLJ"/>
			</view>
		</view>
		<view v-if="DataFlag" class="detail-container" id="eachDay_table_detail-container">
			<view class="detail_container_title">日报表</view>
			<view class="">
				<uni-table ref="table" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="40" align="center">日期</uni-th>
					<uni-th width="20" align="center">收入</uni-th>
					<uni-th width="20" align="center">支出</uni-th>
					<uni-th width="20" align="center">结余</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in dayTableArr" :key="index">
					<uni-td v-if="item.recordDate" align="center">{{item.recordDate}}</uni-td>
					<uni-td v-else align="center">{{Number(item.month)+'月'}}</uni-td>
					<uni-td align="center">{{item.in}}</uni-td>
					<uni-td align="center">{{item.out}}</uni-td>
					<uni-td align="center">
						<span :class="Number(item.balance)>0?'green':'red'">{{item.balance}}</span>
					</uni-td>
				</uni-tr>
			</uni-table>
			</view>
		</view>
		
		
		<view v-if="!DataFlag" id="nodata_container">
			<!-- <uni-icons type="info" size="100" color="grey"></uni-icons> -->
			<span class="nodata_ico iconfont">&#xe6e9;</span>
			<view class="nodata_txt iconfont">暂无数据</view>
			<!-- <span>暂无数据</span> -->
		</view>
		

		<uni-drawer ref="showDrawerRef" mode="right" :width="260">
			<view class="drawer_container">
				<view>年度报告</view>
				<picker mode="date" fields="year" :value="useYear" @change="yearChange">
					<span class="choiceYear_show">{{useYear}}</span>
					<uni-icons type="bottom" size="20" color="black"></uni-icons>
				</picker>
				
				<picker :value="bookIDArrIndex" @change="bookChange($event)" :range="bookIDArr" range-key="bookName">
					<span class="choiceYear_show">{{bookName}}</span>
					<uni-icons type="bottom" size="20" color="black"></uni-icons>
				</picker>
				<button @tap="customSave" type="primary" plain="true">确定</button>
			</view>
		</uni-drawer>

	</view>
</template>

<script>
	import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare();
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
			
			uni.request({
			    url: this.$baseUrl + '/bookIDInit',
				method: 'POST',
				data: {
					userID: this.userID
				},
			    success: (res) => {
					this.bookIDArr = res.data;
					this.bookName = this.bookIDArr[this.bookIDArrIndex].bookName;
				},
			})
			
			this.useYear = new Date().getFullYear();
			
			let tpMonth = new Date().getMonth()+1
			this.choiceDate = new Date().getFullYear() + "-" + (tpMonth<10?'0'+tpMonth:tpMonth);
			this.year = this.choiceDate.split('-')[0];
			this.month = this.choiceDate.split('-')[1];
			this.overviewUpdate();
		},
		mounted(){
			
		},
		data() {
			return {
				userID:0,
				bookID:0,
				choiceDate: '',
				useYear: '',
				year: '',
				month: '',
				eachDayLineObj:{
					categories: [],
					series:[]
				},
				categoryPieObj: {
					series: [
						{
							data: []
						}
					]
				},
				overviewObj: {},
				dayTableArr:[],
				lineOption:{xAxis: {}},
				pieOption: {
					"name": "支出比例",
				},
				DataFlag: false,
				bookIDArr: [],
				bookIDArrIndex:0,
				bookName:'',
				yearChangeFlag:false
				
			}
		},
		onBackPress({from}) {
		    console.log(from);
		    if(from=='backbutton'){
		        this.$nextTick(function(){
		            uniShare.hide()
		        })
		        return uniShare.isShow;
		    }
		},
		methods: {
			showDrawer(e) {
				this.$refs.showDrawerRef.open()
			},
			dateChange(e) {
				this.choiceDate = e.detail.value;			
				this.year = this.choiceDate.split('-')[0];
				this.month = this.choiceDate.split('-')[1];
				
				//先请求overview的数据，没有的话图表就不显示了
				this.overviewUpdate();
			},
			overviewUpdate() {
				this.yearChangeFlag = false;
				let sendDataObj = {};
				if(this.month) {
					sendDataObj = {
						"bookID": this.bookID,
						"year": this.year,
						"month": this.month
					}
				}else {
					//年度报表  不传month
					sendDataObj = {
						"bookID": this.bookID,
						"year": this.year,
					}
				}
				uni.request({
				    url: this.$baseUrl + '/statisticsOverviewOutIn', 
					method: 'POST',
					data: sendDataObj,
				    success: (res) => {
						this.$set(this.overviewObj, 'out', (Math.abs(res.data[1][0].out?res.data[1][0].out:0)).toFixed(2));
						this.$set(this.overviewObj, 'in', (res.data[0][0].in?res.data[0][0].in:0).toFixed(2));
						this.$set(this.overviewObj, 'balance', (Number(this.overviewObj.in)-Number(this.overviewObj.out)).toFixed(2));						
						if(res.data[0][0].in || res.data[1][0].out) {
							this.DataFlag = true;
							this.lineUpdate();
							this.pieUpdate();
							this.tableUpdate();
							let dayNumb = Number(new Date(this.year,this.month,0).getDate())
							this.$set(this.overviewObj, 'eachDay', (this.overviewObj.out/dayNumb).toFixed(2));
						}else {
							//没有数据
							this.DataFlag = false;
							this.$set(this.overviewObj, 'eachDay', '/');
						}		
					},
				})
				
				
			},
			lineUpdate() {
				this.eachDayLineObj = {categories:[],series:[]}
				if(this.month) {
					//月度报表
					//可以获取 这一年这月一共有几天
					let dayNumb = new Date(this.year,this.month,0).getDate();
					this.lineOption.xAxis.itemCount = dayNumb;
					let useDateArr = [];
					let useOutArr = [];
					let useIneArr = [];
					uni.request({
					    url: this.$baseUrl + '/statisticsMonthLineOutIn', 
						method: 'POST',
						data: {
							"bookID": this.bookID,
							"year": this.year,
							"month": this.month
						},
					    success: (res) => {
							//返回的两个数组，第一个是支出、第二个：收入 都已经做了绝对值了
							let tpOutArr = res.data[0];
							let tpInArr = res.data[1];
							let outObj =  {};
							tpOutArr.forEach(function(item, index, array) {
								outObj[item.day] = item.total;
							})
							let inObj = {};
							tpInArr.forEach(function(item, index, array) {
								inObj[item.day] = item.total;
							})
							for(let i=1; i<dayNumb+1; i++) {
								useDateArr.push(i);
								if(outObj[i<10?'0'+i:i]) {
									useOutArr.push(outObj[i<10?'0'+i:i]);
								}else {
									useOutArr.push(0);
								}
								if(inObj[i<10?'0'+i:i]) {
									useIneArr.push(inObj[i<10?'0'+i:i]);
								}else {
									useIneArr.push(0);
								}
							}
							this.eachDayLineObj.categories = useDateArr;
							this.eachDayLineObj.series.push({"name":"支出", "data": useOutArr})
							this.eachDayLineObj.series.push({"name":"收入", "data": useIneArr})
						}
					});
				}else {
					//横坐标设成12个
					this.lineOption.xAxis.itemCount = 12;
					this.lineOption.xAxis.labelCount = 6;
					let tpMonthArr = new Array(12).fill(0);
					let useMonthArr = [];
					let useOutArr = [];
					let useIneArr = [];
					uni.request({
					    url: this.$baseUrl + '/statisticsYearLineOutIn', 
						method: 'POST',
						data: {
							"bookID": this.bookID,
							"year": this.year,
						},
					    success: (res) => {
							let tpOutArr = res.data[0];
							let tpInArr = res.data[1];
							let outObj =  {};
							tpOutArr.forEach(function(item, index, array) {
								outObj[item.month] = item.total;
							})
							let inObj = {};
							tpInArr.forEach(function(item, index, array) {
								inObj[item.month] = item.total;
							})
							for (var i = 1; i < tpMonthArr.length+1; i++) {
								tpMonthArr[i-1] = i>9?i:'0'+i;
								useMonthArr.push(i+'月');
								if(outObj[tpMonthArr[i-1]]) {
									useOutArr.push(outObj[tpMonthArr[i-1]])
								}else {
									useOutArr.push(0)
								}
								if(inObj[tpMonthArr[i-1]]) {
									useIneArr.push(inObj[tpMonthArr[i-1]])
								}else {
									useIneArr.push(0)
								}
							}
							this.eachDayLineObj.categories = useMonthArr;
							this.eachDayLineObj.series.push({"name":"支出", "data": useOutArr})
							this.eachDayLineObj.series.push({"name":"收入", "data": useIneArr})																												
						}
					});
				}
			},
			pieUpdate() {
				this.categoryPieObj.series[0].data = [];
				let sendDataObj = {};
				if(this.month) {
					sendDataObj = {
						"bookID": this.bookID,
						"year": this.year,
						"month": this.month
					}
				}else {
					//年度报表  不传month进来
					sendDataObj = {
						"bookID": this.bookID,
						"year": this.year,
					}
				}
				uni.request({
				    url: this.$baseUrl + '/statisticsPieOutIn', 
					method: 'POST',
					data: sendDataObj,
				    success: (res) => {
						if(res.data[0]) {
							this.categoryPieObj.series[0].data = res.data[0];			
						}
					},
				})
			},
			tableUpdate() {
				let sendDataObj = {}
				if(this.month) {
					sendDataObj= {
						"bookID": this.bookID,
						"year": this.year,
						"month": this.month
					};
				}else {
					sendDataObj= {
						"bookID": this.bookID,
						"year": this.year,
					};
				}
				uni.request({
				    url: this.$baseUrl + '/statisticsEachDayTable', 
					method: 'POST',
					data: sendDataObj,
				    success: (res) => {
						this.dayTableArr = res.data;
					},
				})
			},
			yearChange(e) {
				this.yearChangeFlag = true;
				this.useYear = e.detail.value;
			},
			bookChange(e) {
				this.bookIDArrIndex = e.detail.value;
				this.bookID = this.bookIDArr[this.bookIDArrIndex].bookID;
				this.bookName = this.bookIDArr[this.bookIDArrIndex].bookName;	
			},
			customSave() {
				if(this.yearChangeFlag) {
					this.choiceDate = this.useYear;
					this.year = this.choiceDate;
					this.month = '';
				}
				this.$refs.showDrawerRef.close();
				
				this.overviewUpdate();
			},
			showSharePoP() {
				let sendParameterStr = `bookID=${this.bookID}&userID=${this.userID}&year=${this.year}`
				if(this.month) {
					let monthNumb = Number(this.month)
					let monthStr = monthNumb<10?'0'+monthNumb:monthNumb
					sendParameterStr += `&month=${monthStr}`
				}
				uni.request({
				    url: this.$baseUrl + '/newShareAdd', 
					method: 'POST',
					data: {
						"parameterStr": sendParameterStr,
						"shareModel": 'statistics',
						"userID": this.userID,
						"bookID": this.bookID
					},
				    success: (res) => {
						// console.log(res.data)
						let sendObj = {
							type: 0,
							href: `http://49.234.49.11:81/#/?shareURL=${res.data.shareURL}&shareCode=${res.data.shareCode}`,
							title: `${res.data.userName}给您分享了ta的账本统计图`,
							summary: `${res.data.userName}给您分享了<${res.data.bookName}>账本的账单统计图，分享码为：${res.data.shareCode}`,
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
	.top-btn_first_item {
		margin-right: 10px;
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
		padding: 60px 30px;
	}
	.detail-container {
		/* position: absolute; */
		text-align: center;
		padding: 10px 0px;
		background-color: white;
		border-radius: 10px;
	}
	.detail_container_title {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 10px;
	}
	.outIn_overview_line {
		display: flex;
	}
	.outIn_overview_line_left,
	.outIn_overview_line_right {
		flex: 1;
	}
	#outIn_overview_detail-container .outIn_overview_line:nth-child(2) {
		margin-bottom: 10px;
	}
	.outIn_overview_line_title {
		font-size: 14px;
		font-weight: normal;
		color: grey;
	}
	.outIn_overview_line_value {
		font-size: 18px;
		font-weight: 600;
	}
	.detail_container_uchart_area {
		height: 240px;
	}
	#nodata_container {
		margin: 0px 10px;
		padding-top: 80px;
		text-align: center;
	}
	.nodata_ico {
		font-size: 100px;
		color: #cacaca;
	}
	.nodata_txt {
		margin-top: 20px;
		color: #cacaca;
		font-size: 20px;
	}
	.choiceYear_show {
		display: inline-block;
		margin: 10px;
		padding: 5px;
		border: 1px #3a93fb solid;
		border-radius: 10px;
	}


</style>
