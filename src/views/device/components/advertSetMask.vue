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
        <el-form-item label="设备号" prop="device">
            <el-input v-model="form.device" placeholder="请输入设备号" clearable size="small" disabled />
        </el-form-item>
        <el-form-item label="免广告至" prop="time">
            <div class="make_item_line">
                <el-date-picker
                  v-model="form.time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="form.isNoAdvert"
                  placeholder="选择日期时间">
                </el-date-picker>
                <el-checkbox v-model="form.isNoAdvert" style="margin-left:20px;">终身免广告</el-checkbox>
            </div>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="sava">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { setFeelAdvertTimeDevice, getDevice } from '@/api/device'

export default {
  name: 'AdvertSetMask',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validateTime = (rule, value, callback) => {
      if (!value && !this.form.isNoAdvert) {
        return callback(new Error('时间不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        isNoAdvert: false
      },
      rules: {
        device: [{ required: true, message: '请输入设备号', trigger: 'blur' }],
        time: [{ validator: validateTime, trigger: 'blur' }]
      },
      loading: false,
      loadingInstance: null
    }
  },
  computed: {
    title() {
      return '免广告设置'
    },
    api() {
      return setFeelAdvertTimeDevice
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      } else {
        this.form = Object.assign(this.form, this.formData)
        this.getEdit()
      }
    },
    'form.isNoAdvert'(val) {
      if (!val) {
        this.form.time = new Date()
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
          if (this.form.isNoAdvert) {
            this.form.freeTime = '1970-01-01T08:00:01+08:00'
          } else {
            try {
              const timeArr = this.form.time.split(' ')
              this.form.freeTime = timeArr[0] + 'T' + timeArr[1] + '+08:00'
            } catch {
              const date = new Date(this.form.time)
              const year = date.getFullYear()
              let month = date.getMonth() + 1
              let day = date.getDate()
              let hour = date.getHours()
              let minute = date.getMinutes()
              let second = date.getSeconds()
              month = month < 10 ? '0' + month : month
              day = day < 10 ? '0' + day : day
              hour = hour < 10 ? '0' + hour : hour
              minute = minute < 10 ? '0' + minute : minute
              second = second < 10 ? '0' + second : second
              const time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
              const timeArr = time.split(' ')
              this.form.freeTime = timeArr[0] + 'T' + timeArr[1] + '+08:00'
            }
          }
          const paramsObj = {
            appId: this.form.appId,
            freeTime: this.form.freeTime,
            id: this.form.id
          }
          this.api(paramsObj)
            .then(res => {
              const msg = '设置成功'
              if (res.code === 200) {
                this.$message.success(msg)
                this.$emit('successAdvert', res)
              }
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
        isNoAdvert: false
      }
      this.$refs['form'].resetFields()
    },
    async getEdit() {
      const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
      this.loadingInstance = this.$loading({
        target: dialogPanel
      })
      try {
        const { data } = await getDevice(this.formData.id, this.formData.appId)
        data.isNoAdvert = this.parseTime(data.freeTime) === '1970-01-01 08:00:01'
        data.time = this.parseTime(data.freeTime)
        this.form = data
      } finally {
        this.loadingInstance.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.make_item_line {
    display: flex;
}
</style>
