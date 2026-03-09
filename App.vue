<script>
	import wechat from "@/config/wechat/wechat";
	export default {
		onLaunch() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
			    // 请求完新版本信息的回调
			    if(res.hasUpdate){
				    updateManager.onUpdateReady(function (res) {
					    uni.showModal({
					        title: '更新提示',
						    content: '新版本已经准备好，是否重启应用？',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						})
				    })
			    }
			})
			
			this.$api.init(
			{},
			data => {
				if (data.code === 1) {
					let payment=data.data.payment
					let autologin=data.data.wechat.autologin
					let userInfo=uni.getStorageSync('user')
					let againStatus=uni.getStorageSync('againStatus')
					uni.setStorageSync('payment',payment)
					// #ifdef MP-WEIXIN
					let appid=data.data.wechat.appid
					uni.setStorageSync('appid',appid)
					//let token=wechat.getWxMiniProgramSessionKey(true)
					if(!userInfo&&autologin){
						wechat.getWxMiniProgramSessionKey(true).then((result)=>{
							uni.showLoading({
								title:'自动登录中...'
							})
						  uni.setStorageSync('token',result);
						  if (result) {
						  	this.$http('third.refreshUser',{}).then(val => {
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
						  }
						})
					}
					// #endif
					// #ifdef H5
					var ua = navigator.userAgent.toLowerCase();
					var isWeixin = ua.indexOf('micromessenger') != -1;
					if (isWeixin) {
						let appid=data.data.wechat.appid
						uni.setStorageSync('appid',appid)
						if(!userInfo&&autologin&&!againStatus){
							wechat.login();
							uni.setStorageSync('againStatus','1')
						}
					}
					// #endif
				}else{
					
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "common/main.css";
	@import "common/icon.css";
	.flex_layout{display: flex !important;align-items: center !important;flex-wrap: wrap !important; flex-direction: row !important;}
	.nodata{color: #999;font-size: 24rpx;text-align: center;padding: 30rpx;margin-top: 30rpx;}
</style>
