import {
	baseUrl,
	baseApiUrl
} from './config.js';
import $platform from '@/config/platform';
import * as common from './common.js' //引入common
import * as db from './db.js' //引入common
// 需要登陆的，都写到这里，否则就是不需要登陆的接口
const methodsToken = [
	'refreshUser',
	'profile',
	'reserveData',
	'reserveBegin',
	'orders',
	'orderDetail',
	'orderOp',
	'orderUser',
	'prepay',
	'refund',
	'suggestion',
	'logout'
];
const post = (method, data, callback,type) => {
	let userToken = '';
	let auth = '';
	// 判断token是否存在
	if (methodsToken.indexOf(method) >= 0) {
		// 获取用户token
		//let auth = db.get("auth");
		//console.log(auth);
		let nowdate = (new Date()) / 1000; //当前时间戳
		//新增用户判断是否登录逻辑begin
		 //common.isLogin();
		//新增用户判断是否登录逻辑end
		//console.log('auth',auth);
		// if (!auth || auth.createtime+auth.expires_in < nowdate) {
		// 	common.toLogin();
		// 	return false;
		// } else {
		// 	userToken = auth.token;
		// }
		userToken = db.get("token");
	}
	
	if(type){
		method =  type + '/' + method
	}else{
		method = '/' + method
	}
    //uni.showLoading({title:'',icon:'loading'});
	uni.request({
		url: baseApiUrl + method,
		data: data,
		header: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
			'token': userToken,
			'platform': $platform.get()       //
		},
		method: 'POST',
		success: (response) => {
			//uni.hideLoading();
			const result = response.data
			if (result.code == '401') {
				db.del("user");
				db.del("auth");
				console.log('未登陆')
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000,
					complete: function() {
						uni.reLaunch({
							url: '/pages/user/login',
						})
					}
				});
			}
			callback(result);
		},
		fail: (error) => {
			uni.hideLoading();
			if (error && error.response) {
				showError(error.response);
			}
		},
	});
}

// 上传图片
export const uploadImage = (method , data = {} , callback , num = 9 ,type) => {
	if(type){
		method =  type + '/' + method
	}else{
		method =method
	}
	let userToken = '';
	let auth = db.get("auth");
	userToken = auth.token;
	uni.chooseImage({
		count:num,
		success: (res) => {
			uni.showLoading({
				title: '上传中...'
			});
			let tempFilePaths = res.tempFilePaths
			for (var i = 0; i < tempFilePaths.length; i++) {
				data.file = tempFilePaths[i]
				uni.uploadFile({
					url: baseApiUrl + method,
					filePath: tempFilePaths[i],
					fileType: 'image',
					name: 'file',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'multipart/form-data',
						'token': userToken
					},
					formData: data,
					success: (uploadFileRes) => {
						callback(JSON.parse(uploadFileRes.data))
					},
					fail: (error) => {
						if (error && error.response) {
							common.showError(error.response);
						}
					},
					complete: () => {
						setTimeout(function () {
							uni.hideLoading();
						}, 250);
					},
				});
			}
		}
	});
}

const get = (url, callback) => {
	uni.showLoading({
		title: '加载中'
	});
	uni.request({
		url: url,
		header: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
		},
		method: 'GET',
		success: (response) => {
			callback(response.data);
		},
		fail: (error) => {
			if (error && error.response) {
				showError(error.response);
			}
		},
		complete: () => {
			setTimeout(function() {
				uni.hideLoading();
			}, 250);
		}
	});
}

const showError = error => {
	let errorMsg = ''
	switch (error.status) {
		case 400:
			errorMsg = '请求参数错误'
			break
		case 401:
			errorMsg = '未授权，请登录'
			break
		case 403:
			errorMsg = '跨域拒绝访问'
			break
		case 404:
			errorMsg = `请求地址出错: ${error.config.url}`
			break
		case 408:
			errorMsg = '请求超时'
			break
		case 500:
			errorMsg = '服务器内部错误'
			break
		case 501:
			errorMsg = '服务未实现'
			break
		case 502:
			errorMsg = '网关错误'
			break
		case 503:
			errorMsg = '服务不可用'
			break
		case 504:
			errorMsg = '网关超时'
			break
		case 505:
			errorMsg = 'HTTP版本不受支持'
			break
		default:
			errorMsg = error.msg
			break
	}
	uni.showToast({
		title: errorMsg,
		icon: 'none',
		duration: 2000
	});
}
//第三方登录
export const wxMiniProgramOauth = (data, callback) => post('wxMiniProgramOauth', data, callback,'third');
//静默登录
export const getWxMiniProgramSessionKey = (data, callback) => post('getWxMiniProgramSessionKey', data, callback,'third');
// 密码登录
export const login = (data, callback) => post('login', data, callback,'User');
//验证码登录
export const mobilelogin = (data, callback) => post('mobilelogin', data, callback,'User');
//退出登录
export const logout = (data, callback) => post('logout', data, callback,'User');
// 补充资料
export const profile = (data, callback) => post('profile', data, callback,'User');
//注册
export const register = (data, callback) => post('register', data, callback,'User');
//验证码
export const sendSmsVerify = (data, callback) => post('sendSmsVerify', data, callback,'User');
//绑定手机号
export const changemobile = (data, callback) => post('changemobile', data, callback,'User');
// 登录
export const third = (data, callback) => post('third', data, callback,'User');
//判断是否登录
export const refreshUser = (data, callback) => post('refreshUser', data, callback,'User');

//首页广告位+文章
export const index = (data, callback) => post('index', data, callback,'common');
//文章详情
export const detail = (data, callback) => post('detail', data, callback,'common');
//门店列表
export const shoplists = (data, callback) => post('shoplists', data, callback,'common');
//门店列表
export const shopInfo = (data, callback) => post('shopInfo', data, callback,'common');
//预约数据
export const reserveData = (data, callback) => post('reserveData', data, callback,'common');
//门店可预约信息
export const shopTypes = (data, callback) => post('shopTypes', data, callback,'common');
//开始预约
export const reserveBegin = (data, callback) => post('reserveBegin', data, callback,'common');
//订单
export const orders = (data, callback) => post('orders', data, callback,'common');
//特殊节日
export const specialdatedata = (data, callback) => post('specialdatedata', data, callback,'common');
//订单详情
export const orderDetail = (data, callback) => post('orderDetail', data, callback,'common');
//取消订单
export const orderOp = (data, callback) => post('orderOp', data, callback,'common');
//最近订餐信息
export const orderUser = (data, callback) => post('orderUser', data, callback,'common');
//获取支付参数
export const prepay = (data, callback) => post('prepay', data, callback,'pay');
//h5支付
export const wxJssdk = (data, callback) => post('wxJssdk', data, callback,'third');
//初始化接口
export const init = (data, callback) => post('init', data, callback,'third');
//申请退款
export const refund = (data, callback) => post('refund', data, callback,'pay');
//提交建议
export const suggestion = (data, callback) => post('suggestion', data, callback,'common');


