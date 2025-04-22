<template>
  <div class="root">
    <el-form ref="queryParams" :inline="true" :model="queryParams" size="small" class="demo-form-inline">
      <el-form-item label="当前栏目" prop="columnId">
        <el-select v-model="queryParams.columnId" placeholder="请选择" @change="handleColumnSelect">
          <el-option
            v-for="item in appTemColumbOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editForm.templateId === -1" v-permisaction="['admin:appCol:add']" type="primary" size="mini" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="editForm.templateId === -1" v-permisaction="['admin:appCol:remove']" type="danger" size="mini" icon="el-icon-delete" :disabled="!ids.length || !queryParams.columnId" @click="deleteData">删除</el-button>
        <!-- <el-button type="primary" size="mini" @click="generateStaticFiles">生成静态文件</el-button> -->
      </el-form-item>
    </el-form>
    <el-divider />

    <DataList :loading="loading" :list="list" @selectionChange="handleSelectionChange" @sortChange="sortListChange"></DataList>
    <pagination
      v-show="chaptertotal > 0"
      small
      :total="chaptertotal"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="当前栏目" :visible.sync="openChapter" :append-to-body="true" width="60%" :close-on-click-modal="false">
      <template slot="title">当前栏目: {{ queryParams.columnId | arrFilter(['id', 'name'], appTemColumbOptions) }}</template>
      <el-form ref="form" :model="secQueryParams" :inline="true" label-width="80px">
        <el-form-item label="漫画名" prop="name">
          <el-input
            v-model="secQueryParams.name"
            class="columnInput"
            placeholder="请输入漫画名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="漫画id" prop="id">
          <el-input
            v-model="secQueryParams.id"
            placeholder="请输入漫画id"
            clearable
            size="small"
            class="columnInput"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="secQueryParams.author" placeholder="请输入作者名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="别名" prop="aliasName">
          <el-input v-model="secQueryParams.aliasName" placeholder="请输入别名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="主角" prop="protagonist">
          <el-input v-model="secQueryParams.protagonist" placeholder="请输入主角名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            v-model="secQueryParams.categoryId"
            placeholder="请选择分类"
            clearable
            size="small"
            @change="handleQuery"
          >
            <el-option v-for="item in classifOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漫画状态" prop="isEnd">
          <el-select v-model="secQueryParams.isEnd" clearable class="columnInput" placeholder="请选择">
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
      <DataList :loading="secondLoading" :list="secList" @selectionChange="handleSelectionBookChange" @sortChange="sortChange"></DataList>

      <pagination
        v-show="videototal > 0"
        small
        :total="videototal"
        :page.sync="secQueryParams.pageIndex"
        :limit.sync="secQueryParams.pageSize"
        @pagination="getCartoonList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { addColumnCartoonFeach, delColumnCartoonFeach, createStaticFile, columnCartoonListFeach } from '@/api/app'
import { listCartoon } from '@/api/cartoon'
import { templateColumnListFeach, templateColumnCartoonListFeach } from '@/api/moduleSet'
import { listCategory } from '@/api/category'
import { listColumn } from '@/api/column'

import DataList from './DataList'

export default {
  name: 'Column',
  components: { DataList },
  props: {
    editForm: {
      type: Object,
      default: () => {}
    },
    tapType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      queryParams: {
        appId: '', // 配置id
        templateId: undefined,
        columnId: '', // 栏目id
        pageIndex: 1,
        pageSize: 10
      },
      column: [],
      queryParamsChapter: {},
      ids: [],
      list: [],
      loading: false,
      chaptertotal: 0,
      openChapter: false,
      secQueryParams: {
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
      videototal: 0,
      secondLoading: false,
      secList: [],
      secIds: [],
      appTemColumbOptions: [],
      cartoonOptions: [
        { value: 1, label: '已完结' },
        { value: 2, label: '未完结' }
      ],
      classifOptions: [],
      selArrColumn: [],
      columnQueryEd: false //判断栏目列表有没有请求过
    }
  },
  computed: {
    isButtom() {
      return this.$store.state.user.userId === Number(this.editForm.createBy)
    }
  },
  watch: {
    'editForm.id'(val) {
      this.creatData()
    },
    tapType(val) {
      if (val === 'second' && !this.columnQueryEd) {
        this.columnQueryEd = true
        this.creatData()
        if (this.editForm.id) {
          this.getClassifiList()
        }
      }
    }
  },
  mounted() {
    // this.creatData()
    // if (this.editForm.id) {
    //   this.getClassifiList()
    // }
  },
  methods: {
    creatData() {
      this.list = []
      this.queryParams = {
        appId: '',
        columnId: '',
        pageIndex: 1,
        pageSize: 10
      }
      this.selArrColumn = []
      if (this.editForm.id) {
        this.queryParams.appId = this.editForm.id
        this.queryParams.templateId = this.editForm.templateId
        this.getColumnList()
      }
    },
    handleData() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    add() {
      if (!this.queryParams.columnId) {
        this.$message.info('请选择栏目')
        return
      }
      this.resetQuery()
      this.openChapter = true
    },
    async getColumnList() {
      let api = ''
      let paramsObj = {}
      if (this.editForm.templateId !== -1) {
        api = templateColumnListFeach
        paramsObj = { sortOrder: 'asc', pageIndex: 1, pageSize: 9999, templateId: this.queryParams.templateId }
      } else {
        api = listColumn
        paramsObj = { idOrder: 'asc', pageIndex: 1, pageSize: 9999, appId: this.queryParams.appId }
      }
      const { data } = await api(paramsObj)
      this.appTemColumbOptions = data.list
      if (data.list && data.list.length) {
        this.queryParams.columnId = data.list[0].id
      }
      this.queryParams.pageIndex = 1
      this.getList()
    },
    deleteData() {
      const ids = this.ids.join(',')
      this.$confirm(`是否确认删除id ${ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteList(ids)
      })
    },
    async deleteList() {
      await delColumnCartoonFeach(this.queryParams.appId, this.queryParams.columnId, { cartoonIds: this.ids })
      this.getList()
      this.msgSuccess('删除成功')
    },
    handleSelectionChange(arr) {
      this.ids = arr.map((item) => {
        return item.id
      })
    },
    async getList() {
      this.loading = true
      let api = ''
      const paramsObj = { ...this.queryParams }
      if (this.editForm.templateId !== -1) {
        api = templateColumnCartoonListFeach
        delete paramsObj.appId
      } else {
        api = columnCartoonListFeach
        delete paramsObj.templateId
      }
      try {
        const { data } = await api(paramsObj)
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
      this.secQueryParams.pageIndex = 1
      this.getCartoonList()
    },
    resetQuery() {
      this.resetForm('form')
      this.secQueryParams.pageIndex = 1
      this.handleQuery()
    },

    // 获取列表
    async getCartoonList() {
      this.secondLoading = true
      try {
        const { data } = await listCartoon(this.secQueryParams)
        if (data.list && data.list.length) {
          this.secList = data.list
        } else {
          this.secList = []
        }
        this.videototal = data.count
      } finally {
        this.secondLoading = false
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
        appId: this.queryParams.appId,
        columnId: parseInt(this.queryParams.columnId)
      }
      const { code, msg } = await addColumnCartoonFeach(form)
      if (code === 200) {
        this.$message.success(msg)
        this.openChapter = false
        this.getList()
      }
    },
    async generateStaticFiles() {
      const obj = {
        type: 3, // 栏目类型
        isRefreshCache: true,
        appId: this.queryParams.appId,
        ids: this.ids.join(',')
      }
      const { msg } = await createStaticFile(obj)
      this.$message.success(msg)
    },
    sortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.secQueryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.secQueryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.secQueryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.secQueryParams[prop + 'Order'] = undefined
      }
      this.getCartoonList()
    },
    sortListChange(column, prop, order) {
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
      this.getList()
    },
    handleColumnSelect() {
      this.getList()
    },
    async getClassifiList() {
      const obj = {
        pageIndex: 1,
        pageSize: 10000,
        idOrder: 'asc'
      }
      try {
        const { data } = await listCategory(obj)
        this.classifOptions = data.list
        // this.getList()
        this.getCartoonList()
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
