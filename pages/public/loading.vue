<template>
	<view></view>
</template>
<script>
import {baseUrl} from '../../config/config.js';
export default {
	data() {
		return {};
	},
	async onLoad(options) {
		// #ifdef H5
		// 检测H5登录回调
		if (options?.token) {
			let that = this;
			uni.showLoading({
				title: '登录中...'
			});
			uni.setStorageSync('token',options.token)
			this.refreshUser()
		}
		// #endif
	},
	methods: {
		refreshUser(){
			this.$api.refreshUser(
			{},
			val => {
				if(val.code==1){
					uni.removeStorageSync('againStatus');
					this.$db.set('user',val.data.user);
					this.$db.set('auth',val.data.auth);
					this.$db.set('islogin',true);
					uni.hideLoading()
					let lastPage = uni.getStorageSync('lastPage');
					if (lastPage) {
						uni.removeStorageSync('lastPage');
						console.log(lastPage);
						this.$common.navigateTo('/'+lastPage);
						// console.log(baseUrl+'/'+lastPage);
						// window.location = baseUrl+lastPage;
					} else {
						uni.switchTab({
							url: '/'
						});
					}
				}else{
					this.$common.errorToShow(val.msg);
					this.$db.del('user');
					this.$db.del('auth');
					this.$db.set('islogin',false);
				}
			})
		},
	}
};
</script>

<style></style>
