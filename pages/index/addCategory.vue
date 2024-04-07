<template>
	<view class="container">
		<view class="top-container">
			<view @click="turnBack()" class="top-item top-btn">x</view>
			<view class="top-item nav_container">
				<view :class="{'nav_item':true, 'current_nav':navFlag}" @click="navChange"><text>支出</text></view>
				<view :class="{'nav_item':true, 'current_nav':!navFlag}" @click="navChange"><text>收入</text></view>
			</view>
			<view @click="addCategory('no', '')" class="top-item top-btn icon iconfont" id="add_btn">&#xe62a;</view>
		</view>
		
		<view class="category_container">
			<uni-collapse accordion >
				<uni-collapse-item title-border="none" :border="false" :show-arrow="false">
					<template v-slot:title>
						<view class="category_item">
							<view class="category_ico icon iconfont">&#xe690;</view>
							<text class="category_txt">其他</text>
						</view>
					</template>
				</uni-collapse-item>
				<uni-collapse-item title-border="none" :border="false" v-for="(item, i) in categoryInitArr" :key="i" :show-arrow="false">
					<template v-slot:title>
						<view class="category_item">
							<view class="category_ico icon iconfont" v-html="item.c1IcoUnicode"></view>
							<text class="category_txt">{{item.c1Name}}</text>
							<span @tap.stop="operationC1(item.cno1)" class="category_ico_operation icon iconfont">&#xe696;</span>
						</view>
					</template>
					<view class="content category_son_container">
						<view @tap.stop="operationC2(itemm.cno2)" class="category_son_item" v-for="(itemm, ii) in item.c2Arr" :key="ii">
							<view class="category_son_ico icon iconfont" v-html="itemm.c2IcoUnicode"></view>
							<text class="category_son_txt">{{itemm.c2Name}}</text>
						</view>
						<view class="category_son_item">
							<view class="category_son_ico icon iconfont">&#xe62a;</view>
							<text @click="addCategory(item.cno1, item.c1Name)" class="category_son_txt">添加其他</text>
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>

	</view>
</template>


<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
			this.navFlag = options.navFlag.toLowerCase() == 'true'?true:false;
			this.refreshcategory()
		},
		data() {
			return {
				userID: 0,
				bookID: 0,
				navFlag:true,
				categoryInitArr:[],
				currentCno1: 0,
				currentCno2: 0,
				
			}
		},
		methods: {
			turnBack() {
				// uni.redirectTo({url: `index?id=${this.userID}&bookid=${this.bookID}`});
				uni.navigateBack({delta: 1});
			},
			navChange() {
				//navFlag:true是支出模式
				this.navFlag = !this.navFlag;
				this.refreshcategory();
			},
			refreshcategory() {
				uni.request({
				    url: this.$baseUrl + '/categoryInit', //获取分类
					method: 'POST',
					data: {
						bookID: this.bookID,
						outOrIn: Number(!this.navFlag)
					},
				    success: (res) => {
						//删除其他，因为其他不可修改
						res.data.shift()
						this.categoryInitArr = res.data;
					}
				});
			},
			operationC1(c1) {
				// console.log(c1)
				let that = this
				uni.showActionSheet({
					itemList: ['修改', '删除'],
					success: function (res) {
						if(res.tapIndex == 0) {
							//修改
							let data = {"c1":c1, "model":1}
							uni.redirectTo({url: `defCategory?id=${that.userID}&bookid=${that.bookID}&data=${JSON.stringify(data)}&outOrIn=${Number(!this.navFlag)}`});
						}else {
							//删除
							that.delCategory(c1, 1)
						}
					}
				});
			},
			operationC2(c2) {
				// console.log(c2)
				let that = this
				uni.showActionSheet({
					itemList: ['修改', '删除'],
					success: function (res) {
						if(res.tapIndex == 0) {
							//修改
							let data = {"c2":c2, "model":2}
							uni.redirectTo({url: `defCategory?id=${that.userID}&bookid=${that.bookID}&data=${JSON.stringify(data)}&outOrIn=${Number(!this.navFlag)}`});
						}else {
							//删除
							that.delCategory(c2, 2)
						}
					}
				});
			},
			delCategory(numb, model) {
				//model:1获取一级分类ico， model:2获取二级
				uni.request({
				    url: this.$baseUrl + '/delCategory', //获取分类
					method: 'POST',
					data: {
						"numb": numb,
						"model": model
					},
				    success: (res) => {
						if(res.data == 'ok') {
							this.refreshcategory()
						}else {
							uni.showToast({title: '删除失败',icon: 'none'})
						}
					}
				});
				
			},
			addCategory(cno1, c1Name) {
				let that = this;
				if(cno1 === 'no') {
					//添加一级分类
					let data = {"model":3}
					uni.redirectTo({url: `defCategory?id=${that.userID}&bookid=${that.bookID}&data=${JSON.stringify(data)}&outOrIn=${Number(!this.navFlag)}`});
				}else {
					//添加二级分类
					let data = {"c1":cno1,"c1Name":c1Name, "model":4}
					uni.redirectTo({url: `defCategory?id=${that.userID}&bookid=${that.bookID}&data=${JSON.stringify(data)}&outOrIn=${Number(!this.navFlag)}`});
				}
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
		background-color: white;
		overflow: auto;
		padding-bottom: 10px;
/* 		margin: 10px 0px; */
	}
	.category_item {
		/* width: 100%; */
		margin: 10px 30px 0px;
		position: relative;
	}
	.category_ico {
		display: inline-block;
		width: 50px;
		height: 50px;
		font-size: 34px;
		line-height: 50px;
		color: grey;
	}
	.category_ico_operation {
		height: 50px;
		line-height: 50px;
		font-size: 22px;
		vertical-align: top;
		position: absolute;
		right: 2px;
	}
	.category_txt {
		display: inline-block;
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		vertical-align: bottom;
	}
	.category_son_container {
		padding: 10px 0px;
		margin: 0px 10px;
		background-color: rgb(245, 245, 245);
		position: relative;
		text-align: left;

	}
	.category_son_item {
		width: 25%;
		display: inline-block;
		text-align: center;
		margin-top: 10px;
	}
	.category_son_ico {
		width: 100%;
		height: 30px;
		font-size: 22px;
		line-height: 30px;
		color: grey;
	}
	.category_son_txt {
		display: inline-block;
		height: 10px;
		line-height: 10px;
	}

	
</style>
