<template>
  <el-dialog title="新增漫画纠错" :visible.sync="open" :before-close="handleClose" width="60%" :close-on-click-modal="false">
    <el-form ref="addForm" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="本地漫画ID" prop="cartoonId">
        <el-input v-model="form.cartoonId" placeholder="请输入" clearable size="small" @change="form.cartoonId = Number(form.cartoonId)" />
      </el-form-item>
      <el-form-item label="错误类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择" clearable>
          <el-option v-for="dict in typeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="错误原因" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入" clearable size="small" />
      </el-form-item>
      <el-form-item label="采集规则" prop="ruleId">
        <el-select v-model="form.ruleId" placeholder="请选择" clearable @change="ruleChange">
          <el-option v-for="item in ruleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.ruleId" label="源站漫画ID" prop="sourceCartoonId">
        <el-input
          v-model="form.sourceCartoonId"
          placeholder="请输入"
          clearable
          size="small"
          @input="form.sourceCartoonId = form.sourceCartoonId.replace(/[^\d]/g, '')"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="add">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addCartoonErr } from '@/api/cartoon-err'
import { listCrawlerRule } from '@/api/crawler-rule'

export default {
  name: 'AddCartoonErr',
  components: {},
  props: {
    open: {
      type: Boolean,
      default: false
    },
    ruleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    var checkSourceCartoonId = (rule, value, callback) => {
      if (!this.form.ruleId) {
        callback()
      } else {
        if (!value) {
          callback(new Error('选择采集规则时,源站漫画ID不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {
        cartoonId: undefined,
        sourceCartoonId: undefined,
        ruleId: undefined,
        remark: undefined,
        type: undefined
      },
      rules: {
        cartoonId: [{ required: true, message: '本地书籍id不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '本地书籍id不能为空', trigger: 'blur' }],
        sourceCartoonId: [{ validator: checkSourceCartoonId, trigger: 'blur' }]
      },
      typeOptions: [
        { value: 1, label: '章节对比错误(本地章节数比源站多)' },
        { value: 5, label: '存在空白章节终止更新' },
        { value: 4, label: '其他' }
      ]
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.resetForm('addForm')
      }
    }
  },
  created() {
  },
  mounted() {
    // this.getListCrawlerRule()
  },
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    add() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.form.sourceCartoonId) this.form.sourceCartoonId = Number(this.form.sourceCartoonId)
          addCartoonErr(this.form).then(res => {
            if (res.code === 200) {
              this.$message.success('新增成功')
              this.$emit('addSucces', res.data)
            }
          })
        } else {
          return false
        }
      })
    },
    async getListCrawlerRule() {
      const { data } = await listCrawlerRule({ pageIndex: 1, pageSize: 99999, status: 1 })
      this.ruleList = data.list
    },
    ruleChange(val) {
      if (!val) {
        this.form.sourceCartoonId = undefined
        this.form.ruleName = undefined
        return
      }
      this.form.ruleName = this.ruleList.find(item => {
        return item.id === val
      }).name
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  margin: 0;
  padding: 0;
  color: #999;
  font-size: 12px;
  line-height: 18px;
}
</style>
