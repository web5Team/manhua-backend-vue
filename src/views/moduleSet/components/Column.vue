<template>
  <div class="root">
    <el-form ref="formData" :inline="true" :model="formData" size="small" class="demo-form-inline">
      <el-form-item label="当前栏目" prop="columnId">
        <el-select
            v-model="formData.columnId"
            placeholder="请选择"
            clearable
            size="small"
            @change="handleSearch"
          >
            <el-option v-for="item in temColumbOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add" v-permisaction="['admin:cartoonColSet:add']">新增</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="ids.length == 0" @click="deleteData" v-permisaction="['admin:cartoonColSet:remove']">删除</el-button>
      </el-form-item>
    </el-form>
    <el-divider />

    <DataList :loading="loading" :list="list" @selectionChange="handleSelectionChange" @sortChange="sortListChange"></DataList>
    <pagination
      v-show="chaptertotal > 0"
      small
      :total="chaptertotal"
      :page.sync="formData.pageIndex"
      :limit.sync="formData.pageSize"
      @pagination="getList"
    />

    <el-dialog title="当前栏目" :visible.sync="openChapter" :append-to-body="true" width="60%" :close-on-click-modal="false">
      <template slot="title">当前栏目: {{ formData.columnId | arrFilter(['id', 'name'], temColumbOptions) }}</template>
      <el-form ref="form" :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="漫画名" prop="name">
          <el-input
            v-model="queryParams.name"
            class="columnInput"
            placeholder="请输入漫画名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="漫画id" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入漫画id"
            clearable
            size="small"
            class="columnInput"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="queryParams.author" placeholder="请输入作者名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="别名" prop="aliasName">
          <el-input v-model="queryParams.aliasName" placeholder="请输入别名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="主角" prop="protagonist">
          <el-input v-model="queryParams.protagonist" placeholder="请输入主角名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            v-model="queryParams.categoryId"
            placeholder="请选择分类"
            clearable
            size="small"
            @change="handleQuery"
          >
            <el-option v-for="item in classifOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漫画状态" prop="isEnd">
          <el-select v-model="queryParams.isEnd" clearable class="columnInput" placeholder="请选择">
            <el-option v-for="dict in cartoonOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-bottom: 10px" :disabled="!secIds.length" icon="el-icon-plus" size="mini" @click="addVideo"
        >选择</el-button
      >
      <DataList :loading="secLoading" :list="secList" @selectionChange="handleSelectionBookChange" @sortChange="sortChange"></DataList>

      <pagination
        v-show="secTotal > 0"
        small
        :total="secTotal"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getSecList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listCartoon } from '@/api/cartoon'
import { listCategory } from '@/api/category'
import { templateColumnListFeach, addTemplateColumnVideoFeach, delTemplateColumnVideoFeach, templateColumnCartoonListFeach } from '@/api/moduleSet'

import DataList from '@/views/app/components/DataList'

export default {
  name: 'Column',
  components: { DataList },
  props: {
    editForm: {
      type: Object,
      default: () => {}
    },
    tabType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        templateId: '', // 配置id
        columnId: '', // 栏目id
        pageIndex: 1,
        pageSize: 10
      },
      ids: [],
      list: [],
      loading: false,
      chaptertotal: 0,
      openChapter: false,
      queryParams: {
        name: '',
        id: undefined,
        author: '',
        aliasName: '',
        protagonist: '',
        categoryId: undefined,
        isEnd: undefined,
        pageIndex: 1,
        pageSize: 10
      },
      secTotal: 0,
      secLoading: false,
      secList: [],
      secIds: [],
      temColumbOptions: [],
      cartoonOptions: [
        { value: 1, label: '已完结' },
        { value: 2, label: '未完结' }
      ],
      classifOptions: [],
      isRequested: false
    }
  },
  computed: {
    isButtom() {
      return this.$store.state.user.userId === Number(this.editForm.createBy)
    }
  },
  watch: {
    tabType(val) {
      if (val === 'second' && !this.isRequested) {
        this.isRequested = true
        this.creatData()
        // this.handleQuery()
        if (this.editForm.id) {
          this.getClassifiList()
        }
      }
    }
  },
  mounted() {
    // this.creatData()
    // this.handleQuery()
    // this.getRegionSelectList()
    // if (this.editForm.id) {
    //   this.getClassifiList()
    // }
  },
  methods: {
    creatData() {
      this.list = []
      this.formData = {
        templateId: this.editForm.id,
        columnId: '',
        pageIndex: 1,
        pageSize: 10
      }
      if (this.editForm.id) {
        this.getColumnList()
      }
    },
    handleData() {
      this.formData.pageIndex = 1
      this.getList()
    },
    add() {
      if (!this.formData.columnId) {
        this.$message.info('请选择栏目')
        return
      }
      this.resetQuery()
      this.openChapter = true
      this.getSecList()
    },
    async getColumnList() {
      const { data } = await templateColumnListFeach({ sortOrder: 'asc', pageIndex: 1, pageSize: 9999, templateId: this.formData.templateId })
      this.temColumbOptions = data.list
      if (data.list && data.list.length) {
        this.formData.columnId = data.list[0].id
      }
      this.formData.pageIndex = 1
      this.getList()
    },
    deleteData() {
      const Ids = this.ids.join(',')
      this.$confirm(`是否确认删除id ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteList()
      })
    },
    async deleteList() {
      const paramsObj = {
        cartoonIds: this.ids
      }
      await delTemplateColumnVideoFeach(paramsObj, this.formData.templateId, this.formData.columnId)
      this.getList()
      this.msgSuccess('删除成功')
    },
    handleSelectionChange(arr) {
      this.ids = arr.map((item) => {
        return item.id
      })
    },
    handleSearch() {
      this.formData.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      try {
        const { data } = await templateColumnCartoonListFeach(this.formData)
        if (data.list && data.list.length) {
          this.list = data.list
        } else {
          this.list = []
        }
        this.chaptertotal = data.count
      } finally {
        this.loading = false
      }
    },
    showBookState(row) {
      if (row.status === 1) {
        return '显示'
      } else if (row.status === 2) {
        return '不显示'
      } else {
        return '未知'
      }
    },
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getSecList()
    },
    resetQuery() {
      this.resetForm('form')
      this.queryParams.pageIndex = 1
      this.handleQuery()
    },

    // 获取小数列表
    async getSecList() {
      this.secLoading = true
      try {
        const { data } = await listCartoon(this.queryParams)
        if (data.list && data.list.length) {
          this.secList = data.list
        } else {
          this.secList = []
        }
        this.secTotal = data.count
      } finally {
        this.secLoading = false
      }
    },
    handleSelectionBookChange(selection) {
      this.secIds = selection.map((item) => {
        return item.id
      })
    },

    // 增加视频
    async addVideo() {
      const form = {
        cartoonIds: this.secIds,
        templateId: this.formData.templateId,
        columnId: parseInt(this.formData.columnId)
      }
      const { code, msg } = await addTemplateColumnVideoFeach(form)
      if (code === 200) {
        this.$message.success(msg)
        this.openChapter = false
        this.getList()
      }
    },
    sortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getSecList()
    },
    sortListChange(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.formData[this.order] = undefined
      }
      if (order === 'descending') {
        this.formData[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.formData[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.formData[prop + 'Order'] = undefined
      }
      this.getList()
    },
    handleColumnSelect(val) {
      this.formData.columnId = (val.filter((i, oi) => oi === 0)).join(',')
      this.formData.childrenColumnId = (val.filter((i, oi) => oi !== 0)).join(',')
      this.$refs.columnSelectBoxCas.dropDownVisible = false
      this.getList()
    },
    handleColumnSelectSec(val) {
      this.formData.columnId = (val.filter((i, oi) => oi === 0)).join(',')
      this.formData.childrenColumnId = (val.filter((i, oi) => oi !== 0)).join(',')
      this.$refs.columnSelectBoxCasSec.dropDownVisible = false
      this.getSecList()
    },
    // async getRegionSelectList() {
    //   const { data } = await getConfigKey('video_screen_region')
    //   if (data.configValue) {
    //     this.regionSelects = data.configValue.split(',')
    //   }
    // },
    async getClassifiList() {
      const obj = {
        pageIndex: 1,
        pageSize: 10000,
        order: 'descending'
      }
      try {
        const { data } = await listCategory(obj)
        this.classifOptions = data.list
        // this.getList()
        // this.getVideoList()
      } finally {
        console.log('error submit!!')
      }
    }
  }
}
</script>

<style lang="scss">
.root {
  overflow: hidden;
}
.columnInput {
  max-width: 130px;
}
</style>
