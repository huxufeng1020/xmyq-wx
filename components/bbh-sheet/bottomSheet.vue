<template>
	<view class="content_bottom" style="z-index:999">
		<view class="sheet" :class="{sheetShow:isShowBottom,sheeHide:!isShowBottom}" @touchmove.stop.prevent="moveHandle" @click="closeSheet">
			<view class="sheetView" :class="{sheetView_active:isShowBottom}" @click.stop="stopEvent()">
				<view class="routine_title flex_layout"><image src="../../static/user.png" mode=""></image><text>授权登录</text></view>
				<view class="routine_message">
					<view class="content1">授权微信访问</view>
					<view class="content2">为方便永久保存浏览记录，请授权微信权限</view>
					<!-- <view class="radio_content flex_layout">
						<checkbox-group @change="changeCheck">
						  <checkbox :value="1" style="transform:scale(0.7);" :checked="true"/>
						</checkbox-group>
						<view class="flex_layout">同意授权获取</view>你的微信昵称和头像
					</view> -->
					<!-- @click.stop="cancelTap()"y原始三方登录接口-->
					<view class="empower">
						<button open-type="getPhoneNumber" @getphonenumber.stop="thirdLogin('wechat', $event)" @tap.stop="thirdLogin('wechat')">微信授权</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import $platform from '@/config/platform';
	import wechat from "@/config/wechat/wechat";
	export default {
		name : "bottomSheet",
		props: {
			isShowBottom : Boolean,
			anotherStatus:{
				type: Boolean,
				default: false
			}
		},
		
		watch: {
		  
		},
		data() {
			return {
				platform: $platform.get(),
				checkArray:[],
				code:''
			}
		},
		created() {
			let yy = new Date().getFullYear()
			let mm = (new Date().getMonth() + 1)>9?(new Date().getMonth() + 1):'0'+(new Date().getMonth() + 1)
			let dd = new Date().getDate()>9?new Date().getDate():'0'+new Date().getDate()
			this.dateTime = yy + '-' + mm + '-' + dd
			// #ifdef MP-WEIXIN
				this.wxLogin();
			// #endif
		},
		methods: {
			// 第三方登录
			async thirdLogin(provider, payload = null) {
				if (this.platform === 'wxMiniProgram' && payload === null) return;
				const that = this;
				let token = "";
				switch (provider) {
					case "wechat":
						token = await wechat.login(payload,'beforePage');
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
					//that.closeAuthModal();
					that.refreshUser();
				}
			},
			// 第三方登录end
			refreshUser(){
				this.$api.refreshUser(
				{},
				val => {
					if(val.code==1){
						this.$db.set('user',val.data.user);
						this.$db.set('auth',val.data.auth);
						this.$db.set('islogin',true);
						this.$emit('closeBottom',val.data.user);
					}else{
						this.$common.errorToShow(val.msg);
						this.$db.del('user');
						this.$db.del('auth');
						this.$db.set('islogin',false);
					}
				})
			},
			changeCheck(e){
				this.checkArray=e.detail.value
			},
			
			bindDatesf(e){
				this.nextsfdateNew=e.detail.value;
			},
			closeSheet(){
				
				if(this.anotherStatus){
					this.$emit('hideBottom');
				}
			},
			//授权按钮
			cancelTap(){
				this.onGetUserProfile()
			},
			stopEvent(){						//@click.stop防止事件冒泡
				
			},
			moveHandle(){						//不让页面滚动
				
			},
			wxLogin(){
				uni.login({
					success:(res) => {
						this.code = res.code;
						console.log("res.code: ",res.code);
					},
					fail: function (error) {
						console.log('login failed ' + error);
					}
				});
			},
			//登录接口
			onGetUserProfile() {
				var that=this;
				uni.getUserProfile({
					 desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: res => {
						this.$api.third(
							{
								code: this.code,
								platform:$platform.get(),
								encrypted_data: res.encryptedData,
								iv: res.iv,
								raw_data: res.rawData,
								signature: res.signature
							},
							data => {
								console.log(data);
								//console.log(data.data.userinfo) 
								var res=data.data;
								if (data.code == 1) {
									this.$common.successToShow('登录成功!');
									try {
										this.$db.set('upload',1)
										this.$db.set('login', 1)
										this.$db.set('auth',res.auth)
										this.$db.set('user', res.userinfo)
										this.user_id=res.userinfo.id
										uni.setStorageSync('from_id',res.userinfo.id)
										this.$emit('closeBottom',res.userinfo);
									} catch (e) {
										console.log("e: ",e);
									}
								}else{
									this.wxLogin();
									this.$common.errorToShow('授权失败，请重试!');
									uni.showToast({
										title:data.msg,
										icon:'none',
										success: () => {
											setTimeout(()=>{
												uni.navigateTo({
													url:'../user/login'
												})
											},1500)
										}
									})
								}
							}
						);
					},
					fail: (res) => {
						console.log("res: ",res);
						this.wxLogin();//重新获取登录code
						uni.hideLoading()
						if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
							uni.showModal({
								title: '用户授权失败',
								showCancel: false,
								content: '请点击重新授权，如果未弹出授权，请尝试长按删除小程序，重新进入!',
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定')
										//uni.navigateBack()
										this.isShowBottom = true;
									}
								}
							})
						}	
					}
				})
			},
		}
	}
</script>

<style>
	.header_slither{padding: 0 30rpx; height: 100rpx; line-height: 100rpx; justify-content: space-between; border-bottom: 1px solid #f8f8f8;}
	.left_cancel{color: #999; font-size: 30rpx; width: 200rpx; text-align: left; height: 100rpx; line-height: 100rpx;}
	.right_confirm{color: #45cb8c; font-size: 30rpx; width: 200rpx; text-align: right; height: 100rpx; line-height: 100rpx;}
	/* sheet弹窗 */
	.sheet{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 120%;
		left: 0upx;
		bottom: 0upx;
		right: 0upx;
		background:rgba(10,10,10,0.9);
		z-index: 998;
	}
	
	/* 显示时候的动画默认0.5s */
	.sheetView{
		width: 100%;
		height: 0upx;
		position: absolute;
		bottom: 0upx;
		background: white;
		z-index: 999;
		transition: all 0.5s;
		padding: 30rpx 45rpx;
		border-radius: 15px 15px 0 0;
	}
	.sheetShow{
		top:0upx !important;
	}
	/* 关闭时的动画，时间自己可以设置0.5s*/
	.sheeHide{
		top:120% !important;
		transition: all 0.5s;		
	}
	
	/* 项目需求根据设计稿要展示的高度,超出这个高度就自动滚动*/
	.sheetView_active{
		height: 360rpx;
	}
	
	.routine_title image{width: 50rpx; height: 50rpx; display: block; border-radius: 50%;}
	.routine_title text{display: block; color: #333; font-size: 28rpx; margin-left: 20rpx;}
	.content1{color: #333; font-size: 32rpx; margin-top: 50rpx;}
	.content2{color: #333; font-size: 24rpx; margin-top: 20rpx;}
	.empower{margin-top: 30rpx;}
	.empower button{color: #fff; font-size: 30rpx; background: #07c15e; height: 85rpx; line-height: 85rpx; width: 100%;}
	.radio_content{margin-top: 80rpx; color: #ccc;}
	.radio_content view{margin-left: 15rpx;}
	.radio_content text{display: flex; color: #999;}
</style>
