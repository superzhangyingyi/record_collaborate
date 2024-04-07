<template>
	<view class="container">
		<view class="top-container">
			<view @click="turnToAddCategory()" class="top-item top-btn">x</view>
			<view class="top-item title_container">
				{{title}}
			</view>
			<view @click="saveCategory()" class="top-item top-btn" id="add_btn">保存</view>
		</view>
		<view class="input_container" v-if="(model==1||model==2)?true:false">
			<uni-section class="input_container_item" titleColor="#878e92" titleFontSize="18px" title="填写信息" type="line"></uni-section>
			<view class="input_container_item category_one_container">
				<view class="left_label">名称分类</view>
				<input class="category_name" v-model="newCategoryName" type="text">
				<view class="category_ico icon iconfont" v-html="newIcoUnicode"></view>
			</view>
		</view>
		<view class="input_container" v-if="model==3?true:false">
			<uni-section class="input_container_item" titleColor="#878e92" titleFontSize="20px" title="填写信息" type="line"></uni-section>
			<view class="input_container_item category_one_container">
				<view class="left_label">分类名称</view>
				<input class="category_name" v-model="newCategoryName" type="text" placeholder="请输入一级分类名">
				<view class="category_ico icon iconfont" v-html="newIcoUnicode"></view>
			</view>
		</view>
		<view class="input_container" v-if="model==4?true:false">
			<uni-section class="input_container_item" titleColor="#878e92" titleFontSize="20px" title="填写信息" type="line"></uni-section>
			<view class="input_container_item category_one_container">
				<view class="left_label">一级分类</view>
				<input disabled class="category_name" v-model="c1Name" type="text">
				<view class="category_ico icon iconfont" v-html="icoUnicode"></view>
			</view>
			<view class="input_container_item category_one_container">
				<view class="left_label">二级分类</view>
				<input class="category_name" v-model="newCategoryName" type="text" placeholder="请输入二级分类名">
				<view class="category_ico icon iconfont" v-html="newIcoUnicode"></view>
			</view>
		</view>
		<uni-section class="defCategory_container" type="line" titleColor="#878e92" titleFontSize="18px" title="分类图标" sub-title="图标可以从下面列表中选择">
			<uni-group v-for="(item ,i) in defCategoryArr" :key="i" :title="item.c1Name" class="defCategory_group" mode="card">
				<uni-grid :column="5" :showBorder="false" :square="false">
					<uni-grid-item v-for="(itemm ,ii) in item.c2Arr" :key="ii">
						<view class="defCategory_item" @tap="choiceIco(itemm.c2IcoUnicode, itemm.c2Name)">
							<view class="defCategory_ico icon iconfont" v-html="itemm.c2IcoUnicode"></view>
							<text class="defCategory_txt">{{itemm.c2Name}}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-group>
		</uni-section>


	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.userID = options.id;
			this.bookID = options.bookid;
			this.outOrIn = options.outOrIn;
			//options.data	model:1修改一级分类，model:2修改二级分类	model:3新建一级分类	model:4新建2级分类
			const paramObj = JSON.parse(options.data);
			this.model = paramObj.model;
			let that = this
			switch(this.model) {
			    case 1:
					this.title = '修改一级分类';
					this.currentC1 = paramObj.c1;
					this.getCategoryIco(paramObj.c1, 1, function(data) {
						that.newIcoUnicode = data[0].c1IcoUnicode;
						that.newCategoryName = data[0].c1Name;
					})
					break;
			    case 2:
					this.title = '修改二级分类';
					this.currentC2 = paramObj.c2;
					this.getCategoryIco(paramObj.c2, 2, function(data) {
						that.newIcoUnicode = data[0].c2IcoUnicode;
						that.newCategoryName = data[0].c2Name;
					})
					break;
				case 3:
					this.title = '新建一级分类';
					break;
				case 4:
					this.title = '新建二级分类';
					this.currentC1 = paramObj.c1;
					this.c1Name = paramObj.c1Name;
					this.getCategoryIco(paramObj.c1, 1, function(data) {
						that.icoUnicode = data[0].c1IcoUnicode;	
					})
					break;
			};
			uni.request({
			    url: this.$baseUrl + '/defCategoryInit', //获取分类
			    success: (res) => {
					this.defCategoryArr = res.data;
					// console.log(this.defCategoryArr)
				}
			});
		},
		data() {
			return {
				userID:0,
				bookID:0,
				outOrIn: '',
				model:0,
				title:'',
				icoUnicode:'',
				c1Name:'',
				newCategoryName: '',
				newIcoUnicode:'',
				defCategoryArr:[],
				currentC1:'',
				currentC2:''
			}
		},
		methods: {
			getCategoryIco(numb, model, fn) {
				//model:1获取一级分类ico， model:2获取二级
				uni.request({
				    url: this.$baseUrl + '/getCategoryIco',
					method: 'POST',
					data: {
						"numb": numb,
						"model": model
					},
				    success: (res) => {
						fn(res.data);
					}
				});
				
			},
			turnToAddCategory() {
				uni.redirectTo({url: `addCategory?navFlag=${this.outOrIn==0?true:false}&id=${this.userID}&bookid=${this.bookID}`});
			},
			choiceIco(ico, name) {
				if(this.newCategoryName == '') {
					this.newCategoryName = name;
				}
				this.newIcoUnicode = ico;
			},
			saveCategory() {
				switch(this.model) {
				    case 1:
						this.addOrUpdate({
							"cno1":this.currentC1,
							"cName":this.newCategoryName,
							"IcoUnicode":this.newIcoUnicode
						}, 'update');
						break;
				    case 2:
						this.addOrUpdate({
							"cno2":this.currentC2,
							"cName":this.newCategoryName,
							"IcoUnicode":this.newIcoUnicode
						}, 'update');
						break;
					case 3:
						this.addOrUpdate({
							"cName": this.newCategoryName,
							"IcoUnicode": this.newIcoUnicode,
							"bookID": this.bookID,
							"outOrIn": this.outOrIn
						}, 'add');
						break;
					case 4:
						this.addOrUpdate({
							"cName": this.newCategoryName,
							"IcoUnicode": this.newIcoUnicode,
							"cno1": this.currentC1
						}, 'add');
						break;
				};
			},
			addOrUpdate(dataObj, modelName) {
				uni.request({
				    url: this.$baseUrl + `/${modelName}Category`,
					method: 'POST',
					data: dataObj,
				    success: (res) => {
						// console.log(res.data);
						uni.redirectTo({url: `addCategory?navFlag=${this.outOrIn==0?true:false}&id=${this.userID}&bookid=${this.bookID}`});
						
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
	.input_container,
	.defCategory_container{
		background-color: white;
		border-radius: 20px;
		overflow: auto;
		margin: 20px;
		padding: 0px 20px;
	}
	.category_one_container *{
		display: inline-block;
	}
	.input_container_item {
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		padding: 10px 0px;
		display: flex;
		position: relative;
	}
	.input_container .input_container_item:first-child {
		padding: 0px 2px;
		border-bottom: 1px #f2f2f2 solid;
	}
	.category_name {
		flex: 1;
		text-align: right;
		padding-right: 20px;
		color: #69a7d9;
		height: inherit;
		line-height: inherit;
		font-size: inherit;
	}
	.left_label {
		width: 70px;
	}
	.category_ico {
		width: 40px;
		background-color: #f5f5f5;
		line-height: 40px;
		text-align: center;
		font-size: 30px;
		border-radius: 50%;
	}
	.defCategory_container {
		height: 420px;
		padding: 0px;
	}
	.defCategory_item {
		height: 50px;
		width: 50px;
		margin-bottom: 4px;
		/* background-color: #69a7d9; */
		text-align: center;
		margin-bottom: 6px;
	}
	.defCategory_ico {
		height: 36px;
		line-height: 36px;
		color: rgb(135, 142, 146);
		font-size: 28px;
	}
	.defCategory_txt {
		height: 14px;
		line-height: 14px;
		font-size: 10px;
	}
</style>
