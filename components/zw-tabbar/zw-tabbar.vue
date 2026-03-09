<template>
    <view class="tabbar-box" v-if="tabBarShow">
			<view class="tabbar-box-pos">
			   
				<view class="menu-list">
					<view class="item" :style="{color:selIdx==index?hoverColor:color}" v-for="(item,index) in list"
						@click="click(index)" :key="index">
						<view v-if="index!=2">
							<view class="icon-box">
								  <image mode="aspectFit" :src="selIdx==index?item.selectedIconPath:item.iconPath"></image>
							</view>
						</view>
						<text v-if="item.text && index!=bigIdx" class="iconfill" :class="selIdx==index?'scolor':'ncolor'">{{item.text}}</text>
						<text class="message_count" v-if="messageCount>0 && index==3">{{messageCount}}</text>
					</view>
				</view>
				
				<view class="publish" @click="click(2)">
						<view class="icon-box">
							<image class="centerImg" mode="aspectFit" :src="selIdx==2?bigselectedIconPath:bigiconPath"></image>
						</view>
				</view>
		
			</view>
    </view>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default:()=> [{
				        "pagePath": "/pages/index/index",
						'iconfont':'cuIcon-video ncolor',
						'selectIconfont':'cuIcon-videofill scolor',
						"iconPath": "/static/icon/tabBar/1.png",
				        "selectedIconPath": "/static/icon/tabBar/1_on.png",
				        "text": "首页"
				    }, {
				        "pagePath": "/pages/index/index?attention=3",
				        "iconPath": "/static/icon/tabBar/2.png",
				        "selectedIconPath": "/static/icon/tabBar/2_on.png",
						'iconfont':'cuIcon-attention ncolor',
						'selectIconfont':'cuIcon-attentionfill scolor',
				        "text": "关注"
				    },
				    {
				        "pagePath": "/pages/user/publish",
				        "iconPath": "/static/icon/tabBar/3.png",
				        "selectedIconPath": "/static/icon/tabBar/3_on.png",
						'iconfont':'cuIcon-roundadd ncolor',
						'selectIconfont':'cuIcon-roundaddfill scolor', 
				        "text": "发布"
				    },
				    {
				        "pagePath": "/pages/user/message",
				        "iconPath": "/static/icon/tabBar/4.png",
				        "selectedIconPath": "/static/icon/tabBar/4_on.png",
						'iconfont':'cuIcon-message ncolor',
						'selectIconfont':'cuIcon-messagefill scolor',
				        "text": "消息"
				    }, {
				        "pagePath": "/pages/user/index",
				       "iconPath": "/static/icon/tabBar/5.png",
				        "selectedIconPath": "/static/icon/tabBar/5_on.png",
						'iconfont':'cuIcon-my ncolor',
						'selectIconfont':'cuIcon-myfill scolor',
				        "text": "我的"
				    }
				]
            },//菜单配置
            defaultSel: {
                type: Number,
                default: 0
            },//默认选中菜单
			messageCount: {
			    type: Number,
			    default: 0
			},//默认选中菜单
            hoverColor: {
                type: String,
                default: "#000000"
            },//选中颜色
            color: {
                type: String,
                default: "#666666"
            },//默认颜色
            bigIdx: {
                type: Number,
                default: 2
            },//大图标显示菜单-1为未开启
			tabBarShow:{
				type: Boolean,
				default: true
			}
        },
        data() {
            return {
                selIdx: -1,
				bigiconPath:'/static/icon/tabBar/3.png',
				bigselectedIconPath:'/static/icon/tabBar/3_on.png'
            }
        },
        mounted() {
            this.selIdx = this.defaultSel;
        },
        methods: {
            click(idx) {
							let user=uni.getStorageSync("user");
							if(idx==2){
								if(user){
									if(user.mobile!=''){
										this.selIdx = idx;
										var data=[];
										data['index']=idx;
										data['path']=this.list[idx]['pagePath']
										this.$emit("clickTab", data)
									}else{
										uni.showModal({
											title: '提示',
											content: '您还没有绑定手机号，是否前去绑定？',
											success: (res)=> {
												if (res.confirm) {
													uni.navigateTo({
														url:'/pages/user/bind'
													})
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										});
									}
								}else{
									uni.showModal({
										title: '登录',
										content: '请先登录！',
										confirmText:'去登录',
										success: function (res) {
											if (res.confirm) {
												uni.navigateTo({
													url:'/pages/user/login'
												})
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
								}
							}else{
								if(user){
									this.selIdx = idx;
									var data={};
									data['index']=idx;
									data['path']=this.list[idx]['pagePath']
									this.$emit("clickTab", data)
								}else{
									uni.showModal({
										title: '登录',
										content: '请先登录！',
										confirmText:'去登录',
										success: function (res) {
											if (res.confirm) {
												uni.navigateTo({
													url:'/pages/user/login'
												})
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
								}
							}  
            }
        }
    }
</script>

<style lang="scss">
    .tabbar-box {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 90;
        width: 750rpx;
        height: 160rpx;
    }
	    .tabbar-box-pos{ position:relative;width:750rpx;height: 160rpx;}
		.publish{position: fixed;width: 120rpx;height: 160rpx;left: 375rpx;margin-left: -60rpx;bottom: 0;z-index: 99;}
		.icon-box {
			width: 120rpx;
			height:160rpx;	
			align-items: center; 
			display: flex;
		}
		.centerImg{
			width: 120rpx;
			 height: 120rpx;
			 background:#000000;
			 border-radius: 50%;
			 opacity:1
		}
	
    .menu-list {
		z-index: 90;
        display: flex;
        justify-content: space-around;
        text-align: center;
        font-size: 28rpx;
        width: 750rpx;
        height: 100rpx;
		overflow: hidden;
        align-items: center;
		    flex-direction: row;
				position: fixed;
				bottom: 0;
				left: 0;
				background-color: #000;
        .item {
            flex: 1;
            display: flex;
            flex-direction: column;
			background:#000000;
            align-items: center;
            height: 100rpx;
            box-sizing: border-box;

            height: 80rpx;
            font-size: 22rpx;
            color: #757575;
			position:relative;
			.message_count{
				position: absolute;
				display: block;
				right: 20rpx;
				top:0;
				background: #ff0033;
				color:#fff;
				height:30rpx; 
				width:30rpx;
				text-align: center;
				border-radius: 50%;
				font-size: 20rpx;
				line-height: 30rpx;
				z-index: 100;
			}
            image {
                width: 40rpx;
                height: 40rpx;
            }

            .icon-box {
                width: 40rpx;
                height: 40rpx;
                text-align: center;
                display: flex;
                justify-content: space-around;
                position: relative;
            }
			.iconfill{ font-size:22rpx;}
            .big {
                .icon-box {
					width: 120rpx;
					height:160rpx;
					
					image {
					   width: 120rpx;
					    height: 120rpx;
						background:#000000;
					    border-radius: 50%;
						 top:0;
						 left:0;
					}
                }
				text{display:none}
            }
        }
	
	.scolor{ color:#999999}
	.ncolor{color: #666;}
    }
</style>
