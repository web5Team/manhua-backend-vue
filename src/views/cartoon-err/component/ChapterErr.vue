<template>
  <el-dialog ref="dialog" title="纠错章节" :visible.sync="open" :before-close="handleClose" width="60%" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="章节名称" prop="novelChapter.name">
        <el-input v-model="form.novelChapter.name" placeholder="章节名称" />
      </el-form-item>
      <el-form-item label="状态" prop="novelChapter.status">
        <el-select v-model="form.novelChapter.status" clearable placeholder="请选择">
          <el-option v-for="dict in statusTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="novelChapter.sort">
        <el-input v-model="form.novelChapter.sort" placeholder="排序" />
      </el-form-item>
      <el-form-item label="章节内容" prop="novelChapter.content">
        <tinymce v-if="tinymcexh" v-model="form.novelChapter.content" :toolbar="tinymceToolbar" :height="300" :menubar="false" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="add">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editerrnovelchaptercontent, getCartoonErr } from '@/api/cartoon-err'
import { chapterList } from '@/api/cartoon'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ChapterErr',
  components: { Tinymce },
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
    return {
      form: {
        cartoonErr: {},
        novelChapter: {
          name: undefined,
          status: undefined,
          sort: undefined,
          content: undefined
        }
      },
      rules: {
        'novelChapter.name': [{ required: true, message: '章节名称不能为空', trigger: 'blur' }]
      },
      ruleList: [],
      statusTypeOptions: [{ value: 1, label: '显示' }, { value: 2, label: '不显示' }],
      tinymcexh: false,
      tinymceToolbar: [
        'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample',
        'hr bullist numlist link charmap preview anchor pagebreak insertdatetime table forecolor backcolor fullscreen'
      ],
      loadingInstance: null,
      loading: false
    }
  },
  watch: {
    open(val) {
      if (val) {
        if (this.formData.id) {
          this.getDate()
        }
      } else {
        this.tinymcexh = false
        this.form = {
          novelBookErr: {},
          novelChapter: {
            name: undefined,
            status: undefined,
            sort: undefined,
            content: undefined
          }
        }
        this.loading = false
        this.$refs['form'].clearValidate()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    add() {
      if (!this.form.novelChapter.content) {
        this.$message.error('章节内容不能为空')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          editerrnovelchaptercontent(this.form)
            .then(res => {
              if (res.data) {
                this.$message.success('纠错章节修改成功')
                this.$emit('succes', res.data)
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    ruleChange(val) {
      if (!val) {
        this.form.sourceBookId = undefined
        this.form.ruleName = undefined
        return
      }
      this.form.ruleName = this.ruleList.find(item => {
        return item.id === val
      }).name
    },
    async getDate() {
      const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
      this.loadingInstance = this.$loading({
        target: dialogPanel
      })
      try {
        const [bookChapterData, bookErrData] = await Promise.all([
          chapterList(this.formData.bookId, this.formData.chapterId),
          getCartoonErr(this.formData.id)
        ])
        this.form = {
          novelBookErr: bookErrData.data,
          novelChapter: bookChapterData.data
        }
        this.tinymcexh = true
      } finally {
        this.loadingInstance.close()
      }
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
