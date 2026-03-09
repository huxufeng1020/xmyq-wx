<template>
	<view>
		<view class="zzc" v-if="iscomplete"></view>
		<view class="complete" v-if="iscomplete">
			<view class="title padding-top padding-lr">
				<view>获取你的昵称、头像</view>
				<text>获取用户头像、昵称，主要用于向用户提供具有辨识度的用户中心界面</text>
			</view>
			<view class="info padding-lr">
				<view class="item-tree">
						<view class="item item-a flex_layout justify-between">
							<view class="left">头像</view>
							<button class="avatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							  <image :src="avatarUrl"></image>
							</button> 
						</view>
				</view>
				<view class="item-tree">
					<view class="item item-n flex_layout">
						<view class="left">昵称</view>
						<view class="right">
							<input type="nickname" v-model="nickname" class="weui-input" placeholder="请输入昵称"/>
						</view>
					</view>
				</view>
			</view>
			<view class="operate flex_layout justify-around padding-tb solid-top">
				<button class="btn1" @click="cancelBtn">取消</button>
				<button class="btn2" @click="profile">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {cdnUrl,baseUrl,baseApiUrl} from '../../config/config.js';
	export default {
		name:"complete-data",
		data() {
			return {
				avatarUrl:'../../static/user.png',
				avatar:'',
				nickname:'',
				iscomplete:false
			};
		},
		props:{
			isShow: {
				type: Boolean,
				default: false
			},
			avatarSrc: {
				type: String,
				default: '../../static/user.png'
			},
			name: {
				type: String,
				default: ''
			},
		},
		watch:{
			isShow(v){
				this.iscomplete=v
			},
			avatarSrc(v){
				this.avatarUrl=v
				this.avatar=v
			},
			name(v){
				this.nickname=v
			},
		},
		methods: {
			onChooseAvatar(e) {
				console.log("e",e);
				let userToken = '';
				let auth = this.$db.get("auth");
				userToken = auth.token;
				const { avatarUrl } = e.detail 
				
				uni.uploadFile({
					url: baseApiUrl + 'common/upload?token='+userToken,
					filePath: avatarUrl,
					fileType: 'image',
					name: 'file',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'multipart/form-data',
						'token': userToken
					},
					formData: {},
					success: (uploadFileRes) => {
						
						var dataimg=JSON.parse(uploadFileRes.data);
						this.avatarUrl=dataimg.data.fullurl
						this.avatar=dataimg.data.url
					},
					fail: (error) => {
						console.log('失败',error)
						if (error && error.response) {
							this.$common.showError(error.response);
						}
					},
					complete: () => {
						setTimeout(function () {
							uni.hideLoading();
						}, 250);
					},
				});
			},
			cancelBtn(){
					uni.showTabBar()
					this.iscomplete=false
					this.$emit('backHome')
				},
			profile(){
				uni.createSelectorQuery().in(this) // 注意这里要加上 in(this)  
					.select(".weui-input")  
					.fields({  
							properties: ["value"],  
					})  
					.exec((res) => {  
							this.nickname = res?.[0]?.value  
							console.log('昵称', this.nickname) 
							if(this.nickname=='微信用户'){
								uni.showToast({
									title:'换个昵称试试！',
									icon:'none'
								})
								return false;
							}
					this.$api.profile(
					 {nickname:this.nickname,avatar:this.avatar},
					data => {
						if(data.code==1){
							this.$common.normalToShow(data.msg)
							uni.showTabBar()
							this.iscomplete=false
							//完善资料后事件触发 
							this.$emit('profileAfter')
						}else{
							this.$common.errorToShow(data.msg)
						}
					}) 
			})
		},
		}
	}
</script>

<style lang="scss">
	.zzc{position: fixed;left: 0;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);z-index: 99;}
	.complete{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		border-radius: 10px 10px 0 0;
		z-index: 100;
		.title{
			view{color: #333;font-size: 30rpx;}
			text{color: #999;font-size: 24rpx;display: block;margin-top: 10rpx;line-height: 1.5;}
		}
		.info{
			margin-top: 30rpx;
			.item-tree{position: relative;}
			.item{
				margin: 30rpx 0;
				padding-right:30rpx;
				.left{color: #333;font-size: 28rpx;width: 150rpx;}
				.avatar{
					width: 88rpx;height: 88rpx;display: block;margin: 0;padding: 0;background: none;border: none;
					image{width: 100%;height: 100%;border-radius: 100%;display: block;}
				}
				button::after{display: none;}
				.right input{width: 510rpx;color: #000;font-size: 28rpx;padding-left: 20rpx;text-align: right;}
			}
			.item:before{
			content: '';
			position: absolute;
			right: -1px;
			width: 7px;
			height: 7px;
			border-top: 2px solid #cccccc;
			border-right: 2px solid #cccccc;
			transform: rotate(45deg);
			}
			.item-a:hover{
				top: 40rpx;
			}
			.item-n:hover{
				top: 16rpx;
			}
		}
		.operate{
			border-radius: 10px;
			overflow: hidden;
			button::after{display: none;}
			button{width: 30%;font-size: 30rpx;height: 64rpx;line-height: 64rpx;border: none;background: #fff;border-radius: 5px;}
			.btn1{color: #666;background: #ccc;}
			.btn2{color: #fff;background: #b29a5c;}
		}
	}
</style>