<template>
	<view>
		<view class="title">
			<view class="name padding">标题</view>
			<view class="input padding-lr"><input type="text" v-model="title" placeholder="请输入建议标题" placeholder-style="color:#ccc"></view>
		</view>
		<view class="title">
			<view class="name padding">建议内容</view>
			<view class="textarea padding-lr">
				<textarea name="" id="" v-model="content" placeholder="请输入建议内容" placeholder-style="color:#ccc" cols="30" rows="10"></textarea>
			</view>
		</view>
		<view class="btn margin-top padding" @click="suggestion"><button>提交</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				content:'',
			}
		},
		methods: {
			suggestion(){
				if(this.title==''){
					uni.showToast({
						title:'请填写建议标题！',
						icon:'none'
					})
					return false
				}
				if(this.content==''){
					uni.showToast({
						title:'请填写建议内容！',
						icon:'none'
					})
					return false
				}
				this.$api.suggestion(
				{
					title:this.title,
					content:this.content
				},
				data=>{
					if(data.code==1){
						uni.showToast({
							title:data.msg,
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{background-color: #fff;}
	.title{
		.name{color: #333;font-size: 28rpx;}
		.input{
			input{display: block;width: 100%;height: 64rpx;padding: 0 30rpx;background: #f2f2f2;color: #333;font-size: 28rpx;border-radius: 5px;}
		}
		.textarea{
			textarea{
				display: block;padding: 20rpx 30rpx;width: 100%;min-height: 300rpx;background: #f2f2f2;color: #333;font-size: 28rpx;line-height: 1.8;border-radius: 10px;
			}
		}
	}
	.btn{
		button{display: block;width: 100%;height: 86rpx;line-height: 86rpx;background: #b29a5c;color: #fff;font-size: 30rpx;border-radius: 5px;}
	}
</style>
