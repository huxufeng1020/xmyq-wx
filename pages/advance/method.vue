<!-- 收银台 -->
<template>
	<view class="pay-method-wrap">
		<view class="money-box" v-if="loadStatus">
			<uni-countdown :show-day="false" :show-hour="false" color="#333333" splitorColor="#333333" :fontSize="30" :minute="lefttime_m" :second="lefttime_s" @timeup="timeup"></uni-countdown>
			<!-- <view class="money flex_layout justify-center">{{ orderDetail.table.deposits }}</view> -->
		</view>
		<radio-group class="pay-box" @change="radioChange" v-if="paymentList && paymentList.length">
			<!--微信支付-->
			<label class="flex_layout u-row-between pay-item" v-if="paymentList.includes('wechat')">
				<radio value="wechat" :checked="payType=='wechat'" color="#f0c785"></radio>
				<view class="flex_layout right_info">
					<image class="pay-img" :src="'../../static/order_wx_pay.png'" mode=""></image>
					<text>微信支付</text>
				</view>
			</label>
			<!--支付宝支付-->
			<label class="flex_layout u-row-between pay-item" v-if="paymentList.includes('alipay')">
				<radio value="alipay" :checked="payType=='alipay'" color="#f0c785"></radio>
				<view class="flex_layout right_info">
					<image class="pay-img" :src="'../../static/order_ali_pay.png'" mode=""></image>
					<text>支付宝支付</text>
				</view>
			</label>
			<!--苹果支付-->
			<label class="flex_layout u-row-between pay-item" v-if="paymentList.includes('iospay') && appPlatfrom === 'ios'">
				<radio value="iospay" :checked="payType=='iospay'" color="#f0c785"></radio>
				<view class="flex_layout right_info">
					<image class="pay-img" :src="'../../static/order_apple_pay.png'" mode=""></image>
					<text>ApplePay</text>
				</view>
			</label>
			<!--余额支付-->
			<label class="flex_layout u-row-between pay-item" v-if="paymentList.includes('wallet')">
				<radio value="wallet" :checked="payType=='wallet'" color="#f0c785"></radio>
				<view class="flex_layout right_info">
					<image class="pay-img" :src="'../../static/order_wallet_pay.png'" mode=""></image>
					<text>余额支付</text>
				</view>
			</label>
		</radio-group>	
		<button class="u-reset-button pay-btn" @tap="confirmPay">确认支付 ￥{{ orderDetail&&orderDetail.table?orderDetail.table.deposits : '0.00' }}</button>
	</view>
</template>

<script>
	/**
	 * 接收商品订单orderType:goods，充值订单orderType:recharge
	 */
	import Pay from '@/config/pay.js';
	let timer;
	export default {
		components: {},
		data() {
			return {
				payType: 'wechat', //支付方式
				isCountDown: true, //是否显示订单倒计时。
				orderDetail: {},
				timeText: '', //倒计时文本
				platform: 'wxMiniProgram',
				appPlatfrom: '',
				orderType: 'goods',
				stageType:'',
				paymentList:['wechat'],
				orderId:'',
				lefttime_m:14,
				lefttime_s:59,
				loadStatus:false
			};
		},
		onShow() {
			this.orderDetail.id && this.countDown();
		},
		onLoad(options) {
			this.paymentList=uni.getStorageSync('payment');
			if(this.orderType=='goods'){
				this.stageType = 1
			}
			this.orderId=options.id
			
			// if (this.$platform.get() === 'wxOfficialAccount' && this.$platform.device() === 'ios' && this.$platform
			// 	.entry() !== location.href) location.reload();
			// 获取订单详情
			this.getGoodsOrderDetail()
		},
		onHide() {
			clearInterval(timer);
			timer = null;
		},
		methods: {
			radioChange(e){
				this.payType=e.detail.value
			},
			/**
			 * 剩余时间格式化
			 * @param {Number} t - 剩余多少秒
			 * @return {Object}  format - 格式后的天时分秒对象
			 */
			format(t) {
				let format = {
					d: '00',
					h: '00',
					m: '00',
					s: '00'
				};
				if (t > 0) {
					let d = Math.floor(t / 86400);
					let h = Math.floor((t / 3600) % 24);
					let m = Math.floor((t / 60) % 60);
					let s = Math.floor(t % 60);
					format.d = d < 10 ? '0' + d : d;
					format.h = h < 10 ? '0' + h : h;
					format.m = m < 10 ? '0' + m : m;
					format.s = s < 10 ? '0' + s : s;
				}
				return format;
			},
			// 倒计时
			countDown() {
				let that = this;
				let t = parseInt(that.orderDetail.expired_time * 1000) - parseInt(new Date().getTime());
				t = t / 1000;
				timer = setInterval(() => {
					if (t > 0) {
						let time = that.format(t);
						that.timeText = `支付剩余时间 ${time.m}:${time.s}`;
						t--;
					} else {
						clearInterval(timer);
						that.timeText = '订单已过期!';
					}
				}, 1000);
			},
			timeup(){
				// console.log(1332312212121212121);
				uni.navigateBack()
			},
			// 发起支付
			confirmPay() {
				let that = this;
				let pay = null;
				if (!that.payType) {
					this.$common.normalToShow('请选择支付方式');
					return;
				}
				if (that.payType === 'wallet') {
					uni.showModal({
						title: '支付提示',
						confirmColor: '#f0c785',
						content: `是否确认使用余额支付:${that.orderDetail.table.deposits || '0.00'}元?`,
						success: res => {
							if (res.confirm) {
								pay = new Pay(that.payType, that.orderDetail, that.orderType,that.stageType);
							}
						}
					});
				} else {
					pay = new Pay(that.payType, that.orderDetail, that.orderType,that.stageType);
				}
			},
			//获取商品信息（order_sn等）
			getGoodsOrderDetail(){
				this.$api.orderDetail(
				{id:this.orderId},
				data => {
					if(data.code==1){
						this.loadStatus=true
						this.status=data.data.status
						this.orderDetail=data.data
						this.lefttime_m=data.data.lefttime_m      //支付剩余分钟数
						this.lefttime_s=data.data.lefttime_s      //支付剩余秒数
						this.countDown();
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},

			// 充值订单信息
			getRechargeOrderDetail() {
				let that = this;
				that.$http('money.rechargeDetail', {
					id: that.orderId
				}).then(res => {
					if (res.code === 1) {
						that.orderDetail = res.data;
						if (res.data.ext_arr !== null) {
							that.countDown();
						} else {
							that.isCountDown = false;
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.money-box {
		background: #fff;
		padding: 30rpx;

		.time {
			font-size: 28rpx;
			color: #c4c4c4;
		}

		.money {
			color: #e1212b;
			font-size: 60rpx;
			margin-top: 60rpx;

			&::before {
				content: '￥';
				font-size: 46rpx;
			}
		}
	}

	.pay-box {
		.pay-item {
			height: 90rpx;
			padding: 0 30rpx;
			font-size: 26rpx;
			background: #fff;
			width: 750rpx;
			border-bottom: 1rpx solid #eeeeee;
			radio{transform:scale(0.8)}
			&:last-child {
				border-bottom: none;
			}
			
			.right_info{
				padding-left: 30rpx;
			}

			.pay-img {
				width: 40rpx;
				height: 40rpx;
				margin-right: 25rpx;
			}
		}
	}

	.pay-btn {
		width: 690rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
		margin: 100rpx auto 0;
	}
</style>
