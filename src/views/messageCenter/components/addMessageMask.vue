<template>
  <el-dialog
    v-if="open"
    ref="dialog"
    :title="title"
    :visible.sync="open"
    :before-close="handleClose"
    :close-on-click-modal="false"
    destroy-on-close
    width="550px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="form.appId"></appNameCon>
        </el-form-item>
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" clearable size="small" />
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入消息内容" clearable size="small" />
        </el-form-item>
        <el-form-item label="消息类型" prop="type">
          <el-select v-model="form.type" placeholder="点击选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容参数" prop="extra">
          <el-input v-model="form.extra" placeholder="请输入内容参数" clearable size="small" />
          <div>选择"漫画详情"时，在"内容参数"中输入漫画id,<br/>选择"系统通知"时，不用填"内容参数"，<br/>选择"HTTP网页"时，内容参数填写外链地址</div>
        </el-form-item>
        <el-form-item label="发送目标" prop="target">
          <el-select v-model="form.target" placeholder="点击选择">
            <el-option
              v-for="item in targetOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备号" prop="devices" :required="form.target === 3 ? true : false">
          <el-input v-model="form.devices" placeholder="请输入设备号" clearable size="small" />
          <div>选择自定义目标时，设备号必须填一个</div>
        </el-form-item>
        <el-form-item label="系统平台" prop="platform">
          <el-radio-group v-model="form.platform">
            <el-radio v-for="item in platformOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送类型" prop="sendType">
          <el-radio-group v-model="form.sendType">
            <el-radio v-for="item in sendTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="sava">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMessage } from '@/api/messageCenter'
import appNameCon from '@/components/AppNameCON'

export default {
  name: 'AddCarouseMask',
  components: {
    appNameCon
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    typeOptions: {
      type: Array,
      default: () => []
    },
    targetOptions: {
      type: Array,
      default: () => []
    },
    sendTypeOptions: {
      type: Array,
      default: () => []
    },
    platformOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    var devicesInput = (rule, value, callback) => {
      if (this.form.target === 3 && this.form.devices === '') {
        callback(new Error('请输入设备号'))
      } else {
        callback()
      }
    }
    return {
      form: {
        appId: undefined,
        title: '',
        content: '',
        type: '',
        extra: '',
        target: '',
        devices: '',
        platform: 1,
        sendType: 1
      },
      loading: false,
      loadingInstance: null,
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        target: [{ required: true, message: '请选择', trigger: 'change' }],
        devices: [{ validator: devicesInput, trigger: 'blur' }],
        platform: [{ required: true, message: '请选择', trigger: 'change' }],
        sendType: [{ required: true, message: '请选择', trigger: 'change' }],
        appId: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return '新增消息内容'
    },
    api() {
      return addMessage
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      }
    }
  },
  created() {},
  mounted() {

  },
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    sava() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.picturImages && /^https?:\/\/.+/.test(this.form.picturImages)) {
            delete this.form.picturImages
          }
          const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
          this.loadingInstance = this.$loading({
            target: dialogPanel
          })
          this.api(this.form)
            .then(res => {
              const msg = '新增成功'
              if (res.code === 200) {
                this.$message.success(msg)
                this.$emit('success', res)
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
        appId: undefined,
        title: '',
        content: '',
        type: '',
        extra: '',
        target: '',
        devices: '',
        platform: 1,
        sendType: 1
      }
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>

