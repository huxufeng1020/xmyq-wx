<template>
	<view>		
		<view class="bg-gradual-ondine2">
			<!--body-->
			<view class="visiting_card">
				<view class="flex_layout justify-between" v-if="userInfo">
					<view class="flex_layout" @click="userInfoPage">
						<view class="userInfo_img"><image :src="userInfo.avatar?userInfo.avatar:'../../static/user.png'"  mode=""></image></view>
						<view class="userName ellipsis margin-left-sm">
							<text>{{userInfo.nickname}}</text>
						</view>
					</view>
				</view>
				<view class="flex_layout" v-else>
					<view class="userInfo_img" @click="tologin()"><image src="../../static/user.png" mode=""></image></view>
					<view class="right_userMessage"  @click="tologin()">
						<view class="userName flex_layout">
							<text>请登录</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menus_content margin-top">
				<view class="menus_item flex_layout" @click="order">
					<view class="left_menus flex_layout">
						<image src="../../static/user1.png" mode=""></image>
						<text>订单</text>
					</view>
					<view class="right_icon"><image src="../../static/right.png" mode=""></image></view>
				</view>
				
				<!--帮助-->
				<view class="menus_item flex_layout" @click="feedback">
					<view class="left_menus flex_layout">
						<image src="../../static/user2.png" mode=""></image>
						<text>反馈和建议</text>
					</view>
					<view class="right_icon"><image src="../../static/right.png" mode=""></image></view>
				</view>
				<view class="menus_item flex_layout"  v-if="userInfo" @click="logout">
					<view class="left_menus flex_layout">
						<image src="../../static/user3.png" mode=""></image>
						<text>退出登录</text>
					</view>
					<view class="right_icon"><image src="../../static/right.png" mode=""></image></view>
				</view>
			</view>
		</view>
		<!--添加我的小程序-->
		<view class="program_flex" v-if="pointOut">
			<view class="add_program">
				<view class="">1.点击上方【...】</view>
				<view class="">2.选择【添加到我的小程序】</view>
			</view>
		</view>
		
		<!--授权弹窗-->
		<!--  #ifdef  MP-WEIXIN	 -->
		<bottomSheet :isShowBottom="isShowBottom" :anotherStatus="anotherStatus" @closeBottom="closeBottom" @hideBottom="hideBottom"></bottomSheet>
		<!--修改用户头像，用户姓名-->
		<completeData :isShow="iscomplete" :avatarSrc="avatarUrl" :name="nickname" @profileAfter='profileAfter'></completeData>
		<!--  #endif -->
	</view>
</template>

<script>
	var _this;
	import {
		cndUrl
	} from '../../config/config.js';
	import {cdnUrl,baseUrl,baseApiUrl} from '../../config/config.js';
	import completeData from '@/components/complete-data/complete-data.vue';
	import bottomSheet from '@/components/bbh-sheet/bottomSheet.vue';
	export default {
		components:{
			bottomSheet,
			completeData
		},
		data() {
			return {
				type:1,
				auth:'',
				pointOut:false,
				codeStatus:false,
				followCode:false,
				userInfo:'',
				getLinkInfo:'',
				cndUrl:cndUrl,
				isconfirm:'',
				nextSfDate:'',
				isShow:false,
				avatarUrl:'../../static/user.png',
				nickname:'',
				iscomplete:false,
				avatar:'',
				isShowBottom:false,
				anotherStatus:false
			}
		},
		mounted() {
			_this=this;
		},
		onLoad(options) {
			
		},
		onShow() {
			this.userInfo = uni.getStorageSync('user')
			if (typeof(this.userInfo)== "undefined" || this.userInfo=='' || this.userInfo==[] ||  this.userInfo==null) {
				//this.$common.navigateTo('login');
			}else{
				this.refreshUser()
			}
		},
		methods: {
			refreshUser(){
				this.$api.refreshUser(
				{},
				val => {
					if(val.code==1){
						this.userInfo=val.data.user;
						this.$db.set('user',val.data.user);
						this.$db.set('auth',val.data.auth);
						this.nickname=this.userInfo.nickname;
						this.avatarUrl=this.userInfo.avatar;
						this.avatar=this.userInfo.avatar;
						if(this.nickname=='微信用户'){
							this.iscomplete=true
						}
					}else{
						this.$common.errorToShow(val.msg);
						this.userInfo='';
						this.$db.del('user');
						this.$db.del('auth');
					}
				})
			},
			userInfoPage(){
				uni.navigateTo({
					url:'/pages/user/userInfo'
				})
			},
			feedback(){
				uni.navigateTo({
					url:'/pages/user/feedback'
				})
			},
			tologin(){
				
				uni.navigateTo({
					url:'/pages/user/login'
				})
			},
			//底部开关
			closeBottom(user){
				//this.user_id=user_id
				this.isShowBottom = false;
				this.userInfo=user;
				this.avatarUrl=user.avatar
				this.avatar=user.avatar
				this.nickname=user.nickname
				if(this.nickname=='微信用户'){
					uni.hideTabBar()
					this.iscomplete=true
				}else{
					uni.showTabBar()
				}
			},
			hideBottom(){
				this.isShowBottom = false;
			},
			userinfoLink(){
				this.$common.navigateTo('userInfo')
			},
			getnickname(e){
							console.log(e)
						},
			addProgram(){
				this.pointOut=!this.pointOut
			},
			essay(){
				uni.navigateTo({
					url:'../index/essayList'
				})
			},
			//后台网址
			interlinkage(){
				uni.navigateTo({
					url:'interlinkage?url='+this.getLinkInfo.adminur
				})
			},
			//帮助文章地址
			help(url){
				uni.navigateTo({
					url:'help?url='+url
				})
			},
			//判断是否登录
			confirmLogin(){
				return false;
			},
			myDoctor(){
				if(this.userInfo==''){
					this.$common.errorToShow('请先登录');
					return false;
				}else{
					uni.navigateTo({
						url:'myDoctor'
					})
				}
			},
			//联系客服
			contact(){
				uni.navigateTo({
					url:'contact'
				})
			},
			//个人主页
			order(){
				uni.navigateTo({
					url:'/pages/user/order'
				})
			},
			logout(){
				_this.$common.modelShow('退出登录','确认退出登录吗?',()=>{
					_this.logoutOp();
				},function(){},true,'取消','确定')
			},
			logoutOp(){
				_this.$api.logout(
				{},
				data => {
					if (data.code == 1) {
						_this.$common.successToShow(data.msg,function(){
							_this.userInfo='';
							_this.$db.del('upload', 1)
							_this.$db.del('login', 1) 
							_this.$db.del('token')
							_this.$db.del('user')	
							_this.$db.del('auth')	
							_this.$db.set('islogin',false);
							_this.$common.navigateTo('/pages/ckd/index');
						});
					}else{
						
					}
				}
				)  
			},
			userInfoLink(){
				if(this.userInfo==''){
					this.$common.errorToShow('请先登录');
					return false;
				}else{
					uni.navigateTo({
						url:'../index/wrong'
					})
				}
				
			},
			//补全资料后是否需要返回到主页，如果是当前的弹窗，留空即可
			profileAfter(){
				this.refreshUser();
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
										this.$api.profile(
										 {nickname:this.nickname,avatar:this.avatar},
										data => {
											if(data.code==1){
												this.$common.normalToShow(data.msg)
												this.isShow=false
												this.userInfo.avatar=this.avatarUrl;
												this.userInfo.nickname=this.nickname
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
	page{background: #f3f2f7;}
	.padding_content{padding: 40rpx 30rpx;}
	.Inside_fast{background: #fff; border-radius: 10px; border: 1px solid #f0deb0;}
	.menus_content{background: #fff;}
	.visiting_card{padding: 30rpx; position: relative; background: #fff;}
	.userInfo{padding: 30rpx;}
	.userInfo_block{background: #fff; border-radius: 10px; border: 1px solid #f0deb0; padding: 30rpx;}
	.userInfo_img image{width: 120rpx; height: 120rpx; border-radius: 50%;}
	.right_userMessage{padding-left: 25rpx; width: 500rpx;}
	.userName text{color: #333; font-size: 30rpx; display: block;}
	.user_status{background: #3fce8e; color: #fff; font-size: 24rpx; line-height: 1; padding: 8rpx 12rpx; border-radius: 8px 0 8px 0; margin-left: 10rpx;}
	.illness_grade{color: #999; font-size: 24rpx;}
	.drop{display: block; width: 8rpx; height: 8rpx; border-radius: 8rpx; background: #999; margin: 0 10rpx;}
	.period text{color: #999; font-size: 24rpx;}
	.period image{display: block; width: 25rpx; height: 25rpx; margin-left: 10rpx;}
	.illness_type{margin-top: 20rpx;}
	.two_code{width: 80rpx; height: 80rpx; position: absolute; right: 30rpx; top: 30rpx; display: flex; align-items: center; justify-content: center;}
	.two_code image{width: 34rpx; height: 34rpx; display: block;}
	.hideIcon{width: 40rpx; height: 40rpx;}
	.hideIcon image{width: 40rpx; height: 40rpx; display: block; position: absolute; right: 0; top: 0;}
	.bottom_operate{justify-content: space-between; padding: 30rpx; border-top: 1px solid #f8f8f8;}
	.left_operate image{width: 25rpx; height: 25rpx; display: block; margin-right: 15rpx;}
	.left_operate text{display: block; color: #45cb8c; font-size: 24rpx;}
	.right_operate image{width: 29rpx; height: 29rpx; display: block; margin-right: 15rpx;}
	.right_operate text{display: block; color: #45cb8c; font-size: 24rpx;}
	.menus_item{padding: 40rpx; border-bottom: 1px solid #f8f8f8; justify-content: space-between;line-height: 1;}
	button.menus_item{margin: 0;line-height: 1;background-color: #fff;}
	.left_menus image{width: 42rpx; height: 42rpx; display: block;}
	.left_menus text{display: block; color: #333; font-size: 28rpx;margin-left: 20rpx;}
	.right_icon image{display: block; width: 30rpx; height: 30rpx;}
	.zzc{position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 99; background: rgba(0,0,0,0.6);}
	.user_code{position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%); background: #fff; border-radius: 10px; padding: 30rpx; width: 690rpx; z-index: 100;}
	.userCode_header{justify-content: space-between; align-items: flex-start; position: relative;}
	.code_content{padding: 50rpx 0 30rpx 0;}
	.code_content image{width: 344rpx; height: 344rpx; display: block; margin: 0 auto;}
	.code_content text{display: block; text-align: center; margin-top: 50rpx; color: #999; font-size: 24rpx;}
	.user_noconfirm{background: #47a9bb; color: #FFFFFF !important; }
	.user_confirm{background: #45cb8c; color: #FFFEEC !important; }
	.program_flex{position: fixed;right: 80rpx;top: 0;padding-top: 15rpx;}
	.add_program{background: #1890ff;padding: 15rpx 25rpx;border-radius: 5px;position: relative;}
	.ellipsis text{display: block;width: 300rpx;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
	.add_program:before{content: ' ';position: absolute;top: -15rpx;right: 40rpx;
	width: 0;
	height: 0;
	border: 25rpx solid transparent;
	border-top-color: #1890ff;
	border-left-width: 0;transform: rotate(45deg);}
	.add_program view{font-size: 24rpx;color: #fff;padding: 5rpx 0;line-height: 1;}
	.homePage_btn{width: 180rpx;height: 56rpx;line-height: 56rpx;border-radius: 56rpx;border: 1px solid #1890ff;color: #1890ff;font-size: 28rpx;text-align: center;}
</style>
