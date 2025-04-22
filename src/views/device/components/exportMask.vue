<template>
  <el-dialog
    ref="dialog"
    :title="title"
    :visible.sync="open"
    :before-close="handleClose"
    :close-on-click-modal="false"
    destroy-on-close
    width="550px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="设备数" prop="num">
            <el-input v-model="form.num" placeholder="注册设备数" clearable size="small" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startDay">
        <el-date-picker
          v-model="form.startDay"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请输入开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endDay">
        <el-date-picker
          v-model="form.endDay"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请输入结束时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="sava">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { exportDeviceDoorChain } from '@/api/device'

export default {
  name: 'ExportMask',
  components: {
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    statusSelect: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        appId: 0,
        num: '',
        startDay: '',
        endDay: ''
      },
      rules: {
        num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        startDay: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        endDay: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      },
      loading: false,
      loadingInstance: null
    }
  },
  computed: {
    title() {
      return '导出防盗链IP'
    },
    api() {
      return exportDeviceDoorChain
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    sava() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
          this.loadingInstance = this.$loading({
            target: dialogPanel
          })
          this.form.appId = this.formData.appId
          this.form.timeout = 5 * 60 * 1000
          this.api(this.form)
            .then(res => {
              this.$emit('success', res)
              const link = document.createElement('a')
              const blob = new Blob([res], { type: 'application/text/plain' })
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)

              // link.download = res.headers['content-disposition'] //下载后文件名
              link.download = '防盗链IP.csv' // 下载的文件名
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            })
            .finally(() => {
              this.loadingInstance.close()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resat() {
      this.form = {
        appId: 0,
        num: '',
        startDay: '',
        endDay: ''
      }
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
