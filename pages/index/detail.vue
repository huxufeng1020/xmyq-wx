<template>
	<view class="">
		<view class="header padding">
			<view class="title">{{title}}</view>
			<!-- <view class="date margin-top-sm">{{createtime}}</view> -->
		</view>
		<view class="detail padding-lr">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				createtime:'',
				content:''
			}
		},
		onLoad(options) {
			this.detail(options.id)
		},
		methods: {
			detail(id){
				this.$api.detail(
				{id:id},
				data => {
					if(data.code==1){
						this.title=data.data.title
						this.createtime=this.$common.formatDate(data.data.createtime,1)
						this.content=data.data.content
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{background: #fff;}
	.header{
		.title{color: #333;font-size: 36rpx; text-align:center;}
		.date{color: #999;font-size: 28rpx;}
	}
	.detail rich-text{line-height: 1.8;color: #333;font-size: 28rpx;}
</style>
