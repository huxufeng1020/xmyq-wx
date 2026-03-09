<template>
	<view>
		<view class="swiper">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in swiperList" :key="index"  @tap="goPage(item.utype,item.url,item.article_id)">
					<view class="swiper-item"><image :src="item.aimage" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="hall padding">
			<view class="title">精彩活动</view>
			<view class="item" v-for="(item,index) in articles" :key="index" @click="detail(item.id)">
				<view class="img"><image :src="item.coverimage" mode="aspectFill"></image></view>
				<view class="bottom padding-sm">
					<view class="name">{{item.title}}</view>
				</view>
			</view>
		</view>
		<view class="hall padding">
			<view class="title">餐厅位置</view>
			<view class="address margin-top" v-for="(item,index) in addressList" :key="index">
				<view class="image" v-if="item.mapimage"><image :src="item.mapimage" mode="aspectFill"></image></view>
				<view class="flex_layout justify-between padding-sm">
					<view class="left">
						<view class="name">{{item.name}}</view>
						<view class="add">{{item.address}}</view>
					</view>
					<view class="right flex_layout justify-center" @click="routeTab(item.lat,item.lng,item.name,item.address)">路线 <image src="../../static/right.png"></image></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList:[],
				articles:[],
				addressList:[]
			}
		},
		onLoad() {
			this.index()
			this.shoplists()
			
		},
		onShow() {
			// let curPage = getCurrentPages();
			// let route = curPage[curPage.length - 1].route;
			// console.log(curPage);
		},
		methods: {
			index(){
				this.$api.index(
				{},
				data => {
					if(data.code==1){
						this.swiperList=data.data.ad
						this.articles=data.data.articles
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			shoplists(){
				this.$api.shoplists(
				{},
				data => {
					if(data.code==1){
						this.addressList=data.data
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			routeTab(lat,lng,name,address){
				uni.openLocation({
					latitude: Number(lat),
					longitude: Number(lng),
					name:name,
					address:address,
					success: function () {
						console.log('success');
					}
				});
				// uni.getLocation({
				// 	type: 'gcj02', 
				// 	success: function (res) {
				// 		const latitude = res.latitude;
				// 		const longitude = res.longitude;
				// 		console.log(res);
				// 		uni.openLocation({
				// 			latitude: 31.19783,
				// 			longitude: 121.32137,
				// 			name:'冠捷大厦',
				// 			address:'上海市闵行区申长路668号',
				// 			success: function () {
				// 				console.log('success');
				// 			}
				// 		});
				// 	}
				// });
			},
			goPage(utype,url,article_id){
				console.log(utype);
				if(utype=='1'){
					//外部链接
					uni.navigateTo({
						url:'/pages/public/webview?webviewPath='+url
					})
				}else{
					//指定文章页
					uni.navigateTo({
						url:'/pages/index/detail?id='+article_id
					})
				}
			},
			detail(id){
				uni.navigateTo({
					url:'/pages/index/detail?id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{background-color: #f2f2f2;}
	.swiper{
		swiper{
			width: 100%;height: 300rpx;
			.swiper-item{
				image{display: block;width: 100%;height: 300rpx;}
			}
		}
	}
	.hall{
		.title{color: #333;font-size: 36rpx;font-weight: bolder;}
		.item{
			margin-top: 30rpx;
			background: #fff;border-radius: 10px;overflow: hidden;
		  .img{
				image{display: block;width: 100%;height: 260rpx;}
			}
			.bottom{
				.name{color: #333;font-size: 28rpx;}
				.tab{background: #e4d7c4;color: #b29a5c;width: 100rpx;height: 46rpx;font-size: 26rpx;border-radius: 5px;}
				.btn button{width: 120rpx;height: 52rpx;line-height: 52rpx;background: #b29a5c;color: #fff;font-size: 28rpx;margin: 0;padding: 0;border-radius: 5px;}
			}
		}
		.item:first-child{margin-top: 0;}
		.active{border: 2px solid #b29a5c;}
		.address{
			background: #fff;
			border-radius: 10px 10px 0 0;
			overflow: hidden;
			.image{
				image{display: block;width: 100%;height: 300rpx;}
			}
			.left{
				width: 500rpx;
				.name{font-size: 30rpx;color: #333;font-weight: bolder;overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
				.add{font-size: 26rpx;color: #333;margin-top: 10rpx;overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
			}
			.right{
				padding-left: 10rpx;width: 100rpx;height: 36rpx;border-radius: 36rpx;border: 1px solid #999;color: #333;font-size: 20rpx;
			  image{display: block;width: 26rpx;height: 26rpx;}
			}
		}
	}
</style>
