<template>
	<view>
		<view class="success-box u-flex-col u-row-center u-col-center">
			<image class="pay-img" :src="payImg[payState]" mode=""></image>
			<text class="notice">{{ payText[payState] }}</text>
			<!-- <text class="pay-money"
				v-if="payState === 'success' && orderDetail.total_fee">￥{{ orderDetail.total_fee }}</text> -->
			<view class="btn-box flex_layout justify-between">
		
				<button class="u-reset-button base-btn" @tap="index">返回首页</button>
				<button v-if="payState === 'fail'" class="u-reset-button again-pay" @tap="onPay">重新支付</button>
				<button v-else class="u-reset-button base-btn"
					@tap="user">个人中心</button>
		
			</view>
		</view>
	</view>
</template>

<script>
	let payTimer = null;
	let payCount=5
	import Pay from '@/config/pay';
	export default {
		data() {
			return {
				payImg: {
					fail: '../../static/order_pay_fail.gif',
					success: '../../static/order_pay_success.gif',
					paying: '../../static/order_paying.gif'
				},
				payText: {
					fail: '支付失败',
					success: '支付成功',
					paying: '查询中...'
				},
				orderType: 'goods',
				payState:'paying',
				orderId:'',
				type:''
			}
		},
		onLoad(options) {
			this.orderId=options.orderId
			this.orderType=options.orderType
			this.payState=options.payState
			this.type=options.type
			if(this.payState=='paying'){
				this.checkTimer()
			}
			//this.getGoodsOrderDetail()
		},
		onHide() {
			clearInterval(payTimer);
			payTimer = null;
		},
		methods: {
			index(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			user(){
				uni.switchTab({
					url:'/pages/user/user'
				})
			},
			// 支付倒计时
			checkTimer() {
				let that = this;
				let count = 0;
				that.payState = 'paying';
				payTimer = setInterval(() => {
					count++;
					if (count < payCount) {
						that.getGoodsOrderDetail();
					} else {
						clearInterval(payTimer);
						that.payState = 'fail';
					}
				}, 800);
			},
			//获取商品信息（order_sn等）
			getGoodsOrderDetail(){
				let that = this;
				this.$api.orderDetail(
				{id:this.orderId},
				data => {
					if(data.code==1){
						//this.orderDetail=data.data
						if(data.data.status==1){
							that.payState = 'success';
							clearInterval(payTimer);
						}
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			onPay(){
				let that = this;
				//let pay = new Pay(that.type, that.orderDetail, that.orderType);
				uni.navigateTo({
					url:'/pages/advance/method?id='+this.orderId
				})
			},
		}
	}
</script>

<style lang="scss">
	button::after{display: none;}
  .success-box {
  	background: #fff;
  	width: 750rpx;
  	padding: 40rpx 0;
  
  	.pay-img {
  		width: 130rpx;
  		height: 130rpx;
			display: block;
			margin: 0 auto
  	}
  
  	.notice {
  		font-size: 30rpx;
			text-align: center;
			display: block;
  		font-weight: bold;
  		color: rgba(51, 51, 51, 1);
  		line-height: 30rpx;
  		margin-top: 30rpx;
  	}
  
  	.pay-money {
  		font-size: 36rpx;
  		color: #ff3000;
  		font-weight: 600;
  		margin-top: 20rpx;
  	}
  
  	.btn-box {
  		margin-top: 100rpx;
  
  		.base-btn {
  			width: 320rpx;
  			line-height: 70rpx;
  			background: rgba(255, 255, 255, 1);
  			border: 1rpx solid rgba(223, 223, 223, 0.5);
  			border-radius: 35rpx;
  			font-size: 28rpx;
  			font-weight: 400;
  			color: rgba(153, 153, 153, 1);
  			padding: 0;
  		}
  
  		.again-pay {
  			width: 320rpx;
  			line-height: 70rpx;
  			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
  			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
  			border-radius: 35rpx;
  			font-size: 28rpx;
  
  			font-weight: 400;
  			color: rgba(255, 255, 255, 0.8);
  			padding: 0;
  		}
  	}
  }
</style>
