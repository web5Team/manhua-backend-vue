<template>
  <el-dialog title="生成/刷新静态文件" :visible.sync="open" :before-close="handleClose" :close-on-click-modal="false" width="550px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="auto">
      <el-form-item label="刷新类型" prop="type">
        <el-select v-model="form.type" placeholder="点击选择" clearable>
          <el-option v-for="dict in typeSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <div v-if="form.type !== 14">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="form.appId" :isAllName="true"></appNameCon>
        </el-form-item>
      </div>
      <div v-if="form.type === 1">
        <el-form-item label="漫画ids" prop="ids">
          <el-input v-model="form.ids" placeholder="请输入漫画ids，多个用英文逗号隔开，-1代表刷新和生成全部" clearable size="small" />
        </el-form-item>
      </div>
      <div v-if="form.type === 14">
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路径" clearable size="small" />
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" :disabled="form.type === 14" type="primary" @click="sava('create')">生成</el-button>
      <el-button :loading="loading" type="primary" @click="sava('refresh')">刷新</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createStaticFile, refreshFileFeach } from '@/api/app'
import appNameCon from '@/components/AppNameCON'

export default {
  name: 'RefreshDia',
  components: {
    appNameCon
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        type: undefined,
        appId: undefined,
        ids: '',
        isRefreshCache: false,
        path: ''
      },
      rules: {
        type: [{ required: true, message: '请选择刷新类型', trigger: 'blur' }],
        appId: [{ required: true, message: '请选择刷新类型', trigger: 'blur' }],
        ids: [{ required: true, message: '请输入', trigger: 'blur' }],
        path: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      loading: false,
      typeSelect: [
        { value: 1, label: '本地漫画zip' },
        { value: 2, label: '轮播图' },
        { value: 3, label: '应用栏目(包括栏目内页)' },
        { value: 4, label: '新书内页' },
        { value: 5, label: '全部分类(包括分类内页)' },
        { value: 6, label: '全部排行榜' },
        { value: 7, label: '大家都在看' },
        { value: 8, label: 'Ta还画过' },
        { value: 9, label: '热门发现' },
        { value: 10, label: '标签列表' },
        { value: 11, label: '热门标签' },
        { value: 12, label: '栏目列表' },
        { value: 13, label: '地区列表' },
        { value: 14, label: '刷新图片目录' },
        { value: 15, label: '更新数据' },
        { value: 16, label: '今日热门速递' }
      ]
    }
  },
  computed: {},
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      } else {
        this.form = Object.assign(this.form, this.formData)
      }
    },
    'form.type'(val) {
      if (val !== 5) {
        this.form.ids = ''
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    sava(name) {
      const api = name === 'create' ? createStaticFile : refreshFileFeach
      const obj = { ...this.form }
      if (name !== 'create') {
        delete obj.isRefreshCache
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          api(this.form)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg)
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
    resat() {
      this.form = {
        type: undefined,
        appId: undefined,
        ids: '',
        isRefreshCache: false,
        path: ''
      }
      this.$refs['form'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
