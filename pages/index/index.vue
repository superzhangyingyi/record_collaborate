<template>
	<view class="container">
		<view class="top-container">
			<view @click="turnToBillPage()" class="top-item top-btn">x</view>
			<view class="top-item nav_container">
				<view :class="{'nav_item':true, 'current_nav':navFlag}" @click="navChange"><text>支出</text></view>
				<view :class="{'nav_item':true, 'current_nav':!navFlag}" @click="navChange"><text>收入</text></view>
			</view>
			<view @click="addCategory()" class="top-item top-btn icon iconfont" id="add_btn">&#xe62a;</view>
		</view>
		<view class="category_container">
			<view class="category_item" v-for="(item, i) in categoryInitArr" @click="categoryOneChoice(i, item.cno1)" :key="i">
				<view class="category_ico icon iconfont" v-html="item.c1IcoUnicode"  :style="categoryOneFlag[i] ? 'color:blue;' : 'color:grey;'"></view>
				<text class="category_txt"  :style="categoryOneFlag[i] ? 'color:blue;' : 'color:grey;'">{{item.c1Name}}</text>
				<view :class="'category_son_container left' + i%4" :style="categoryOneFlag[i] ? '' : 'display:none;'">
					<view class="category_son_item" v-for="(itemm, ii) in item.c2Arr" @click.stop="categoryTwoChoice(i, ii, itemm.cno2)" :key="ii">
						<view class="category_ico icon iconfont" v-html="itemm.c2IcoUnicode" :style="categoryTwoFlag[ii] ? 'color:blue;' : 'color:grey;'"></view>
						<text class="category_txt" :style="categoryTwoFlag[ii] ? 'color:blue;' : 'color:grey;'">{{itemm.c2Name}}</text>
					</view>
				</view>
			</view>
			
		</view>
		<view class="input_container">
			<view class="input_top_container">
				<input type="text" v-model="billName" id="name_input" placeholder="点击输入备注...">
				<view class="price_txt">{{billPrice}}</view>
			</view>
			<view class="input_middle_container">
				<!-- <uni-datetime-picker v-model="billDate" type="date">
					<text id="billDate_show">{{billDate}}</text>
				</uni-datetime-picker> -->
				<picker mode="date" :value="billDate" @change="dateChange($event)">
					<view class="billDate_show">{{billDate}}</view>
				</picker>
				<view id="picker_show">
					<picker :value="bookIDArrIndex" @change="bookChange($event)" :range="bookIDArr" range-key="bookName">
						<text class="uni-input">账本：{{bookName}}</text>
					</picker>
				</view>
			</view>
			<view class="input_bottom_container">
				<span @tap="numInput(1)" class="numb_btn">1</span>
				<span @tap="numInput(2)" class="numb_btn">2</span>
				<span @tap="numInput(3)" class="numb_btn">3</span>
				<span class="numb_btn" @tap="backClick()">
					<span class="icon iconfont" id="back_btn">&#xe715;</span>
				</span>
				<span @tap="numInput(4)" class="numb_btn">4</span>
				<span @tap="numInput(5)" class="numb_btn">5</span>
				<span @tap="numInput(6)" class="numb_btn">6</span>
				<span @tap="numInput('-')" class="numb_btn">-</span>
				<span @tap="numInput(7)" class="numb_btn">7</span>
				<span @tap="numInput(8)" class="numb_btn">8</span>
				<span @tap="numInput(9)" class="numb_btn">9</span>
				<span @tap="numInput('+')" class="numb_btn">+</span>
				<span @tap="operationBill()" class="numb_btn" id="operation_btn">运算</span>
				<span @tap="numInput(0)" class="numb_btn">0</span>
				<span @tap="decimalInput()" class="numb_btn">.</span>
				<span @tap="saveBill()" class="numb_btn" id="save_btn">保存</span>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.billDate = new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ").split(' ')[0]
			uni.request({
			    url: this.$baseUrl + '/bookIDInit',
				method: 'POST',
				data: {
					userID: this.userID
				},
			    success: (res) => {
					// console.log(res.data)
					let that = this;
					this.bookIDArr = res.data;
					if('bookid' in options) {
						//有bookid就用传过来的bookid
						this.bookID = options.bookid;
						let that = this;
						this.bookIDArr.forEach(function (item, index, array) {
							if(item.bookID == options.bookid) {
								that.bookName = item.bookName;
								that.bookIDArrIndex = index;
							}
						})
					}else{
						this.bookName = this.bookIDArr[this.bookIDArrIndex].bookName;
						this.bookID = this.bookIDArr[this.bookIDArrIndex].bookID;
					}
					if('bid' in options) {
						//修改模式
						this.bid = options.bid;
						this.changeModel = 1;
					}
					if(that.changeModel == 1) {
						//选定分类
						uni.request({
						    url: this.$baseUrl + '/findWithBid',
							method: 'POST',
							data: {
								bid: that.bid
							},
						    success: (res) => {
								let useDetailObj = res.data[0];
								that.goodDetailObj = useDetailObj;
								that.billPrice = Math.abs(useDetailObj.price);
								that.billName = useDetailObj.billName;
								that.billDate = useDetailObj.recordDate.split('T')[0];
								that.currentCno1 = useDetailObj.cno1;
								that.currentCno2 = useDetailObj.cno2;
								if(useDetailObj.outOrIn == 0) {
									that.navFlag = false;
								}else {
									that.navFlag = true;
								}
								that.navChange();
							}
						});
					}else {
						this.refreshcategory();
					}
				}
			});
		},
		data() {
			return {
				userID: 0,
				bookID: 0,
				navFlag:true,
				categoryTwoFlag:[],
				categoryOneFlag:[],
				lastC1Choice:999,
				bookIDArr: [],
				bookIDArrIndex:0,
				bookName:'',
				categoryInitArr:[],
				currentCno1: 0,
				currentCno2: 0,
				billName: '',
				billDate:'',
				
				billPrice: 0,
				lastIsNumb:true,
				decimalFlag: true,
				numbPart: '0',
				
				warmMsgTxt:'',
				
				changeModel:0,	//修改模式Flag
				bid:0,
				goodDetailObj: {}
			}
		},
		onShow(){  
			this.refreshcategory();
		},
		methods: {
			navChange() {
				//navFlag:true是支出模式
				this.navFlag = !this.navFlag;
				let that = this;
				this.refreshcategory(function() {
					if(that.changeModel == 1) {
						let e,ee;
						for(let i=0; i<that.categoryInitArr.length; i++) {
							if(that.categoryInitArr[i].cno1 == that.goodDetailObj.cno1) {
								e = i;
								let tpArr = that.categoryInitArr[i].c2Arr;
								that.categoryTwoFlag = new Array(tpArr.length).fill(false);
								for(let ii=0; ii<tpArr.length; ii++) {
									if(that.goodDetailObj.cno2 == tpArr[ii].cno2){
										ee = ii;
										break;
									}
								}
								break;
							}
						}
						// console.log(e, ee);
						that.categoryOneFlag[0] = false;
						that.categoryOneFlag[e] = true;
						that.lastC1Choice = e;
						that.categoryTwoFlag[ee] = true;
					}
				});
			},
			categoryOneChoice(e, c1) {
				this.currentCno1 = c1;
				this.currentCno2 = 0;
				this.categoryOneFlag = new Array(this.categoryInitArr.length).fill(false);
				if(this.lastC1Choice !== e) {
					this.categoryOneFlag[e] = true;
					this.categoryTwoFlag = [];
					this.lastC1Choice = e;
				}else {
					this.lastC1Choice = 999;
				}
				// console.log(this.currentCno1, this.currentCno2)
			},
			categoryTwoChoice(i, ii, c2) {
				this.currentCno2 = c2
				this.categoryTwoFlag = new Array(this.categoryInitArr[i].c2Arr.length).fill(false);
				this.categoryTwoFlag[ii] = true;
				// console.log(this.currentCno1, this.currentCno2)
			},
			refreshcategory(fn=function(){}) {
				//仍然可以使用refreshcategory()
				uni.request({
				    url: this.$baseUrl + '/categoryInit', //获取分类
					method: 'POST',
					data: {
						bookID: this.bookID,
						outOrIn: Number(!this.navFlag)
					},
				    success: (res) => {
						this.categoryInitArr = res.data;
						let tpArr = new Array(this.categoryInitArr.length).fill(false);
						tpArr[0] = true;
						this.categoryOneFlag = tpArr;
						fn();
						
					}
				});
			},
			numInput(e){
				const decimalReg = /^\d+(.\d{1,2})?$/; //判断小数点后2位的
				if(this.billPrice === 0) {
					if(typeof(e) === 'number') {
						this.billPrice = e;
					}
				}else {
					if(typeof(e) === 'string') {
						if(this.lastIsNumb) {
							this.billPrice = this.billPrice + e;
							this.numbPart = '';
							this.lastIsNumb = false;
							this.decimalFlag = true;
						}
						
					}else {
						let mayCan = this.numbPart + e.toString();
						if(decimalReg.test(mayCan)) {
							this.numbPart = this.numbPart + e.toString();
							this.billPrice += e.toString();
							this.lastIsNumb = true;
						}
					}
				}
			},
			decimalInput() {
				if(this.lastIsNumb && this.decimalFlag) {
					this.numbPart += '.';
					this.billPrice += '.';
					this.decimalFlag = false;
				} 
			},
			backClick() {
				this.billPrice = this.billPrice.toString().slice(0, -1)
				//删除完后的最后一个字符
				let lastStr = this.billPrice.substr(-1);
				if(lastStr === '+'||lastStr === '-') {
					this.lastIsNumb = false;
					this.decimalFlag = false;
					this.numbPart = '';
				}else {
					let tpArr = this.billPrice.split(/[+-]/);
					this.numbPart = tpArr[tpArr.length-1];
					if(lastStr === '.') {
						this.lastIsNumb = false;
						this.decimalFlag = false;
					}else {
						this.lastIsNumb = true;
						if(this.numbPart.split('.').length === 1) {
							//this.numbPart没有.
							this.decimalFlag = true;
						}else{
							this.decimalFlag = false;
						}
						
					}
				}
			},
			operationBill() {
				this.billPrice = eval(this.billPrice).toString();
			},
			saveBill() {
				if(this.billPrice != 0) {
					this.billPrice = eval(this.billPrice).toString();
					if(this.billName) {
						this.billName = this.billName.trim();
					}
					
					let tpC2 = this.currentCno2;
					if(tpC2 == 0) {
						tpC2 = 'NULL'
					}
					let tpData = {
						bookID : this.bookID,
						outOrIn : Number(!this.navFlag),
						editUserId : this.userID,
						cno1 : this.currentCno1,
						cno2 : tpC2,
						price : this.billPrice,
						recordDate : this.billDate
					};
					if(this.billName && this.billName.length !== 0) {
						tpData.billName = this.billName
					}
					let useUrl = ``
					if(this.changeModel == 1) {
						useUrl = this.$baseUrl + '/billDateUpdate';
						tpData.bid = this.bid;
					}else {
						useUrl = this.$baseUrl + `/billDateSave`					
					}
					uni.request({
					    url: useUrl,
						method: 'POST',
						data: tpData,
					    success: (res) => {
							if(res.data == 'ok') {
								this.turnToBillPage();
							}
						}
					});
				}
				
			},
			bookChange(e) {
				this.bookIDArrIndex = e.detail.value;
				this.bookID = this.bookIDArr[this.bookIDArrIndex].bookID;
				this.bookName = this.bookIDArr[this.bookIDArrIndex].bookName;				
				this.refreshcategory();
				// console.log(this.bookID)				
			},
			dateChange(e) {
				this.billDate = e.detail.value;
			},
			turnToBillPage() {
				uni.redirectTo({url: `billDetailPage?id=${this.userID}&bookid=${this.bookID}`});
			},
			addCategory() {
				uni.navigateTo({url: `addCategory?id=${this.userID}&bookid=${this.bookID}&navFlag=${this.navFlag}`});
			}
			
		}
	}
</script>

<style scoped>
	.blue {
		color: blue;
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
	.nav_item {
		display: inline-block;
	}
	.top-btn {
		width: 20%;
		color: white;
		font-size: 30px;
	}
	.nav_container {
		width: 60%;
	}
	.nav_item {
		width: 50%;
		font-size: 22px;
		color: white;
		opacity: 50%;
	}
	.nav_item text {
		display: inline-block;
		line-height: 48px;
	}
	.current_nav {
		opacity: 100%;
	}
	.current_nav text{
		border-bottom: 5px solid white;
	}
	.category_container {
		width: 100%;
		height: 310px;
		background-color: white;
		overflow: auto;
		padding-bottom: 10px;
	}
	.category_item {
		width: 25%;
		text-align: center;
		margin-top: 10px;
		/* position: relative; */
	}
	.category_ico {
		width: 100%;
		height: 30px;
		font-size: 22px;
		line-height: 30px;
		color: grey;
	}
	.category_txt {
		display: inline-block;
		height: 10px;
		line-height: 10px;
	}
	.category_son_container {
		width: 400%;
		background-color: rgb(245, 246, 248);
		position: relative;
		text-align: left;
		max-height: 200px;
		overflow: auto;
	}
	.left0{
		left: 0;
	}
	.left1{
		left: -100%;
	}
	.left2{
		left: -200%;
	}
	.left3{
		left: -300%;
	}
	.category_son_item {
		width: 25%;
		display: inline-block;
		text-align: center;
		margin-top: 10px;
	}
	.category_container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-content: flex-start;
	}
	.input_container {
		width: 100%;
		height: 300px;
		background-color: rgb(245, 246, 248);
	}
	.input_top_container {
		display: flex;
		height: 30px;
		line-height: 30px;
		padding: 10px;
		font-size: 24px;
				
	}
	#name_input {
		height: 100%;
		display: inline-block;
		flex: 4;
		/* background-color: pink; */

	}
	.price_txt {
		display: inline-block;
		color: red;
	}
	.input_middle_container {
		position: relative;
		margin-top: 10px;
		padding: 0px 10px;
	}
	#billDate_show{
		display: inline-block;
		font-size: 14px;
		padding: 5px;
		border-radius: 20px;
		background-color: white;
	}
	#picker_show {
		font-size: 14px;
		padding: 5px 10px;
		border-radius: 20px;
		background-color: white;
		position: absolute;
		right: 20px;
		top: 0px;
	}
	.input_bottom_container {
		margin-top: 10px;
		width: 100%;
		/* background-color: wheat; */
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
	}
	.numb_btn {
		width: 21%;
		margin: 6px;
		background-color: white;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 18px;
		border-radius: 10px;
		font-weight: 700;
	}
	#save_btn {
		background-color: darkred;
		color: white;
		font-weight: 400;
	}
	#back_btn {
		font-size: 26px;
		color: black;
		font-weight: 400;
	}
	#operation_btn {
		font-weight: 400;
	}
</style>
