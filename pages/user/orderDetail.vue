<template>
	<view>
		<block v-if="detail">
			<view class="back"></view>
			<view class="header padding-lr-lg padding-top padding-bottom-lg flex_layout">
				<block v-if="status==0">
					<view style="width: 100%;">
						<uni-countdown :show-day="false" :show-hour="false" color="#FFFFFF" splitorColor="#ffffff" :fontSize="24" :minute="detail.lefttime_m" :second="detail.lefttime_s" @timeup="timeup"></uni-countdown>
					</view>
					<view class="style">请尽快支付定金</view>
				</block>
				<block v-if="status==1">
					<view class="point_name margin-top">已支付定金</view>
				</block>
				<block v-if="status==2">
					<view class="point_name margin-top">您的订单已取消</view>
				</block>
				<block v-if="status==3">
					<view class="point_name margin-top">已退款</view>
				</block>
				<view class="returnIndex flex_layout justify-center" @click="returnIndex">返回首页</view>
			</view>
			<view class="padding">
				<view class="info padding-lr padding-tb-sm">
					<view class="item padding-tb-xs flex_layout">
						<view class="style1">{{detail.name}}</view>
						<view class="style2 margin-left-sm">{{detail.sexdata==1?'男':'女'}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="style1">{{detail.arrivetime}} {{detail.type}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="style1">{{detail.table.position}} {{detail.table.name}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="style2">定金￥{{detail.table.deposits}} {{status==0?'未支付':''}}</view>
					</view>
				</view>
				<view class="info padding-lr padding-tb-sm margin-top">
					<view class="item padding-tb-xs flex_layout">
						<view class="name">成人人数</view>
						<view class="style1 width">{{detail.adultNumnumber}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="name">儿童人数</view>
						<view class="style1 width">{{detail.childNum}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="name">饮食喜好</view>
						<view class="style1 width">{{detail.avoidfood?detail.avoidfood:'无'}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="name">特殊节日</view>
						<view class="style1 width">{{detail.specialdatemark?detail.specialdatemark:'无'}}</view>
					</view>
					<view class="item padding-tb-xs flex_layout">
						<view class="name">留言</view>
						<view class="style1 width">{{detail.remark?detail.remark:'无'}}</view>
					</view>
				</view>
				<view class="point_out margin-top padding">
					<view class="name">{{title}}：</view>
					<view class="text margin-top-sm">
						<rich-text :nodes="content"></rich-text>
					</view>
				</view>
				<view class="flex_layout justify-end margin-top">
					<view class="cancel margin-top" v-if="status==0" @click="cancel">取消预定</view>
					<view class="cancel margin-top" v-if="status==1&&drawback" @click="applyFor">申请退款</view>
				</view>
			</view>
			<view style="height: 130rpx;" v-if="status==0"></view>
			<view class="next_step padding-lr padding-tb-sm flex_layout justify-between" v-if="status==0">
				<view class="price">￥{{detail.table.deposits}}</view>
				<button @click="paymentBtn">立即支付</button>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:0,
				id:'',
				detail:'',
				title:'预约/退订规则说明',
				content:'',
				drawback:false
			}
		},
		onLoad(options) {
			console.log(this.timeStamp())
			this.id=options.id
			this.orderDetail()
			uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: "#c2b183" })
		},
		methods: {
			timeStamp(t){
				if(t){
					var time=new Date(t).getTime();
				}else{
					var time=new Date().getTime();
				}
				return time;
			},
			returnIndex(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			timeup(){
				this.orderOp()
			},
			//特别提示
			detailPoint(shop_id){
				this.$api.shopInfo(
				{id:shop_id},
				data => {
					if(data.code==1){
						this.content=data.data.notice
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			orderDetail(){
				this.$api.orderDetail(
				{id:this.id},
				data => {
					if(data.code==1){
						this.status=data.data.status
						this.detailPoint(data.data.shop_id)
						this.detail=data.data
						let arrivetime=data.data.arrivetime
						//苹果端需要处理时间格式
						arrivetime=arrivetime.replace(/-/g, '/')
						if(this.timeStamp(arrivetime)>this.timeStamp()){
							this.drawback=true
						}else{
							this.drawback=false
						}
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			applyFor(){
				uni.showModal({
					title: '退款',
						content: '是否确认退款？',
						success: (res)=> {
							if (res.confirm) {
								this.refund()
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
				})
			},
			refund(){
				this.$api.refund(
				{id:this.id},
				data => {
					if(data.code==1){
						this.status=3
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						});
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			cancel(){
				uni.showModal({
					title: '取消订单',
						content: '是否确认取消该订单？',
						success: (res)=> {
							if (res.confirm) {
								this.orderOp()
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
				})
			},
			orderOp(){
				this.$api.orderOp(
				{id:this.id,status:2},
				data => {
					if(data.code==1){
						this.status=2
						this.$common.successToShow(data.msg);
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						});
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			paymentBtn(){
				uni.navigateTo({
					url:'/pages/advance/method?id='+this.id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{background: #f2f2f2;}
	.back{background: #c2b183;height: 250rpx;border-radius: 0 0 50px 50px;}
	.header{
		background: #b79f5f;border-radius: 10px;width: 690rpx;margin: -210rpx auto 0 auto;min-height: 260rpx;align-content: space-between;
		.style{color: #fff;font-size: 24rpx;line-height: 1;text-align: center;width: 100%;}
		.point_name{color: #fff;font-size: 30rpx;font-weight: bolder;line-height: 1;text-align: center;width: 100%;}
		.returnIndex{
			width: 210rpx;height: 70rpx;background: #eadcb7;color: #b79f5f;border-radius: 70rpx;margin: 0 auto 0 auto;
		}
	}
	.info{
		background: #fff;border-radius: 10px;
		.item{
			.style1{color: #333;font-size: 30rpx;}
			.style2{color: #b79f5f;font-size: 30rpx;}
			.name{color: #999;font-size: 30rpx;width: 170rpx;}
			.width{width: 460rpx;line-height: 1.5;}
			.top{
				.icon{
					transition:all 0.5s;
					image{display: block;width: 30rpx;height: 30rpx;margin-left: 20rpx;}
				}
				.down{transform:rotate(90deg)}
			}
			.textarea{
				transition:all 0.5s;
				textarea{color: #333;font-size: 30rpx;display: block;width: 100%;line-height: 1.8;}
			}
			.develop{
				height: 180rpx;
				textarea{height: 180rpx;}
			}
			.shrink{
				height: 0;
				textarea{height: 0;}
			}
		}
	}
	.point_out{
		background: #fff;
		border-radius: 10px;
		.name{color: #b29a5c;font-size: 30rpx;}
		.text{rich-text{color: #999;font-size: 30rpx;line-height: 1.8;}}
	}
	.cancel{width: 220rpx;height: 75rpx;line-height: 75rpx;background: none;color: #b29a5c;border: 1px solid #b29a5c;font-size: 30rpx;border-radius: 75rpx;text-align: center}
	.next_step{
		position: fixed;left: 0;bottom: 0;width: 100%;background: #fff;
		.price{color: #b29a5c;font-size: 36rpx;font-weight: bolder;}
		button{display: block;width: 220rpx;height: 75rpx;line-height: 75rpx;background: #b29a5c;color: #fff;font-size: 30rpx;border-radius: 5px;margin: 0;}
	}
</style>
