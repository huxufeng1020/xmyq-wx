<template>
  <view class="imglistbx">
		<block v-if="type=='avatar'">
			<!-- 上传头像（不需要带cdnUrl） -->
			<view class="imglistItem" @click="uploadImg('avatar')" style="border-radius: 50%;">
				<view class="itemImg uploadControl" style="border-radius: 50%;">
					<block v-if="imgList.length>0">
						<view class="uploadimg_list" v-for="(item,index) in imgList" :key='index' style="border-radius: 50%;">
							<image :src="item" class="itemImg" style="border-radius: 50%;" mode="aspectFill"></image>
						</view>
					</block>
					<block v-else>
						<view class="uploadImg_btn">
							<image src="../../static/avatar.png" mode="aspectFill"></image>
							<view class="flex_layout justify-center"><image src="../../static/xj.png" mode="aspectFill"></image></view>
						</view>
					</block>
				</view>
			</view>
		</block>
		<block v-if="type=='back'">
			<!-- 上传控件 -->
			<view class="renewal_back flex_layout justify-center" @click="uploadImg('back')">
				更换背景
			</view>
		</block>
    <!-- <view class="clear"></view> -->
  </view>
</template>

<script>
	import {
		  cdnUrl,
			baseUrl,
			baseApiUrl
		} from '../../config/config.js';
  export default {
    props: {
      //是否显示上传控件
      control: {
        type: Boolean,
        default: true
      },
      //是否显示上删除按钮
      deleteBtn: {
        type: Boolean,
        default: true
      },
      //行数量 
      columnNum: {
        type: [Number, String],
        default: 4
      },
      //album 从相册选图，camera 使用相机
      sourceType: {
        type: Array,
        default: function() {
          return ['camera', 'album']
        }
      },
      //最大上传数量
      maxCount: {
        type: [Number, String],
        default: 1
      },
			//上传数量
			lookNum:{
				type: [Number, String],
				default: 3
			},
      //服务返回回调的图片数组--回填
      mode: {
        type: Array,
        default: function() {
          return []
        }
      },
			type: {
				type:String,
				default: ''
			}
    },
    data() {
      return {
				cdnUrl:cdnUrl,
        imgList: [],
        showList: [],
        showUploadControl: true,
				uploadNum:1
      }
    },
    watch: {
      mode(v) {
        this.init(v)
      },
      control(v) {
        this.showUploadControl = v
      },
			maxCount(v){
				console.log(v);
				this.uploadNum = v
			},
    },
    created() {
      this.init(this.mode)
    },
    methods: {
      init(v) {
        if (this.mode.length != 0) {
          this.imgList = v;
          return
        };
				
        //this.showList = this.imgList;
      },
      // 上传图片
      uploadImg(type) {
				console.log("uploadNum: ",this.uploadNum);
				let userToken = '';
				let auth = this.$db.get("auth");
				userToken = auth.token;
        uni.chooseImage({
          sizeType: ['compressed'],
          sourceType: this.sourceType,
          count: this.uploadNum,
          success: (res) => {
						console.log(res);
						const tempFilePaths = res.tempFilePaths;
						// this.imgList=tempFilePaths.map(item=>{
						// 	return item
						// })
						//this.$emit("chooseFile", this.imgList, tempFilePaths[0]) 
						for(var i=0; i<tempFilePaths.length; i++){
							uni.uploadFile({
								url: cdnUrl + 'api/common/upload?token='+userToken,
								filePath: tempFilePaths[i],
								fileType: 'image',
								name: 'file',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'multipart/form-data',
									'token': userToken
								},
								formData: {},
								success: (uploadFileRes) => {
									var dataimg=JSON.parse(uploadFileRes.data);
									if(type=='avatar'){
										this.imgList=[]
										//上传头像
										this.imgList.push(cdnUrl+dataimg.data.url);
										this.$emit("chooseFileAvatar", dataimg.data.url)
									}else if(type=='back'){
										this.imgList=[]
										this.imgList.push(dataimg.data.url);
										this.$emit("chooseFileBack", this.imgList) 
									}
									
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
							//
						}
						
          }
        });
      },
      //删除图片
      deleteImg(eq) {
				console.log(eq);
        let getUrl = this.handleImg();
        uni.showModal({
          title: '提示',
          content: '您确定删除吗？',
          success: (res)=> {
            if (res.confirm) {
             getUrl.splice(eq, 1);
             this.$emit("imgDelete", getUrl, eq);
             this.isMaxNum();
            }
          }
        });
      },
      // 预览图片
      previewImage(eq) {
        let getUrl = this.handleImg().map(item=>{
					return this.cdnUrl+item
				});
        uni.previewImage({
          current: getUrl[eq],
          urls: getUrl
        })
      },
      //返回需要操作的图片数组
      //如果是回调了则操作回填后的数组 否则操作临时路径的图片数组
      handleImg() {
        return this.imgList
      },
      //判断图片数量是否已经到最大数量
      isMaxNum() {
        if (this.imgList.length >= this.maxCount) {
          this.showUploadControl = false
        } else {
          this.showUploadControl = true
        }
      }
    }
  }
</script>

<style scoped>
  /* 上传  str */
  .imglistbx {
		border-radius: 10px;
		/* box-shadow: 0 0 10px #ccc; */
  }
	.identification_card{position: relative;
    width: 540rpx;
    height: 200rpx;
		background: #f8f8f8;}
  .imglistItem {
    position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
    /* width: 120rpx;
    height: 120rpx; */
		/* background: #f8f8f8; */
  }

  .column3 {
    width: 33.3333%;
    height: 160rpx;
  }

  .column4 {
    width: 25%;
    height: 130rpx;
  }

  .itemImg {
		border-radius: 5px;
    /* margin: 0 auto; */
    display: block;
    border-radius: 10rpx;
		display: flex;
		align-items: center;
  }

  .cancelBtn {
    position: absolute;
    top: -10rpx;
    right: 10rpx;
  }

  /* 上传控件 */
  .uploadControl {
    font-size: 50rpx;
    color: #888;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /*  上传  str end*/
  .clear {
    clear: both;
  }
	.uploadImg_btn{position: relative; width: 160rpx; height: 160rpx;border-radius: 160rpx;}
	.uploadImg_btn view{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-radius: 50%;background: rgba(0, 0, 0, 0.4);z-index: 10;}
	.uploadImg_btn view image{width: 54rpx;height: 42rpx;}
	.uploadImg_btn>image{width: 160rpx; height: 160rpx;border-radius: 160rpx; display: block; margin: 0 auto;}
	.uploadImg_btn text{display: block; color: #999; font-size: 24rpx; margin-top: 20rpx;}
	.uploadimg_list{width: 160rpx; height: 160rpx; border: 1px solid #f0deb0; border-radius: 5px; position: relative;}
	.uploadimg_list image{width: 100%; height: 100%;}
	.deleteIcon{position: absolute; right: -15rpx; top: -15rpx; background: #ccc; width: 30rpx; height: 30rpx; border-radius: 30rpx; font-size: 20rpx; text-align: center; line-height: 30rpx; z-index: 10; color: #999;}
	
	.identification_card .uploadimg_list{width: 100%; height: 100%;}
	.identification_card .itemImg{width: 100%; height: 100%;}
	.identification_card .uploadImg_btn{width: auto; height: auto; display: block;}
	.commonStyle .itemImg{margin: 0;}
	
	.renewal_back{width: 180rpx;height: 58rpx;background: rgba(0, 0, 0, 0.3);color: #eee;font-size: 28rpx;border-radius: 58rpx;}
</style>
