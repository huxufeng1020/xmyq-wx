<template>
	<view>
		<view class="bg-gradual-ondine2">
			<view class="padding_content">
				<view class="Inside_fast Inside_fast_padding flex_layout justify-between">
					<view class="left_title">头像<text style="color:#ff0000">*</text></view>
					<view class="right_icon flex_layout">
						<view class="chatIcon">
							<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							  <image class="avatar" :src="fullavatar"></image>
							</button> 
						</view>
						<view class="rightIcon"><image src="../../static/right.png" placeholder-style="color:#999" mode=""></image></view>
					</view>
				</view>
				<!--基本信息-->
				<view class="Inside_fast margin-top">
					<view class="inspect_header">基本信息</view>
					<view class="inspect_content">
						<view class="inspect_item flex_layout">
							<view class="inspect_name">姓名<text>*</text></view>
							<view class="inspect_message flex_layout">
								<!-- <input type="text" value="" v-model="name" placeholder="请输入您的姓名" placeholder-style="color: #999" /> -->
								<input type="nickname" @input="gainName" class="weui-input" :value="nickname" placeholder="请输入您的姓名" placeholder-style="color:#999"/>
							</view>
						</view>
						<view class="inspect_item flex_layout">
							<view class="inspect_name">性别<text>*</text></view>
							<view class="inspect_message flex_layout">
								<radio-group class="flex_layout" @change="radioChange">
									<label class="flex_layout">
										<view>
											<radio style="transform:scale(0.7)" value="1" :checked="gender==1" />
										</view>
										<view class="margin-left-sm">男</view>
									</label>
									<label class="flex_layout margin-left">
										<view>
											<radio style="transform:scale(0.7)" value="2" :checked="gender==0" />
										</view>
										<view class="margin-left-sm">女</view>
									</label>
								</radio-group>
							</view>
						</view>
						<!-- <view class="inspect_item flex_layout">
							<view class="inspect_name">联系电话<text>*</text></view>
							<view class="inspect_message flex_layout">
								<input type="number" value="" v-model="mobile" placeholder="请输入您的手机号" placeholder-style="color: #999" />
							</view>
						</view> -->
					</view>
				</view>	
			</view>
		</view>		
		<!--提交按钮-->
		<view class="sunmit_btn" @click="submit" v-if="type!=1">
			<button>保存</button>
		</view>
	</view>
</template>

<script>
	import {cdnUrl,baseApiUrl} from '../../config/config.js';
	export default {
		data() {
			return {
				nickname:'',
				mobile:'',
				gender:0,
				avatar:'',
				fullavatar:''
			}
		},
		onLoad(options) {
			this.refreshUser()
		},
		methods: {
			refreshUser(){
				this.$api.refreshUser(
				{},
				val => {
					if(val.code==1){
						let user=val.data.user
						this.avatar=user.avatar
						this.fullavatar=user.avatar
						this.nickname=user.nickname
						this.gender=user.gender
						//this.mobile=user.mobile
					}else{
						this.$common.errorToShow(val.msg);
						this.userInfo='';
						this.$db.del('user');
						this.$db.del('auth');
					}
				})
			},
			gainName(e){
				console.log(e);
				this.nickname=e.detail.value
			},
			onChooseAvatar(e) {
				let userToken = '';
				let auth = this.$db.get("auth");
				userToken = auth.token;
				const { avatarUrl } = e.detail
				uni.uploadFile({
					url: cdnUrl + '/api/common/upload?token='+userToken,
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
						console.log(uploadFileRes);
						var dataimg=JSON.parse(uploadFileRes.data);
						this.avatar=dataimg.data.url       //接口传数据头像地址
						this.fullavatar=cdnUrl+dataimg.data.url       //前台展示用头像地址
					},
					fail: (error) => {
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
			//选择性别
			radioChange(e){
				this.gender=e.detail.value
			},
			//提交信息
			submit(){
				uni.createSelectorQuery().in(this) // 注意这里要加上 in(this)
					.select(".weui-input")  
					.fields({  
							properties: ["value"],  
					})  
					.exec((res) => {
						if(res?.[0]?.value){
							this.nickname = res?.[0]?.value 
						}
						console.log('昵称', this.nickname) 
						if(this.nickname=='微信用户'){
							uni.showToast({
								title:'换个昵称试试！',
								icon:'none'
							})
							return false;
						}
						if(this.nickname==''){
							uni.showToast({
								title:'请输入您的姓名',
								icon:'none'
							})
							return false;
						}
						
						// if(!this.$common.testString(this.mobile,'mobile')){
						// 	uni.showToast({
						// 		title:'请输正确手机号',
						// 		icon:'none'
						// 	})
						// 	return false;
						// }
					
						let obj={}
						obj['nickname']=this.nickname      //真实姓名
						obj['gender']=this.gender      //真实姓名
						obj['avatar']=this.avatar       //头像
						//obj['mobile']=this.mobile       //联系电话
						this.$api.profile(
						obj,
						data => {
							if (data.code == 1) {
								this.$common.normalToShow(data.msg,()=>{
									uni.navigateBack()
								})
							}else{
								this.$common.errorToShow(data.msg);	
							}
						}
						) 
				})
			}
		}
	}
</script>

<style>
	page{background: #f8f8f8;}
	.rightIcon image{width: 30rpx; height: 30rpx; display: block;}
	.chatIcon button{padding: 0;border-radius: 50%;}
	.chatIcon image{width: 85rpx; height: 85rpx; border-radius: 50%; display: block;}
	.rightIcon{margin-left: 30rpx;}
	/*患者展示样式*/
	.patient_disabled .Inside_fast .inspect_content .inspect_item{opacity: 0.8; background: #f8f8f8; border-bottom: 1px solid #eee;}
	.inspect_disabled{opacity: 0.8; background: #f8f8f8; border-bottom: 1px solid #eee;}
	/*患者展示样式end*/
	.padding_content{padding: 30rpx;}
	.Inside_fast{background: #fff; border-radius: 10px; border: 1px solid #f0deb0;}
	.Inside_fast_padding{padding: 30rpx;}
	.userInfo_img image{width: 120rpx; height: 120rpx; border-radius: 50%;}
	.right_userMessage{padding-left: 25rpx;}
	.userName text{color: #333; font-size: 30rpx;}
	.user_status{background: #3fce8e; color: #fff; font-size: 24rpx; line-height: 1; padding: 8rpx 12rpx; border-radius: 8px 0 8px 0; margin-left: 10rpx;}
	.illness_grade{color: #999; font-size: 24rpx;}
	.commonStyle text.drop{display: block; width: 8rpx; height: 8rpx; border-radius: 8rpx; background: #999; margin: 0 10rpx;}
	.period text{color: #999; font-size: 24rpx;}
	.period image{display: block; width: 25rpx; height: 25rpx; margin-left: 10rpx;}
	.illness_type{margin-top: 20rpx;}
	.inspect_item{justify-content: space-between; padding: 30rpx; border-bottom: 1px solid #f8f8f8; position: relative;}
	.switch{position: absolute; left: 240rpx; top: 50%; transform: translateY(-50%); z-index: 11;}
	.inspect_message picker{position: absolute; width: 100%;height: 100%; box-sizing: border-box; left: 0; top: 0; z-index: 10;}
	.commonStyle{width: 100%; justify-content: flex-end; padding: 30rpx;}
	.commonStyle view,.commonStyle text{font-size: 26rpx;}
	.selectNum{width: 100%; justify-content: flex-end; padding: 30rpx;}
	.picker_stype{width: 690rpx; justify-content: flex-end; padding: 30rpx;}
	.select_radio{width: 200rpx;}
	.inspect_name{font-size: 28rpx; color: #333; width: 260rpx; line-height: 1.8;}
	.inspect_name text{color: #f00;}
	.inspect_header{padding: 30rpx; color: #333; font-size: 30rpx; border-bottom: 1px solid #f8f8f8; font-weight: bold;}
	.radioText{margin-left: 10rpx; font-size: 28rpx; color: #333;}
	.commonStyle text{color: #999; font-size: 28rpx; margin-right: 25rpx; line-height: 1.8;}
	.commonStyle image{width: 30rpx; height: 30rpx; margin: 0;}
	.inspect_message input{width: 280rpx; height: 45rpx; color: #333; font-size: 26rpx; text-align: right;}
	.inspect_message textarea{background: #f8f8f8; padding: 30rpx; width: 100%; border-radius: 10px; margin-top: 30rpx; height: 150rpx;}
	.unit{color: #999; font-size: 28rpx; text-align: right; margin-left: 10rpx;}
	
	.selectNum text{display: block; font-size: 24rpx; color: #999; line-height: 1;}
	.selectNum image{width: 30rpx; height: 30rpx;}
	.selectNum_view view{color: #999; font-size: 24rpx; margin-right: 10rpx;}
	.selectNum_view view.active{color: #333; font-size: 30rpx;}
	
	.picker_stype{color: #333; font-size: 24rpx;}
	.selectDate{color: #333; font-size: 24rpx;}
	.selectDate image{transform: rotate(90deg); width: 26rpx; height: 26rpx; margin-left: 10rpx;}
	.textHidden{width: 280rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: right; color: #333;}
	.picker_stype image{width: 26rpx; height: 26rpx; display: block;}
	.picker_stype text{color: #999; font-size: 24rpx; margin-right: 20rpx; margin-left: 10rpx;}
	
	.sunmit_btn{padding: 40rpx;}
	.sunmit_btn button{color: #fff; background: #b29a5c; font-size: 36rpx; height: 74rpx; line-height: 74rpx; width: 360rpx; border-radius: 74rpx; margin: 0 auto; padding: 0; display: block;}
	.sunmit_btn button::after{display: none;}
	
	.inspect_item_switch{justify-content: flex-start;}
	.noData_text{color: #333; font-size: 26rpx;}
</style>
