<template>
  <div class="chapter_img_box">
    <div class="img_main_box">
      <ul class="img_ul">
        <li class="img_li" v-for="(item, index) in showFileList" :key="index">
          <div class="content_box" v-if="item.status !== 2">
            <img class="img" :src="item.url" alt="">
            <div :class="{img_txtMask_box: true, img_bs_tigstxt: item.color}">
              <div class="l_txt">{{item.name}}</div>
              <div class="r_txt">{{countStatusFun(item.status)}}</div>
            </div>
            <div class="img_btn_box">
              <span class="el-icon-search" @click="handlePictureCardPreview(item)"></span>
              <span class="el-icon-delete" @click="beforeRemove(item)"></span>
            </div>
          </div>
          <div class="progress_box" v-else>
            <el-progress type="circle" :percentage="item.progress"></el-progress>
          </div>
        </li>
        <li class="upload_box" v-show="limitImgNum === 1 && showFileList.length === 1 ? fasle : true">
          <el-upload
            ref="uploadBox"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :http-request="fnUploadRequest"
            :file-list="fileList"
            :show-file-list="false"
            :limit="limitImgNum"
            :on-exceed="handleExceed"
            :accept="accept"
            :auto-upload="autoUpload"
            :disabled="isDisable"
            :on-change="onChanage"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            action=""
            list-type="picture-card"
            multiple
            :class="{ hide: hideUploadAdd }"
          >
            <i class="el-icon-plus" />
            <div class="el-upload__tip" style="color: #ff4949;" slot="tip" v-if="!id && typeIdStr ==='chapterId'">暂不能添加图片，请先保存信息</div>
          </el-upload>
        </li>
      </ul>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img :src="dialogImageUrl" width="100%" alt="" />
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      :pageSizes="[15, 25, 35, 50]"
      @pagination="getPaginaList"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'UploadImgs',
  props: {
    open: {
      type: Boolean,
      default: true
    },
    typeIdStr: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    isShowUpload: {
      type: Boolean,
      default: true
    },
    limitImgNum: {
      // 限制图片上传个数
      type: Number,
      default: null
    },
    getFileList: {
      // 获取的图片列表
      type: Array,
      default: () => []
    },
    accept: {
      type: String,
      default: 'txt'
    },
    imgW: {
      type: Number,
      default: null
    },
    imgH: {
      type: Number,
      default: null
    },
    size: {
      type: Number,
      default: null
    },
    sizeType: {
      type: String,
      default: 'KB'
    },
    // 限制图片最大宽度
    limitImgW: {
      type: Number,
      default: null
    },
    limitImgH: {
      type: Number,
      default: null
    },
    isDisable: {
      type: Boolean,
      default: false
    },
    beforeRemoveFun: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      fileList: [],
      showFileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      suffixType: null,
      nativeImg: {}, // 本地预览图片
      optionsStatus: [
        {
          value: 1,
          label: '待上传'
        },
        {
          value: 2,
          label: '上传中'
        },
        {
          value: 3,
          label: '上传成功'
        },
        {
          value: 4,
          label: '上传失败'
        }
      ],
      total: 0,
      pageSize: 15,
      pageIndex: 1
    }
  },
  computed: {
    hideUploadAdd() {
      return !this.isShowUpload || this.limitImgNum ? this.fileList.length >= this.limitImgNum : false
    },
    ...mapState('user' ,{
      dataDesKey: 'dataDesKey'
    })
  },
  watch: {
    open(val) {
      this.showFileList = []
      if (!val) {
        this.pageSize = 15
        this.pageIndex = 1
        this.total = 0
      }
    },
    fileList(e) {
      this.sortFileList(e)
      this.$emit('change', e)
    },
    getFileList(val) {
      this.fileList = val
    }
  },
  mounted() {

  },
  methods: {
    getPaginaList() {
      this.sortFileList(this.fileList)
    },
    async sortFileList(e) {
      this.total = e.length
      let arr = e.filter(i => i[this.typeIdStr] === this.id)
      let sortArr = arr.sort((a, b) => a.sort - b.sort)
      let selectArr = sortArr.filter((y, oy) => (this.pageSize * ( this.pageIndex - 1 ))  <= oy && oy < this.pageSize * this.pageIndex)
      let newArr = []
      for(let r of selectArr) {
        if (!this.open) {
          continue
        }
        if (!r.isEncode && r.status !== 1 && !r.raw) {
          let res = await this.cryptoCartoon.decrypt(r.url)
          let urlRoute = this.replaceDomainUrl(r.url)
          r.url = res
          r.urlRoute = urlRoute
          r.isEncode = true
        }
        newArr.push(r)
        this.showFileList = newArr
      }
    },
    countStatusFun(status) {
      let statusData = this.optionsStatus.filter(k => k.value === status)
      return statusData[0].label
    },
    // 上传图片
    async fnUploadRequest(files) {

    },
    async onChanage(file, fileList) {
      let isPush = await this.beforeChange(file)
      if(!isPush) {
        this.fileList = this.fileList.filter(i => i.uid !== file.uid)
        return
      }
      file.status = 1
      file[this.typeIdStr] = this.id
      file.urlRoute = file.uid
      let newArr = this.fileList.filter(i => i[this.typeIdStr] === this.id)
      newArr.push(file)
      let newOtherArr = this.fileList.filter(i => i[this.typeIdStr] !== this.id)
      newArr.forEach(k => {
        if (!k.sort) {
          let str = k.name.replace(/\.[a-zA-Z]*$/, '')
          let numArr = str.split('_')
          if (numArr.length > 1) {
            k.sort = numArr[1] * 1
          } else {
            k.sort = numArr[0] * 1
          }
        }
      })
      let sortArr = newArr.sort((a, b) => a.sort - b.sort)
      this.fileList = [...sortArr, ...newOtherArr]
    },
    delLocalFun(arr) {
      let arrUid = arr.map(i => i.uid)
      let newArr = this.fileList.filter(i => {
        return arrUid.indexOf(i.uid) === -1
      })
      this.fileList = newArr
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 查看图片
    handlePictureCardPreview(file) {
      if (file.url || file.data_url) {
        this.dialogVisible = true
        this.dialogImageUrl = file.url || file.data_url
      } else {
        this.$message.warning('查看图片打开失败')
      }
    },
    // 限制上传图片个数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制上传 ${this.limitImgNum} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file) {
      this.$confirm('此操作将删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (!this.beforeRemoveFun || typeof this.beforeRemoveFun !== 'function') {
          return
        }
        if (file.status === 1 || file.urlRoute.includes('static/nocpt.png')) {//本地图片或者默认图
            this.fileList = this.fileList.filter(i => i.uid !== file.uid)
        } else {
          this.beforeRemoveFun(file)
        }
      })
      return false
    },
    async beforeChange(file) {
      let isPush = true
      let isSize = true
      if (this.sizeType === 'MB') {
        isSize = this.size ? file.size / 1024 / 1024 < this.size : true
      } else if (this.sizeType === 'KB') {
        isSize = this.size ? file.size / 1024 < this.size : true
      }
      if (!isSize) {
        this.$message.error(`上传大小不能超过${this.size}${this.sizeType}`)
        isPush = false
      }
      if (this.limitImgW && this.limitImgH) {
        // 限制尺寸
        await new Promise((resolve, reject) => {
          const width = this.limitImgW
          const height = this.limitImgH
          const _URL = window.URL || window.webkitURL
          const img = new Image()
          img.onload = () => {
            const valid = img.width <= width && img.height <= height
            valid ? resolve() : reject()
          }
          img.src = _URL.createObjectURL(file)
        }).then(
          () => {
            isPush = true
          },
          () => {
            this.$message.error(`图片尺寸限制最大为${this.limitImgW} x ${this.limitImgH}`)
            isPush = false
          }
        )
      }
      return isPush
    },
    beforeUpload(file) {
      let isSize = true
      if (this.sizeType === 'MB') {
        isSize = this.size ? file.size / 1024 / 1024 < this.size : true
      } else if (this.sizeType === 'KB') {
        isSize = this.size ? file.size / 1024 < this.size : true
      }
      if (!isSize) {
        this.$message.error(`上传大小不能超过${this.size}${this.sizeType}`)
        return false
      }
      if (this.limitImgW && this.limitImgH) {
        // 限制尺寸
        const isLimtImg = new Promise((resolve, reject) => {
          const width = this.limitImgW
          const height = this.limitImgH
          const _URL = window.URL || window.webkitURL
          const img = new Image()
          img.onload = () => {
            const valid = img.width <= width && img.height <= height
            valid ? resolve() : reject()
          }
          img.src = _URL.createObjectURL(file)
        }).then(
          () => {
            return file
          },
          () => {
            this.$message.error(`图片尺寸限制最大为${this.limitImgW} x ${this.limitImgH}`)
            return Promise.reject()
          }
        )
        // isLimtImg.then(res => {
        //   this.fileList.push({ url: '', percentage: 0, status: 'pend', uid: file.uid })
        // })
        return isLimtImg
      }
    }
  }
}
</script>
<style lang="scss" lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
.el-upload-list__item {
  position: relative;
}
.chapter_img_box {
  .img_main_box {
    .img_ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      .img_li {
        position: relative;
        list-style: none;
        width: 148px;
        height: 148px;
        margin: 0 8px 8px 0;
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        user-select: none;
        cursor: pointer;
        .content_box {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          .img {
            width: 100%;
            height: 100%;
            display: block;
          }
          .img_txtMask_box {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 25px;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            padding: 0 5px;
            z-index: 999;
            width: 100%;
            font-size: 12px;
            .l_txt {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 25px;
              color: #fff;
              text-align: left;
            }
            .r_txt {
              width: 4em;
              margin-left: 5px;
              line-height: 25px;
              color: #fff;
              text-align: right;
            }
          }
          .img_txtMask_box.img_bs_tigstxt {
            .l_txt {
              color: #f56c6c;
            }
            .r_txt {
              color: #f56c6c;
            }
          }
          .img_btn_box {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            background: rgba(0, 0, 0, 0.5);
            cursor: pointer;
            span {
              width: 20px;
              height: 20px;
            }
            span:before {
              font-size: 18px;
              color: #fff;
            }
            span:first-child {
              margin-right: 15px;
            }
          }
        }
        .content_box:hover {
          .img_btn_box {
            height: 100%;
          }
        }
        .progress_box {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .upload_box {
        list-style: none;
      }
    }

  }
}
</style>
