<script>
	export default {
		onLaunch() {

		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/static/fonts/iconfont.css';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	* {
		padding: 0px;
		margin: 0px;
	}

	.detail-container {
		margin: 10px;
	}
	.detail-item-container {
		margin-top: 10px;
		padding: 10px 20px 5px;
		background-color: white;
		border-radius: 10px;
	}
	.item-top-container {
		font-weight: 600;
	}
	.item-top-container>*{
		display: inline-block;
		width: 50%;
		font-size: 14px;
	}
	.top-sum {
		text-align: right;
	}
	.item-detail-container,
	.item-detail-container-green
	{
		padding: 10px 25px;
		/* background-color: pink; */
		position: relative;
		font-size: 14px;
	}
	.item-detail-container::before,
	.item-detail-container-green::before,
	{
		content: '';
		position: absolute;
		left: 2px;
		top: 46%;
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		margin-right: 12px;
	}
	.item-detail-container::before {
		border: 1px solid #f1545c;
		background-color: #f1545c;
	}
	.item-detail-container-green::before {
		border: 1px solid limegreen;
		background-color: limegreen;
	}
	.detail-price,
	.detail-price-green
	{
		position: absolute;
		transform: translateY(-50%);
		right: 4px;
		top: 50%;
		font-size: 20px;
		font-weight: 500;
	}
	.detail-price {
		color: #f1545c;
	}
	.detail-price-green {
		color: limegreen;
	}
	.detail-category {
		font-size: 17px;
	}
	.detail-name {
		font-size: 13px;
		color: #a2a2a2;
	}
	
	.popup-content {
		padding: 10px;
		font-size: 16px;
	}
	.popup-top-container {
		position: relative;
		padding-bottom: 15px;
	}
	.popup-top-txt {
		display: inline-block;
		font-size: 18px;
		font-weight: 600;
	}
	.popup-top-btn-container {
		position: absolute;
		right: 0px;
	}
	.popup-top-btn {
		display: inline-block;
		margin-left: 40px;
	}
	.popup-top-btn:last-child {
		color: red;
	}
	.popup-item-container {
		padding: 0px 15px;
		height: 60px;
		line-height: 60px;
		position: relative;
	}
	.popup-item-val {
		position: absolute;
		right: 20px;
		height: auto;
		
	}
	.popup-date-val-container {
		transform: translateY(-50%);
		top: 50%;
	}
	.popup-date-val {
		text-align: right;
		line-height: 20px;
	}
	.popup-date-val:last-child {
		color: #a2a2a2;
		font-size: 12px;
	}
	.position_Relative {
		position: relative;
	}
	.display_Flex {
		display: flex;
	}
	
	.detail_name{
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
	.green {
		color: limegreen;
	}
	.red {
		color: red;
	}

</style>
