<template>
  <div v-if="open">
    <el-dialog
    ref="dialog"
    :title="title"
    :visible.sync="open"
    :before-close="handleClose"
    :close-on-click-modal="false"
    destroy-on-close
    width="550px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="sava">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { addTemplateFeach, editTemplateFeach } from '@/api/moduleSet'

export default {
  name: 'AddLabelMask',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    statusOptions: {
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
        name: '',
        sort: 0,
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑模板' : '新增模板'
    },
    api() {
      return this.isEdit ? editTemplateFeach : addTemplateFeach
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      } else {
        this.form = Object.assign(this.form, this.formData)
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
          const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
          this.loadingInstance = this.$loading({
            target: dialogPanel
          })
          this.api(this.form)
            .then(res => {
              const msg = this.isEdit ? '修改成功' : '新增成功'
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
        name: '',
        sort: 0,
        status: 1
      }
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.tabel_maskbox_box {
    margin-top: 15px;
}
</style>

