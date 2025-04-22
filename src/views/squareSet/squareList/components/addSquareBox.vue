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
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-form-item label="输入用户id" prop="memberId">
        <el-input
          v-model="form.memberId"
          placeholder="请输入用户id"
          :disabled="isEdit"
          clearable
          size="small"
          @input="() => enterNumber(form.id, form, 'id')"
        />
      </el-form-item>
      <el-form-item label="推荐标题" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入推荐标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in statusSelect" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
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
import { addTagFeach, editSquarte } from '@/api/squareSetApi'

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
        memberId: '',
        content: '',
        status: 1
      },
      rules: {
        memberId: [{ required: true, message: '请输入用户id', trigger: 'blur' }],
        content: [{ required: true, message: '请输入推荐标题', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑推荐' : '新增推荐'
    },
    api() {
      return this.isEdit ? editSquarte : addTagFeach
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      } else {
        this.form = Object.assign(this.form, this.formData)
        if (this.isEdit) {
          //   this.getEdit()
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    sava() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
          this.loadingInstance = this.$loading({
            target: dialogPanel
          })
          this.api(this.form)
            .then((res) => {
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
        memberId: '',
        content: '',
        status: 1
      }
      this.$refs['form'].clearValidate()
    }
    // async getEdit() {
    //   const dialogPanel = this.$refs.dialog ? this.$refs.dialog.$refs.dialog : '' // dialog面板的dom节点
    //   if (dialogPanel) {
    //     this.loadingInstance = this.$loading({
    //       target: dialogPanel
    //     })
    //   }
    //   try {
    //     const { data } = await getVideoDataInfo(this.formData.id)
    //     this.form = data
    //   } finally {
    //     if (dialogPanel) {
    //       this.loadingInstance.close()
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.tabel_maskbox_box {
  margin-top: 15px;
}
</style>

