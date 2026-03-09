<template>
	<view class="content">
	  <!-- <cu-custom bgColor="bg-blue" :isBack="true"><block slot="backText">返回</block><block slot="content">登录</block></cu-custom> -->
		<block v-if="ismobile">
			<view class="">
				<view class="login-card">
					<view class="logo_title fc-common">
						{{title}}
					</view>
					<view class="login-head"></view>
					<view class="login-input login-margin-b">
						<input type="number" v-model="username" placeholder="请输入手机号" />
					</view>
					<view class="login-input">
						<input type="number" :password="true" v-model="password" placeholder="请输入密码(6-16位)" />
					</view>
					<view class="margin-top flex justify-center">
						<button class="cu-btn bg-purple shadow-blur round" :loading="loading"   @tap="login"  :style="{background:color}">{{ loading ? "登录中...":"手机登录"}}</button>
					</view>
					<view class="flex justify-center">
						<view class="text-gray text-sm margin-top-xl" @tap="wechatLogin">微信登录</view>
						<view style="width:20px"></view>
						<view class="text-gray text-sm margin-top-xl" @tap="register">注册新账户</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<!--  #ifndef  MP-WEIXIN	 -->
			<view class="logView" v-if="isWeixin">
				<button @click="mpPowerLogin" class="logbt">
					<view class="logo_title fc-common">
						{{title}}
					</view>
					<!-- <view class="login-head"><image class="logoimg" :src="baseLogo" mode="widthFix"></image></view> -->
					<view class="loginTitile"><text decode="true">
					请点击微信登录，获取用户头像、昵称，主要用于向用户提供具有辨识度的用户中心界面</text></view>
					<view class="cu-btn bg-blue shadow-blur round" :style="{background:color}"><text class="cuIcon-lightauto"></text>微信登录</view>
					<!--修改用户头像，用户姓名-->
					<completeData :isShow="iscomplete" :avatarSrc="avatarUrl" :name="nickname" @backHome='backHome'></completeData>
				</button>
				<view class="flex justify-center">
					<view class="text-gray text-sm margin-top-xl" @click="changMobileLogin()">手机登录</view>
					<!-- <view style="width: 50rpx;"></view>
					<view class="text-gray text-sm margin-top-xl" @click="register">注册</view> -->
				</view>
			</view>
			<view class="login-bg" v-else>
				<view class="login-card">
					<view class="logo_title fc-common">
						{{title}}
					</view>
					<view class="login-input login-margin-b">
						<input type="number" v-model="username" placeholder="请输入手机号" />
					</view>
					<view class="login-input">
						<input type="number" :password="true" v-model="password" placeholder="请输入密码(6-16位)" />
					</view>
					<view class="cu-bar btn-group margin-top">
						<button class="cu-btn bg-blue shadow-blur round" :loading="loading"   @tap="login"  :style="{background:color}">{{ loading ? "登录中...":"登 录"}}</button>
					</view>
					<view class="flex justify-center">
						<view class="text-gray text-sm margin-top-xl" @tap="register">注册新账户</view>
					</view>
				</view>
			</view>
			<!--  #endif -->
			
			<!--  #ifdef  MP-WEIXIN	 -->
			<view class="logView">
				<button open-type="getPhoneNumber" @getphonenumber.stop="thirdLogin('wechat', $event)" @tap.stop="thirdLogin('wechat')" class="logbt">
					<view class="logo_title fc-common">
						{{title}}
					</view>
					<!-- <view class="login-head"><image class="logoimg" :src="baseLogo" mode="widthFix"></image></view> -->
					<view class="loginTitile"><text decode="true">
					请点击微信登录，获取用户头像、昵称，主要用于向用户提供具有辨识度的用户中心界面</text></view>
					<view class="cu-btn bg-blue shadow-blur round" :style="{background:color}"><text class="cuIcon-lightauto"></text>微信登录</view>
					<!--修改用户头像，用户姓名-->
					<completeData :isShow="iscomplete" :avatarSrc="avatarUrl" :name="nickname" @backHome='backHome'></completeData>
				</button>
				<view class="flex justify-center">
					<view class="text-gray text-sm margin-top-xl" @click="changMobileLogin()">手机登录</view>
					<!-- <view style="width: 50rpx;"></view>
					<view class="text-gray text-sm margin-top-xl" @click="register">注册</view> -->
				</view>
			</view>
			<!--  #endif -->
		</block>
	</view>
</template>

<script>
	var _this;
	import {baseLogo,cdnUrl,API_URL,title} from '../../config/config.js';
	import completeData from '../../components/complete-data/complete-data.vue';
	import $platform from '@/config/platform';
	import wechat from "@/config/wechat/wechat";
	export default {
		components:{
			completeData
		},
		data() {
			return {
				platform: $platform.get(),
				loading: false,
				user:[],
				username: "",
				password: "",
				class_id:'',
				ismobile:false,
				group_id:1,
				code:'',
				baseLogo:baseLogo,
				title:title,
				color:'#b6985a',
				avatarUrl:'../../static/user.png',
				nickname:'',
				iscomplete:false,
				avatar:'',
				isWeixin:false
			};
		},
		mounted() {
			_this = this;
		},
		onLoad(e) {
		},
		onShow() {
			this.user = this.$common.userInfo();
			
			if (typeof(this.user)== "undefined" || this.user=='' ||  this.user==null) {
				
			}else{
				this.$common.navigateTo('index');
			}
			// #ifdef H5
			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			this.isWeixin=isWeixin
			// #endif
			
		},
		methods: {
			//微信浏览器授权微信登录
			mpPowerLogin(){
				let curPage = getCurrentPages();
				if(curPage.length>1){
					var route = curPage[curPage.length - 2].route;
					uni.setStorageSync('lastPage',route)
				}else{
					//var route = 'pages/index/index'
				}
				//uni.setStorageSync('lastPage',route)
				wechat.login()
			},
			// 第三方登录
			async thirdLogin(provider, payload = null) {
				console.log(payload);
				if (this.platform === 'wxMiniProgram' && payload === null) return;
				const that = this;
				let token = "";
				switch (provider) {
					case "wechat":
						token = await wechat.login(payload,'loginPage');
						break;
					case "alipay":
						break;
					case "apple":
						token = await apple.appleIdOauth();
						break;
					default:
						break;
				}
				uni.setStorageSync('token',token);
				if (token) {
					this.refreshUser()
				}
			},
			refreshUser(){
				this.$api.refreshUser(
				{},
				val => {
					if(val.code==1){
						this.$db.set('user',val.data.user);
						this.$db.set('auth',val.data.auth);
						this.$db.set('islogin',true);
						uni.navigateBack()
					}else{
						this.$common.errorToShow(val.msg);
						this.$db.del('user');
						this.$db.del('auth');
						this.$db.set('islogin',false);
					}
				})
			},
			
			//切换微信登录
			wechatLogin(){
				_this.ismobile=false;
			},
			//切换手机登录
			changMobileLogin(){
				_this.ismobile=true;
				
			},
			register(){
				this.$common.navigateTo('register');
			},
			login() {
				_this.loading = true;
				if (_this.username == '' || _this.username.length<11) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					_this.loading = false;
					return;
				}
				if (_this.password == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入密码'
					});
					_this.loading = false;
					return;
				}
				_this.$api.login(
					 {
						account: _this.username,
						password: _this.password,
					 },
					data => {
						//console.log(data);
						if (data.code == 1) {
							_this.loading = false;
							//console.log(data);
							_this.$common.successToShow(data.msg,function(){
								//_this.$common.navigateTo('/pages/index/index');
								uni.navigateBack()
							});
							try {
								_this.$db.set('upload', 1)
								_this.$db.set('login', 1)
								_this.$db.set('token', data.data.userinfo.token)
								_this.$db.set('user', data.data.userinfo)	
								_this.$db.set('auth', data.data.auth)							
							} catch (e) {}
							
							
						}else{
							_this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.msg
							});
						}
						
					}
				)
			},
			//补全资料后是否需要返回到主页，如果是当前的弹窗，留空即可
			backHome(){
				this.$common.navigateBack();
			},
			
		}
	}
</script>

<style>
	page{ background: #fff;}
	.logo_title{font-size: 50rpx;text-align: center;padding: 30rpx;}
	.content{ height: 100%;}
	.logView{
		display: flex;
		align-items: center;
		justify-content:center ;
		flex-direction:column;
		align-items: center;     /* 垂直居中 */
		 width: 100%;
		 position: fixed;
		 left: 50%;
		 top: 50%;
		 transform: translate(-50%,-50%);
	}
	.logbt {
		display: flex;
		align-items: center;
		justify-content:center ;
		flex-direction:column;
		align-items: center;     /* 垂直居中 */
		 width: 100%;
		background: none;
		border: none !important; 	
	}

	.logbt:after {
		border: none !important;
	}
   .logbt .logoimg{
	   width: 200rpx;
	   height: 200rpx;
	   display: block;
   }
   .logbt .wechatimg{
   	  width: 150rpx;
   	  height: 150rpx;
   	   display: block;
   }
   .loginTitile{ padding: 50rpx; font-size: 28rpx; color: #787878; line-height: 1.3; text-align: center;} 
   .loginBtn{ width: 300rpx; height: 70rpx; line-height: 70rpx; color: #fff; background:#b6985a; border-radius: 10rpx; border: none;}
	image {
		width: 100rpx;
		height: 100rpx;
	}
.mobileLogin{ background: none; color: #999; text-align: center; margin: 40rpx auto; border: none; font-size: 26rpx;}
	.landing[type=primary] {
		height: 84rpx;
		line-height: 84rpx;
		border-radius: 44rpx;
		font-size: 32rpx;
		/* background: linear-gradient(left, #86B5F4, #4790EF); */
		background-color: #ffbc32;
	}

	.login-btn {
		padding: 10rpx 20rpx;
		margin-top: 60rpx;
	}

	.login-function {
		overflow: auto;
		padding: 20rpx 20rpx 30rpx 20rpx;
	}

	.login-forget {
		float: left;
		font-size: 26rpx;
		color: #999;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 26rpx;

	}

	.login-input input {
		background: #F2F5F6;
		font-size: 28rpx;
		padding: 10rpx 25rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
	}

	.login-margin-b {
		margin-bottom: 25rpx;
	}

	.login-input {
		padding: 10rpx 20rpx;
	}

	.login-head {
		font-size: 34rpx;
		text-align: center;
		padding: 25rpx 10rpx 55rpx 10rpx;
	}
.login-head image{ width: 200rpx;}
	.login-card {
		background: #fff;
		border-radius: 12rpx;
		padding: 10rpx 25rpx;
		position: relative;
		margin-top: 120rpx;
	}

	.login-bg {
		height: 100%;
		padding: 25rpx;
	}
	.login-head{ font-size: 90rpx;
	font-weight: bold;
	-webkit-mask-image:-webkit-gradient(linear, 0 0, 0 bottom, from(white), to(rgba(210, 1, 160, 0.53)));}
</style>
