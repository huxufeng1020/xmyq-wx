<template>
	<view>
		<view class="content_date">
			<ren-calendar ref='ren' :markDays='markDays' :loading="loading" :open="open" :isWorkArray="isWorkArray" :disabledAfter='true' @toggle="toggle" @clockMonth="clockMonth" @onDayClick='onDayClick' @onMarkDays="onMarkDays"></ren-calendar>
			<!-- <view class="change">选中日期：{{reservedate}}</view> -->
		</view>
		<view class="select_shop">
			<view class="company_item padding" @click="showCompany">
				<view class="company_info flex_layout justify-between">
					<view class="company_img">
						<image :src="shopAvatar" mode="aspectFill"></image>
					</view>
					<view class="margin-left-sm company_detail flex_layout justify-end">
						<view class="company_name">{{shopName}}</view>
					  <view class="right_more margin-left-sm"><image src="../../static/right.png"></image></view>
					</view>
				</view>
			</view>
		</view>
		<view class="book_dinner padding-lr flex_layout justify-between margin-top">
			<view class="item padding-tb" :class="tab==index?'active':''" v-for="(item,index) in typesList" :key="index" :style="{width:typesList.length==2?'50%':'auto'}" @click="dinner(index)">
				<view class="top">{{item.name}}</view>
				<view class="bottom margin-top-xs">{{item.begintime}} - {{item.endtime}}</view>
			</view>
			<!-- <view class="line"></view> -->
			<!-- <view class="item padding" :class="tab==2?'active':''" @click="dinner(2)">
				<view class="top">晚餐</view>
				<view class="bottom margin-top-xs">18:00 - 21:00</view>
			</view> -->
		</view>
		<view class="hall padding">
			<block v-if="markList.length>0">
				<view class="item" v-for="(item,index) in markList" :key="index" :class="index==itemindex?'active':''" @click="detail(index,item.id,item.rstatus,item.deposits,item.position,item.name)">
					<view class="img"><image :src="item.coverimage" mode="aspectFill"></image></view>
					<view class="bottom padding-lr padding-tb-sm flex_layout justify-between">
						<view class="flex_layout">
							<view class="name">{{item.position}} {{item.name}}</view>
							<view class="tab margin-left-sm flex_layout justify-center">{{item.depositdata==1?'需定金':'无定金'}}</view>
						</view>
						<view class="btn" :class="item.rstatus==1?'btn1':'btn2'"><button>{{item.rstatus==1?'可约定':item.rstatus==2?'已约定':'不可预约'}}</button></view>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="nodata" v-if="loading">暂无数据~~</view>
			</block>
		</view>
		<view class="point_out padding">
			<view class="name">{{title}}：</view>
			<view class="text margin-top-xs">
				<rich-text :nodes="content"></rich-text>
			</view>
		</view>
		<view style="height: 150rpx;"></view>
		<view class="next_step padding-lr padding-tb-sm" :class="itemindex==-1?'nostep':''" @click="nextStep"><button>下一步</button></view>
		<view class="zzc1" @click="hideOpen" v-if="monthOpen"></view>
		<view class="zzc2" @click="hideCompany" v-if="companyStatus"></view>
		<view class="relevance_company padding-top" v-if="companyStatus">
			<view class="company_content">
				<view class="common_text padding-lr padding-bottom flex_layout justify-between" @click="hideCompany">
					<view>选择分店</view>
					<image src="../../static/uplode.png" mode=""></image>
				</view>
				<view class="company_list padding-lr">
					<view class="padding-tb-sm" v-for="(item,index) in list" :key="index">
						<view class="company_item flex_layout justify-between padding" :style="{'border-color':item.isdefault==2?color:'#f2f2f2'}" @click="homepage(index,item.id)">
							<view class="company_info flex_layout">
								<view class="company_img"><image :src="item.image" mode="aspectFill"></image></view>
								<view class="margin-left-sm company_detail">
									<view class="company_name">{{item.name}}</view>
									<view class="company_other">{{item.address}}</view>
									<view class="company_other">{{item.starttime_text}}-{{item.endtime_text}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="addcard_btn padding" @click="addCard"><button>+新增名片</button></view> -->
			</view>
		</view>
	</view>
</template>

<script>
  import RenCalendar from '@/components/ren-calendar/ren-calendar.vue'
	export default {
		components:{
				RenCalendar
		},
		data() {
			return {
				reservedate:'',
        markDays:[],     //有预约的日期（日期下边带点）
				isWorkArray:[],    //可以预约的日期
				tab:0,
				loading:false,
				monthOpen:false,
				itemindex:-1,
				open:false,
				companyStatus:false,
				color:'#b29a5c',
				list:[],
				shopAvatar:'',
				shopName:'',
				shop_id:'',
				typesList:[],
				type:'',
				begintime:'',
				endtime:'',
				markList:[],
				table_id:'',
				deposits:0,
				position:'',
				name:'',
				title:'预约/退订规则说明',
				content:'',
				arrangeDatas:[]
			}
		},
		onReady() {
      
		},
		onShow() {
			this.reservedate=this.getToday()
			this.shoplists()
			//this.detailPoint()
		},
		methods: {
			formatNum(num) {
			    let res = Number(num);
			    return res < 10 ? '0' + res : res;
			},
			getToday() {
			    let date = new Date();
			    let y = date.getFullYear();
			    let m = date.getMonth();
			    let d = date.getDate();
			    let week = new Date().getDay();
			    let weekText = ['日', '一', '二', '三', '四', '五', '六'];
			    let formatWeek = '星期' + weekText[week];
			    let today = y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d)
			    return today;
			},
			//特别提示
			detailPoint(){
				this.$api.detail(
				{id:1},
				data => {
					if(data.code==1){
						this.title=data.data.title
						this.content=data.data.content
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			shopTypes(){
				this.$api.shopTypes(
				{shop_id:this.shop_id},
				data => {
					if(data.code==1){
						this.typesList=data.data
						this.type=this.typesList[0].name
						this.begintime=this.typesList[0].begintime
						this.endtime=this.typesList[0].endtime
						let date=this.getToday()
						this.reserveData(date)
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			shoplists(){
				this.$api.shoplists(
				{},
				data => {
					if(data.code==1){
						this.list=data.data
						this.shopAvatar=this.list[0].image
						this.shopName=this.list[0].name
						this.shop_id=this.list[0].id
						this.content=this.list[0].notice
						this.shopTypes()
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			reserveData(date){
				let user=uni.getStorageSync('user')
				this.$api.reserveData(
				{
					shop_id:this.shop_id,
					date:date,
					type:this.type,
					begintime:this.begintime,
					endtime:this.endtime,
					user_id:user?user.id:0,
					page:1,
					limit:10
				},
				data => {
					if(data.code==1){
						this.loading=true
						this.markDays=data.data.arrangeDates     //有预约的日期（日期下边带点）
						this.isWorkArray=data.data.dates         //可以预约的日期
						this.arrangeDatas=data.data.arrangeDatas    //已预约信息
						this.reservedate=this.isWorkArray[0]
						if(this.isWorkArray.length>0){
							if(this.getToday()==this.isWorkArray[0]){
								//代表可预约日期和当前日期一致
								this.markList=data.data.lists
							}else{
								let date=this.isWorkArray[0]
								this.markList=[]
								this.reserveData1(date)
							}
						}
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			reserveData1(date){
				let user=uni.getStorageSync('user')
				this.loading=false
				this.$api.reserveData(
				{
					shop_id:this.shop_id,
					date:date,
					type:this.type,
					begintime:this.begintime,
					endtime:this.endtime,
					user_id:user?user.id:0,
					page:1,
					limit:10
				},
				data => {
					if(data.code==1){
						this.loading=true
						//this.markDays=data.data.arrangeDates     //有预约的日期（日期下边带点）
						//this.isWorkArray=data.data.dates         //可以预约的日期
						this.markList=data.data.lists
					}else{
						this.$common.errorToShow(data.msg);
					}
				})
			},
			dinner(index){
				this.tab=index
				this.type=this.typesList[index].name
				this.begintime=this.typesList[index].begintime
				this.endtime=this.typesList[index].endtime
				this.markList=[]
				this.itemindex=-1
				this.reserveData1(this.reservedate)
			},
			//切换月份事件
			clockMonth(e){
				let date=e+'-01'
				console.log(date);
				this.reserveData(date)
			},
			//过去预约信息
			onMarkDays(date){
				let infoList=[]
				for(var i=0;i<this.arrangeDatas.length;i++){
					if(this.arrangeDatas[i].date==date){
						infoList=this.arrangeDatas[i].list.map(item=>{
							return item.type+' '+item.table.position+item.table.name
						})
					}
				}
				let infoString=infoList.toString()
				uni.showModal({
					title: '提示',
					content: date+'您的预约信息'+'：'+infoString,
					showCancel:false,
					confirmText:'我知道了',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//点击日期事件
			onDayClick(data){
				this.reservedate = data.date;
				this.markList=[]
				this.itemindex=-1
				this.reserveData1(this.reservedate)
			},
			toggle(e){
				this.monthOpen=e
			},
			hideOpen(){
				this.monthOpen=false
				this.$refs.ren.toggle()
			},
			detail(index,id,status,deposits,position,name){
				if(status==1){
					this.itemindex=index
					this.table_id=id
					this.deposits=deposits
					this.position=position
					this.name=name
				}else if(status==2){
					this.itemindex=-1
					let id=this.markList[index].order_id
					uni.navigateTo({
						url:'/pages/user/orderDetail?id='+id
					})
				}else{
					this.itemindex=-1
					uni.showToast({
						title:'已不可预约！',
						icon:'none'
					})
				}
			},
			showCompany(){
				this.companyStatus=true
			},
			hideCompany(){
				this.companyStatus=false
			},
			homepage(index,id){
				for(var i=0;i<this.list.length;i++){
					this.list[i].isdefault=1
				}
				this.shopAvatar=this.list[index].image
				this.shopName=this.list[index].name
				this.content=this.list[index].notice
				this.shop_id=id
				this.list[index].isdefault=2
				this.hideCompany()
				this.tab=0
				this.markList=[]
				this.itemindex=-1
				this.shopTypes()
			},
			nextStep(){
				if(this.itemindex==-1){
					uni.showToast({
						title:'请先选择餐厅',
						icon:'none'
					})
					return false;
				}else{
					let user=uni.getStorageSync('user')
					if(user){
						let obj={
							table_id:this.table_id,
							type:this.type,
							reservedate:this.reservedate,       //预定日期
							reservebegintime:this.begintime,
							reserveendtime:this.endtime,
							deposits:this.deposits,         //定金
							position:this.position,
							name:this.name
						}
						let obj1=JSON.stringify(obj)
						uni.navigateTo({
							url:'/pages/advance/refer?obj='+obj1
						})
					}else{
						this.$common.normalToShow('该功能需要登录！',()=>{
							uni.navigateTo({
								url:'/pages/user/login'
							})
						})
					}
					
				}
			}
		}
	}
</script>

<style lang="scss">
  page{background-color: #f2f2f2;}
	button::after{display: none;}
	.zzc1{position: fixed;left: 0;top: 0;width: 100%;height: 100%;z-index: 99;background: rgba(0,0,0,0.5);}
	.zzc2{position: fixed;left: 0;top: 0;width: 100%;height: 100%;z-index: 200;background: rgba(0,0,0,0.5);}
	.content_date{position: relative;z-index: 100;}
	.book_dinner{
		background: #fff;
		position: relative;
		.item{
			text-align: center;
			.top{color: #666;font-size: 30rpx;}
			.bottom{color: #999;font-size: 28rpx;}
		}
		.active{
			position: relative;
			.top{color: #b29a5c;font-size: 30rpx;}
			.bottom{color: #b29a5c;font-size: 28rpx;}
		}
		.active::before{content: ' ';width: 50%;position: absolute;height: 3px;background: #b29a5c;left: 25%;bottom: 0;}
		.line{width: 1px;background: #eee;position: absolute;left: 50%;top: 15%;height: 70%;}
	}
	.hall{
		.item{
			margin-top: 30rpx;
			background: #fff;border-radius: 10px;overflow: hidden;border: 2px solid transparent;
		  .img{
				image{display: block;width: 100%;height: 260rpx;}
			}
			.bottom{
				.name{color: #333;font-size: 30rpx;}
				.tab{background: #e4d7c4;color: #b29a5c;width: 100rpx;height: 46rpx;font-size: 26rpx;border-radius: 5px;}
				.btn button{width: 120rpx;height: 52rpx;line-height: 52rpx;color: #fff;font-size: 28rpx;margin: 0;padding: 0;border-radius: 5px;}
				.btn1 button{background: #b29a5c;}
				.btn2 button{background: #ccc;}
			}
		}
		.item:first-child{margin-top: 0;}
		.active{border: 2px solid #b29a5c;}
	}
	.point_out{
		.name{color: #b29a5c;font-size: 30rpx;}
		.text{
			rich-text{color: #999;font-size: 30rpx;line-height: 1.8;}
		}
	}
	.select_shop{
		background: #fff;
		margin-top: 30rpx;
	}
	.next_step{
		position: fixed;
		left: 0;
		/*#ifdef MP*/
		bottom: 0;
		/*#endif*/
		/*#ifndef MP*/
		bottom: 90rpx;
		/*#endif*/
		width: 100%;
		background: #fff;
		z-index: 50;
		button{display: block;width: 100%;height: 86rpx;line-height: 86rpx;background: #b29a5c;color: #fff;font-size: 30rpx;border-radius: 5px;}
	}
	.nostep{
		button{background: #ccc;}
	}
	/* #ifdef H5 */
	.relevance_company{position: fixed;left: 0;bottom: 50px;z-index: 201;background: #fff;width: 100%;border-radius: 10px 10px 0 0;}
	/* #endif */
	/* #ifndef H5 */
	.relevance_company{position: fixed;left: 0;bottom: 0;z-index: 201;background: #fff;width: 100%;border-radius: 10px 10px 0 0;}
	/* #endif */
	.company_list{max-height: 500rpx;overflow-y: auto}
	.company_img image{width: 100rpx;height: 100rpx;border-radius: 10rpx;}
	.company_detail{width: 500rpx;}
	.company_name{color: #333;font-size: 30rpx;max-width: 500rpx;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;line-height: 1.8;}
	.company_other{color: #999;font-size: 24rpx;max-width: 500rpx;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;line-height: 1.8;}
	.right_more image{display: block;width: 30rpx;height: 30rpx;}
	.add_text image{display: block;width: 30rpx;height: 30rpx;}
	.add_text text{display: block;color: #666;font-size: 28rpx;}
	.common_text view{color: #333;font-size: 30rpx;}
	.common_text image{width: 30rpx;height: 30rpx;transform: rotate(45deg);display: block;}
	.company_item{border-radius: 10px;border: 1px solid #f2f2f2;}
	.company_item:first-child{margin: 0;}
	.status{background: #fe7524;color: #fff;font-size: 18rpx;padding: 8rpx 10rpx;margin-top: 10rpx;display: inline-block;border-radius: 10rpx;line-height: 1;} 
	
	.wechat_content{position: fixed; width: 80%; left: 10%; top: 50%; transform: translateY(-50%); background: #fff; border-radius: 10px; z-index: 100;}
	.wechat_img{border-radius: 10px;background: #fff;}
	.wechat_img view{color: #999999;font-size: 28rpx;margin-top: 30rpx;text-align: center;}
	.wechat_img image{display: block; width: 100%;}
	.wechat_text{padding: 30rpx; text-align: center; font-size: 28rpx; color: #333;}
	.title{font-size: 30rpx;text-align: center;color: #333;}
	.content{font-size: 28rpx;margin-top: 30rpx;color: #333;text-align: center;}
	.addcard_btn button{width: 300rpx;height: 80rpx;line-height: 80rpx;margin: 0;padding: 0;background: #b29a5c;color: #fff;font-size: 30rpx;margin: 0 auto;border-radius: 80rpx;}
	.certificateOp{ font-size: 20rpx; padding:2rpx 6rpx; border-radius:10rpx}
</style>
