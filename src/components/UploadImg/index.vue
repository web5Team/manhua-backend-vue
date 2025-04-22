<template>
  <div>
    <el-upload
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :http-request="fnUploadRequest"
      :file-list="fileList"
      :limit="limitImgNum"
      :on-exceed="handleExceed"
      :accept="accept"
      :on-change="onChagne"
      :disabled="isDisable"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      action=""
      list-type="picture-card"
      multiple
      :class="{ hide: hideUploadAdd }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img :src="dialogImageUrl" width="100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UploadImgs',
  props: {
    urlRoute: {
      type: String,
      default: ''
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
      default: function() {
        return []
      }
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg,image/png'
      // default: 'image/jpeg,image/jpg,image/png,application/pdf'
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
      fileList: [...this.getFileList],
      dialogImageUrl: '',
      dialogVisible: false,
      suffixType: null,
      nativeImg: {} // 本地预览图片
    }
  },
  computed: {
    hideUploadAdd() {
      return !this.isShowUpload || this.limitImgNum ? this.fileList.length >= this.limitImgNum : false
    }
  },
  watch: {
    fileList(n, o) {
      // this.imgFormat()
      this.$emit('change', n)
    },
    getFileList(val, oldVal) {
      let imgArr = []
      if (val.length > 0) {
        imgArr = val
      }
      this.fileList = imgArr
    }
  },
  mounted() {
    // this.imgFormat()
  },
  methods: {
    imgFormat() {
      const imgArrs = []
      this.fileList.forEach(e => {
        // imgArrs.push(e.url)
        const obj = {
          name: e.name,
          url: e.url
        }
        imgArrs.push(obj)
      })
      this.$emit('change', imgArrs)
    },
    // 上传图片
    async fnUploadRequest(files) {
      
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
    async handleChange(files, fileList) {
      // console.log(files)
      // const data = await this.getBase64(files.raw)
      // this.fileList.push(data)
      // console.log(this.fileList)
    },

    // 转换base64
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    async beforeRemove(file) {
      if (!this.beforeRemoveFun || typeof this.beforeRemoveFun !== 'function') {
        return
      }
      const reg = /^(http|https):\/\/\S*/
      if (reg.test(file.urlRoute)) {
        try {
          await this.beforeRemoveFun(file.urlRoute)
        } catch {
          return Promise.reject(false)
        }
      }
    },
    async onChagne(file) {
      let isPush = await this.beforeChange(file)
      if (!isPush) {
        this.fileList = this.fileList.filter(i => i.uid !== file.uid)
        return
      }
      this.fileList.push(file)
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
            isPush = TextTrackCue
          },
          () => {
            this.$message.error(`图片尺寸限制最大为${this.limitImgW} x ${this.limitImgH}`)
            isPush = false
          }
        )
      }
      return isPush
    },
    async beforeUpload(file) {
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
<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
