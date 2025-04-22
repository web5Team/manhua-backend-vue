<template>
  <div class="root">
    <img v-if="picturet && showImg" :src="picturet" :width="picturet == '' ? '' : imgWidth" :height="picturet == '' ? '' : imgHeight" />
    <el-upload
      ref="upload"
      :auto-upload="false"
      :file-list="fileList"
      :multiple="false"
      :limit="limit"
      :on-exceed="handleExceed"
      :http-request="uploadFiles"
      accept="application/zip"
      action
      :on-change="uploadFiles"
      :on-remove="uploadRemove"
    >
      <el-button slot="trigger" size="mini" type="primary">{{ butTxt }}</el-button>
      <span v-if="showCase" class="dowTxt" @click="dowZip">下载案例</span>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Index',
  model: {
    prop: 'picturet',
    event: 'change'
  },
  props: {
    limit: {
      type: Number,
      default: 1
    },
    imgWidth: {
      type: Number,
      default: 140
    },
    imgHeight: {
      type: Number,
      default: 200
    },
    picturet: {
      type: String,
      default: ''
    },
    showImg: {
      type: Boolean,
      default: true
    },
    showCase: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: 'image/jpeg, image/gif, image/png'
    },
    isUpData: {
      type: Boolean,
      default: false
    },
    isEditImg: {
      type: Boolean,
      default: false
    },
    download: {
      type: String,
      default: '/static/icons/icons.zip'
    },
    butTxt: {
      type: String,
      default: '选择图标'
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    isUpData(val) {
      if (val) {
        this.fileList = []
        this.$emit('update:isUpData', false)
      }
    },
    isEditImg(val) {
      if (val) {
        this.fileList = [{ url: this.picturet, name: '文件' }]
      }
    }
  },
  mounted() {
    if (this.isEditImg) {
      this.fileList = [{ url: this.picturet }]
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    uploadFiles() {
      const file = this.$refs.upload.$refs['upload-inner'].$refs.input // 获取文件数据
      const fileList = file.files
      const isZip = fileList[0].name.endsWith('.zip')
      if (!isZip) {
        this.fileList = []
        this.$message.warning(`请选择zip文件`)
        this.$emit('change', undefined)
        return
      }
      // console.log(file.name.endsWith('.zip'))
      const reader = new FileReader() // html5读文件

      reader.readAsDataURL(fileList[0]) // 转BASE64
      // const _t = this
      reader.onloadend = e => {
        this.$emit('change', e.target.result)
      }
    },
    uploadRemove(files, fileList) {
      this.$emit('change', undefined)
    },
    dowZip() {
      window.open(`${process.env.VUE_APP_BASE_API}${this.download}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  overflow: hidden;
}
.dowTxt {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
