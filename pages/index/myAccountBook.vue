<template>
	<view class="container">
		<view class="top-container">
			<navigator :url="'billDetailPage?id='+userID+'&bookid='+bookID" open-type="redirect" class="top-item top-btn">
				<uni-icons color="white" type="arrow-left" size="26"></uni-icons>
			</navigator>
			<view class="top-item title_container">我的账本</view>
			<view @tap="addAccountBook" class="top-item top-btn" id="add_btn">
				<uni-icons color="white" type="plusempty" size="26"></uni-icons>
			</view>
		</view>	
		
		<view class="detail_container">
			<navigator class="item_container" v-for="(item, i) in accountBookArr" :url="'billDetailPage?id='+userID+'&bookid='+item.bookID" open-type="redirect" :key="i">
				<span class="item_left_container">
					<span class="book_ico iconfont">&#xe675;</span>
					<uni-icons v-if="bookID==item.bookID" class="current_book" type="checkbox" size="40"></uni-icons>				
				</span>
				<span class="item_right_container">
					<p class="item_each_line">
						<span class="accountBook_name">{{item.bookName}}</span>
						<span v-if="!item.isWrite" class="accountBook_isReadOnly">(只读)</span>
						<span class="accountBook_isShare">{{item.isShare?'共享':'不共享'}}</span>
					</p>
					<p class="item_each_line">
						<span class="accountBook_creatTime">{{item.createTime}}日创建</span>
						<span @click.stop="turnToBookConfig(item.bookID)" class="accountBook_option">...</span>
					</p>
				</span>
			</navigator>			
		</view>
		
		
		<uni-popup ref="POPnewAccountBook" type="center">
			<view class="popup_container">
				<span class="popup_title">创建新账本</span>
				<view class="input_line marginBottom">
					<label class="input_label">账本名称:</label>
					<uni-easyinput v-model="newAccountBookName" class="name_input" trim="all" placeholder="请输入.."></uni-easyinput>
				</view>
				<view class="input_line">
					<label class="input_label">是否开启共享:</label>
					<span id="pop_share_switch">
						<switch @change="switchChange" v-model="shareSwitchValue" color="#FFCC33" style="transform:scale(0.9)"/>
					</span>
				</view>
				<span class="warm_txt">{{warmTxt}}</span>
				<view class="popup_bottom_container">
					<span @tap="closePOP" class="popup_bottom_btn">取消</span>
					<span @tap="submitNewAccountBook" class="popup_bottom_btn">确定</span>
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
			this.accountBookInit();
		},
		data() {
			return {
				userID:0,
				bookID:0,
				accountBookArr:[],
				newAccountBookName:'',
				shareSwitchValue:0,
				warmTxt: ''
			}
		},
		methods: {
			turnToBookConfig(bookid) {
				uni.redirectTo({url: `myAccountBookConfig?id=${this.userID}&bookid=${bookid}`});
			},
			accountBookInit() {
				uni.request({
				    url: this.$baseUrl + '/getAllAccountBook', 
					method: 'POST',
					data: {
						"userID": this.userID
					},
				    success: (res) => {
						this.accountBookArr = res.data;
					}
				});
			},
			addAccountBook() {
				this.$refs.POPnewAccountBook.open();
			},
			submitNewAccountBook() {
				if(this.newAccountBookName) {
					uni.request({
					    url: this.$baseUrl + '/addAccountBook', 
						method: 'POST',
						data: {
							"userID": this.userID,
							"isShare": this.shareSwitchValue,
							"bookName": this.newAccountBookName
						},
					    success: (res) => {
							this.$refs.POPnewAccountBook.close();
							this.accountBookInit();
						}
					});
				}else {
					this.warmTxt = '账本名称不能为空'
				}
			},
			switchChange(e) {
				this.shareSwitchValue = Number(e.detail.value)
			},
			closePOP() {
				this.$refs.POPnewAccountBook.close();
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
	.detail_container{
		/* background-color: white; */
		overflow: auto;
		margin: 20px;
		padding: 6px;
	}
	.item_container {
		width: 100%;
		box-sizing: border-box;
		border-radius: 5px;
		border: 1px #f9f9f9 solid;
		background-color: white;
		display: flex;
		height: 80px;
	}
	.accountBook_name {
		color: black;
		font-size: 18px
	}
	.accountBook_isReadOnly {
		color: red;
	}
	.accountBook_isShare,
	.accountBook_option {
		position: absolute;
		right: 10px;
	}
	.accountBook_option {
		font-size: 20px;
		font-weight: 600;
		color: black;
	}
	.item_each_line {
		position: relative;
		margin-bottom: 5px;
	}
	.book_ico {
		font-size: 60px;
		line-height: 60px;
	}
	.item_left_container {
		display: inline-block;
		padding: 10px 5px;
		position: relative;
	}
	.current_book {
		position: absolute;
		z-index: 2;
		font-weight: 600;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
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
	.popup_title {
		font-size: 18px;
		color: #a2a2a2;
	}
	.name_input {
		display: inline-block;
		width: 70%;
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
	.input_line {
		width: 100%;
		text-align: left;
		font-size: 14px;
		position: relative;
	}
	.marginBottom {
		margin-bottom: 30px;
	}
	.warm_txt {
		color: red;
	}
	.input_label {
		display: inline-block;
		margin-right: 15px;
	}
	#pop_share_switch {
		position: absolute;
		right: 5px;
		top: -8px;
	}
	
	.item_right_container{
		display: inline-block;
		padding: 16px 5px;
		color: #a2a2a2;
		flex: 1;
		font-size: 12px
	}
	.item_container:not(:last-child) {
		margin-bottom: 20px;
	}
	.item_container:nth-child(4n) {
		color: #FF7F00;
	}
	.item_container:nth-child(4n+1) {
		color: #00d000;
	}
	.item_container:nth-child(4n+2) {
		color: #316fff;
	}
	.item_container:nth-child(4n+3) {
		color: #FF0000 ;
	}
</style>
