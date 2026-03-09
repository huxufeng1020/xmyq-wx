<template>
	<view>
		<view class="back"></view>
		<view class="header padding-lg" v-if="obj">
			<view class="style">{{obj.reservedate}}</view>
			<view class="style margin-top">{{obj.position}} {{obj.name}}</view>
			<view class="bottom margin-top flex_layout justify-between">
				<view class="style">{{obj.type}} {{obj.reservebegintime}}-{{obj.reserveendtime}}</view>
				<view class="right flex align-end">
					<view class="text margin-right-sm">定金</view>
					<view class="num">￥{{obj.deposits}}</view>
				</view>
			</view>
		</view>
		<view class="padding">
			<view class="info padding-lr">
				<view class="item padding-tb solid-bottom flex_layout justify-between">
					<view class="name">姓名</view>
					<view class="right flex_layout"><input type="text" v-model="name" placeholder="请输入您的姓名"></view>
				</view>
				<view class="item padding-tb solid-bottom flex_layout justify-between">
					<view class="name">性别</view>
					<view class="right flex_layout">
						<radio-group @change="radioChange">
							<view class="flex_layout">
								<label class="flex_layout margin-right-xl">
									<view>
										<radio value="1" style="transform:scale(0.8)" :checked="sexdata==1" />
									</view>
									<view class="name margin-left-xs">男</view>
								</label>
								<label class="flex_layout">
									<view>
										<radio value="0" style="transform:scale(0.8)" :checked="sexdata==0" />
									</view>
									<view class="name margin-left-xs">女</view>
								</label>
							</view>
						</radio-group>
					</view>
				</view>
				<view class="item padding-tb solid-bottom flex_layout justify-between">
					<view class="name">联系电话</view>
					<view class="right flex_layout"><input type="number" v-model="mobile" placeholder="请输入您的手机号"></view>
				</view>
				<view class="item solid-bottom">
					<view class="right flex_layout">
						<picker :range="adultNum" :value="adultIndex" @change="adultChange">
							<view class="flex_layout justify-between padding-tb">
								<view class="name">成人人数</view>
								<view class="right flex_layout">{{adultNumnumber}}<image src="../../static/right.png"></image></view>
							</view>
						</picker>
					</view>
				</view>
				<view class="item solid-bottom">
					<view class="right flex_layout">
						<picker :range="childrenNum" :value="childrenIndex" @change="childrenChange">
							<view class="flex_layout justify-between padding-tb">
								<view class="name">儿童人数</view>
								<view class="right flex_layout">{{childNum}}<image src="../../static/right.png"></image></view>
							</view>
						</picker>
					</view>
				</view>
				<view class="item solid-bottom">
					<view class="right flex_layout">
						<picker :range="timeList" :value="timeIndex" @change="timeChange">
							<view class="flex_layout justify-between padding-tb">
								<view class="name">到店时间</view>
								<view class="right flex_layout">{{arrivetime}}<image src="../../static/right.png"></image></view>
							</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="info padding-lr margin-top">
				<view class="item">
					<view class="top padding-tb flex_layout justify-between solid-bottom" @click="develop(1)">
						<view class="name">您有什么食物忌口吗？</view>
						<view class="icon" :class="show1?'down':''"><image src="../../static/right.png"></image></view>
					</view>
					<view class="textarea" :class="show1?'develop':'shrink'">
						<textarea v-model="avoidfood" placeholder="请输入"></textarea>
					</view>
				</view>
				<view class="item">
					<view class="top padding-tb flex_layout justify-between solid-bottom" @click="develop(2)">
						<view class="name">您需要什么特殊节日准备吗？</view>
						<view class="icon flex_layout" :class="show2?'down':''"><image src="../../static/right.png"></image></view>
					</view>
					<view class="textarea" :class="show2?'develop1':'shrink'">
						<checkbox-group v-if="show2" @change="specialChange">
							<label class="checkbox_label padding-tb-xs" v-for="(item,index) in specialdateList" :key="index">
								<checkbox :value="index.toString()" style="transform:scale(0.7)" /><text class="margin-left-xs">{{item}}</text>
							</label>
						</checkbox-group>
						<textarea v-model="specialdatemark" class="margin-top-sm" placeholder="请输入"></textarea>
					</view>
				</view>
				<view class="item">
					<view class="top padding-tb flex_layout justify-between solid-bottom" @click="develop(3)">
						<view class="name">如果还有其他需要我们关照之外请留言。</view>
						<view class="icon" :class="show3?'down':''"><image src="../../static/right.png"></image></view>
					</view>
					<view class="textarea" :class="show3?'develop':'shrink'">
						<textarea v-model="remark" placeholder="请输入"></textarea>
					</view>
				</view>
			</view>
			<view class="point_out margin-top padding">
				<view class="name">{{title}}：</view>
				<view class="text margin-top-sm">
					<rich-text :nodes="content"></rich-text>
				</view>
			</view>
		</view>
		<view style="height: 130rpx;"></view>
		<view class="next_step padding-lr padding-tb-sm flex_layout justify-around">
			<button @click="backBtn">上一步</button>
			<button @click="reserveBegin">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show1:false,
				show2:false,
				show3:false,
				sexdata:1,
			    // 成人人数可选 1～20 人（原为 1～9，已按需求扩展）
			    adultNum: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				adultIndex: 9,   // 默认选第 10 项，即 10 人（下标从 0 开始）
				adultNumnumber: 10,   // 默认显示 10 人
				childrenNum:[0,1,2,3,4,5,6,7,8,9],
				childrenIndex:0,
				childNum:0,
				timeList:[],
				timeIndex:0,
				arrivetime:'',
				specialdateList:[],
				specialdatedata:[],
				avoidfood:'',
				specialdatemark:'',
				remark:'',
				name:'',
				mobile:'',
				obj:'',
				title:'',
				content:''
			}
		},
		onLoad(options) {
			this.specialdatedataData()
			this.detailPoint()
			this.orderUser()
			let obj=JSON.parse(options.obj)
			this.obj=obj
			let date1=obj.reservedate+' '+obj.reservebegintime
			console.log(date1);
			let date2=obj.reservedate+' '+obj.reserveendtime
			this.getDateArray(date1,date2)
			uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: "#c2b183" })
		},
		methods: {
			getDateArray(date1,date2) {
				let start = new Date(date1);
				let end = new Date(date2);
				let startDate = start.getTime();
				let endDate = end.getTime();
				const space = 30 * 60 * 1000;
				let mod = endDate - startDate;
				let dateArray = [];
				while (mod > space) {
					let d = new Date();
					d.setTime(startDate + space);
					dateArray.push(d);
					mod = mod - space;
					startDate = startDate + space;
				}
				dateArray.unshift(new Date(start.getTime()));
				dateArray.push(new Date(end.getTime()));
				let a = dateArray.map(item => {
					let Minutes=item.getMinutes()<10?'0'+item.getMinutes():item.getMinutes();
					item = item.getHours() + ":" + Minutes;
					return item;
				});
				//console.log(a);
				this.timeList=a
				this.arrivetime=a[0]
			},
			//特别提示
			detailPoint(){
				this.$api.detail(
				{id:2},
				data => {
					if(data.code==1){
						if(data.data){
							this.title=data.data.title
							this.content=data.data.content
						}
						
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			specialdatedataData(){
				this.$api.specialdatedata(
				{},
				data => {
					if(data.code==1){
						this.specialdateList=data.data
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			orderUser(){
				this.$api.orderUser(
				{},
				data => {
					if(data.code==1){
						let user=uni.getStorageSync('user')
						let res=data.data
						if(res.length==0){
							if(user){
								this.sexdata=user.gender?user.gender:1
								this.name=user.nickname   
							}
							
						}else{
							this.mobile=res.mobile
							this.sexdata=res.sexdata
							this.name=res.name
							
						}
						
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			//单选性别
			radioChange(e){
				this.sexdata=e.detail.value
			},
			adultChange(e){
				let index=e.detail.value;
				this.adultIndex=index
				this.adultNumnumber=this.adultNum[index]
			},
			childrenChange(e){
				let index=e.detail.value;
				this.childrenIndex=index
				this.childNum=this.childrenNum[index]
			},
			timeChange(e){
				let index=e.detail.value;
				this.timeIndex=index
				this.arrivetime=this.timeList[index]
			},
			develop(index){
				if(index==1){
					this.show1=!this.show1
				}else if(index==2){
					this.show2=!this.show2
				}else{
					this.show3=!this.show3
				}
			},
			specialChange(e){
				this.specialdatedata=e.detail.value
			},
			backBtn(){
				uni.navigateBack()
			},
			reserveBegin(){
				if(this.name==''){
					uni.showToast({
						title:'请输入您的姓名',
						icon:'none'
					})
					return false;
				}
				if(this.mobile==''){
					uni.showToast({
						title:'请输入您的手机号',
						icon:'none'
					})
					return false;
				}
				let obj={};
				obj['name']=this.name
				obj['sexdata']=this.sexdata    //性别（1：男，0：女）
				obj['mobile']=this.mobile
				obj['table_id']=this.obj.table_id
				obj['type']=this.obj.type
				obj['reservedate']=this.obj.reservedate
				obj['reservebegintime']=this.obj.reservebegintime
				obj['reserveendtime']=this.obj.reserveendtime
				obj['adultNumnumber']=this.adultNumnumber
				obj['childNum']=this.childNum
				obj['arrivetime']=this.arrivetime
				obj['avoidfood']=this.avoidfood
				obj['specialdatedata']=this.specialdatedata.toString()
				obj['specialdatemark']=this.specialdatemark
				obj['remark']=this.remark
				this.$api.reserveBegin(
				obj,
				data => {
					if(data.code==1){
						uni.showLoading()
						setTimeout(()=>{
							uni.hideLoading()
							uni.redirectTo({
								url:'/pages/advance/method?id='+data.data.id
							})
						},500)
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{background: #f2f2f2;}
	.back{background: #c2b183;height: 250rpx;border-radius: 0 0 50px 50px;}
	.header{
		background: #b79f5f;border-radius: 10px;width: 690rpx;margin: -210rpx auto 0 auto;
		.style{color: #fff;font-size: 30rpx;line-height: 1;}
		.bottom{
			.text{color: #997e45;font-size: 24rpx;}
			.num{color: #fff;font-size: 40rpx;}
		}
	}
	.info{
		background: #fff;border-radius: 10px;
		.item{
			.name{color: #333;font-size: 30rpx;}
			.right{
				color: #333;font-size: 30rpx;
				picker{width: 100%;}
				input{display: block;width: 400rpx;color: #333;font-size: 30rpx;text-align: right;}
				image{display: block;width: 30rpx;height: 30rpx;margin-left: 20rpx;}
			}
			.top{
				.icon{
					transition:all 0.5s;
					image{display: block;width: 30rpx;height: 30rpx;margin-left: 20rpx;}
				}
				.down{transform:rotate(90deg);margin-top: -20rpx;}
			}
			.textarea{
				transition:all 0.5s;
				textarea{color: #333;font-size: 30rpx;display: block;width: 100%;line-height: 1.8;}
			}
			.develop{
				height: 180rpx;
				textarea{height: 180rpx;}
			}
			.develop1{
				height: 400rpx;
				textarea{height: 180rpx;}
			}
			.checkbox_label{width: 33.33%;display: inline-block;}
			.shrink{
				height: 0;
				textarea{height: 0;}
			}
		}
	}
	.point_out{
		background: #fff;
		border-radius: 10px;
		.name{color: #b29a5c;font-size: 30rpx;}
		.text{rich-text{color: #999;font-size: 30rpx;line-height: 1.8;}}
	}
	.next_step{
		position: fixed;left: 0;bottom: 0;width: 100%;background: #fff;
		button{display: block;width: 220rpx;height: 75rpx;line-height: 75rpx;background: #b29a5c;color: #fff;font-size: 30rpx;border-radius: 5px;}
	}
</style>
