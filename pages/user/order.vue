<template>
	<view>
		<view class="header flex_layout justify-between padding-lr">
			<view class="item" :class="tab==-1?'active':''" @click="clickMenu(-1)">全部</view>
			<view class="item" :class="tab==0?'active':''" @click="clickMenu(0)">待付款</view>
			<view class="item" :class="tab==1?'active':''" @click="clickMenu(1)">已付款</view>
			<view class="item" :class="tab==2?'active':''" @click="clickMenu(2)">已取消</view>
			<view class="item" :class="tab==3?'active':''" @click="clickMenu(3)">已退款</view>
		</view>
		<view class="list padding-lr">
			<block v-if="list.length>0">
				<view class="item padding margin-top" v-for="(item,index) in list" :key="index" @click="detail(item.id)">
					<view class="flex_layout">
						<view class="left"><image :src="item.table.coverimage" mode="aspectFill"></image></view>
						<view class="right padding-left">
							<view class="status color1" :class="item.status==0?'color1':item.status==1?'color2':item.status==2?'color3':'color3'">
								{{item.status==0?'待付款':item.status==1?'已付款':item.status==2?'已取消':'已退款'}}
							</view>
							<view class="style">{{item.arrivetime}}</view>
							<view class="style">{{item.table.position}} {{item.table.name}}</view>
							<view class="style">定金 ￥{{item.table.deposits}}</view>
						</view>
					</view>
					<view class="operate_btn flex_layout justify-end " v-if=item.leftTimeStatus>
						剩余支付时间：<uni-countdown :show-day="false" :show-hour="false" color="#333333" splitorColor="#333333" :fontSize="24" :minute="item.lefttime_m" :second="item.lefttime_s"></uni-countdown>
					</view>
					<view class="operate_btn flex_layout justify-end">
						<button v-if="item.status==0" @click.stop="payment(item.id)" class="btn1">立即支付</button>
						<button v-if="item.status==0" @click.stop="orderOp(index,item.id)" class="btn2">取消订单</button>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="nodata" v-if="complete">
					暂无数据~~
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	let page=1,reachbottom = true;
	export default {
		data() {
			return {
				tab:-1,
				complete:false,
				list:[]
			}
		},
		onShow() {
			page=1
			reachbottom = true
			this.list=[]
			this.orders()
		},
		// 加载更多
		onReachBottom: function() {
			if (reachbottom) {
				this.orders();
			}
		},
		methods: {
			orders(){
				this.$api.orders(
				 {
					 status:this.tab,
					 page:page,
					 limit:10
				 },
				data => {
					if(data.code==1){
						let arr=data.data;
						this.complete=true
						page++;
						uni.stopPullDownRefresh();
						if (data.data == ''||data.data == null) {
							reachbottom = false
							uni.showToast({
								"title": "已经加载全部",
								icon: "none",
								duration: 500
							});
						} else {
							this.list = this.list.concat(arr);
						}
					}
				})
			},
			orderOp(index,id){
				uni.showModal({
					title: '取消订单',
					content: '是否确认取消该订单？',
					confirmText:'确认取消',
					success: (res)=> {
						if (res.confirm) {
							this.$api.orderOp(
							{id:id,status:2},
							data => {
								if(data.code==1){
									this.list[index].status=2
								}else{
									this.$common.errorToShow(data.msg);
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			payment(id){
				uni.navigateTo({
					url:'/pages/advance/method?id='+id
				})
			},
			//退款按钮
			drawback(index,id){
				
			},
			clickMenu(index){
				page=1;
				this.list=[];
				reachbottom = true;
				this.complete=false
				this.tab=index
				this.orders()
			},
			detail(id){
				uni.navigateTo({
					url:'/pages/user/orderDetail?id='+id
				})
			},
		}
	}
</script>

<style lang="scss">
	page{background: #fafafa;}
	button::after{display: none;}
	.header{
		background: #fff;
		.item{color: #333;font-size: 30rpx;padding: 30rpx 0;}
		.active{color: #b6985a;position: relative;}
		.active::before{content: ' ';position: absolute;left: 0;bottom: 0;height: 3px;border-radius: 3px;width: 100%;background: #b6985a;}
	}
	.list{
		.item{
			background: #fff;border-radius: 10px;
			.left{
				image{display: block;width: 120rpx;height: 120rpx;}
			}
			.right{
				position: relative;
				width: 510rpx;
				.status{position: absolute;right: 0;top: 0;font-size: 28rpx;}
				.color1{color: #e91c23;}
				.color2{color: #70b71d;}
				.color3{color: #ccc;}
				.style{color: #333;font-size: 28rpx;padding: 5rpx 0;}
			}
		}
	}
	.operate_btn{
		margin-top: 30rpx;
		button{
			width: 130rpx;
		  height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50rpx;
			font-size: 24rpx;
			font-weight: 400;
			padding: 0;
			margin: 0;
		}
		.btn1{margin-right: 30rpx;background: #b79f5f;border: 1rpx solid #b79f5f;color: #fff;}
		.btn2{background: #fff;color: #999;border: 1rpx solid #ccc;}
	}
</style>
