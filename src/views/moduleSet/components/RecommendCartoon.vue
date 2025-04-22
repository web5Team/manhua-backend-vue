<template>
  <div class="root">
    <el-form ref="formData" :inline="true" :model="formData" size="small" class="demo-form-inline">
      <el-form-item label="阅读偏好" prop="gender">
        <el-select v-model="formData.gender" clearable class="columnInput" placeholder="请选择" @change="handleData">
          <el-option v-for="dict in preferencesOptions" :key="dict.value" class="columnInput" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add" v-permisaction="['admin:cartoonRecom:add']">新增</el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          :disabled="ids.length == 0"
          v-permisaction="['admin:cartoonRecom:remove']"
          @click="deleteData"
          >删除</el-button
        >
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
      <template slot="title">当前偏好: {{ formData.gender | arrFilter(['value', 'label'], preferencesOptions) }}</template>
      <el-form ref="form" :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="漫画id" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入漫画id"
            clearable
            size="small"
            type="number"
            class="columnInput"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
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
        <el-form-item label="作者" prop="author">
          <el-input
            v-model="queryParams.author"
            class="columnInput"
            placeholder="请输入作者"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="别名" prop="aliasName">
          <el-input
            v-model="queryParams.aliasName"
            class="columnInput"
            placeholder="别名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="主角" prop="protagonist">
          <el-input
            v-model="queryParams.protagonist"
            class="columnInput"
            placeholder="主角"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="漫画状态" prop="isEnd">
          <el-select v-model="queryParams.isEnd" clearable class="columnInput" placeholder="请选择">
            <el-option v-for="dict in cartoonOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="queryParams.categoryId" clearable class="columnInput" placeholder="分类">
            <el-option v-for="dict in classifyOptions" :key="dict.value" class="columnInput" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-bottom: 10px" :disabled="!secIds.length" icon="el-icon-plus" size="mini" @click="addBook"
        >选择</el-button
      >
      <DataList
        :loading="cartoonLoading"
        :list="cartooonList"
        @selectionChange="handleSelectionBookChange"
        @sortChange="sortChange"
      ></DataList>
      <pagination
        v-show="cartoonTotal > 0"
        small
        :total="cartoonTotal"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getCartoonList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listCategory } from '@/api/category'
import { listCartoon } from '@/api/cartoon'
import { listTemRecommend, addTemRecommend, deleteTemRecommend } from '@/api/moduleSet'
import DataList from '@/views/app/components/DataList'

export default {
  name: 'RecommendBook',
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
        gender: '',
        pageIndex: 1,
        pageSize: 10
      },
      column: [],
      ids: [],
      list: [],
      loading: false,
      chaptertotal: 0,
      openChapter: false,
      queryParams: {
        id: undefined,
        name: '',
        author: '',
        aliasName: '',
        protagonist: '',
        categoryId: undefined,
        isEnd: undefined,
        pageIndex: 1,
        pageSize: 10
      },
      classifyOptions: [],
      cartoonTotal: 0,
      cartoonLoading: false,
      cartooonList: [],
      secIds: [],
      cartoonOptions: [
        { value: 1, label: '已完结' },
        { value: 2, label: '未完结' }
      ],
      preferencesOptions: [
        { value: 1, label: '男生' },
        { value: 2, label: '女生' },
        { value: 3, label: '跳过' }
      ],
      isRequested: false
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
    tabType(val) {
      if (val === 'six' && !this.isRequested) {
        this.isRequested = true
        this.creatData()
        this.getCategoryList()
        this.handleQuery()
      }
    }
  },
  mounted() {
    // this.creatData()
    // this.getCategoryList()
    // this.handleQuery()
  },
  methods: {
    creatData() {
      this.list = []
      this.formData = {
        templateId: '',
        gender: '',
        pageIndex: 1,
        pageSize: 10
      }
      if (this.editForm.id) {
        this.formData.templateId = this.editForm.id
        this.getList()
      }
    },
    handleData() {
      this.formData.pageIndex = 1
      this.getList()
    },
    add() {
      if (!this.formData.gender) {
        this.$message.info('请选择阅读偏好')
        return
      }
      this.resetQuery()
      this.openChapter = true
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
      await deleteTemRecommend({ templateId: this.formData.templateId, ids: this.ids })
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
      try {
        const { data } = await listTemRecommend(this.formData)
        this.list = data.list
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
    async getCategoryList() {
      const { data } = await listCategory({ pageIndex: 1, pageSize: 1000, idOrder: 'asc' })
      this.classifyOptions = data.list.map((item) => {
        return {
          value: item.id,
          label: item.name,
          status: item.status
        }
      })
    },
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.queryParams.pageSize = 10
      this.getCartoonList()
    },
    resetQuery() {
      this.resetForm('form')
      this.queryParams.pageIndex = 1
      this.handleQuery()
    },

    // 获取列表
    async getCartoonList() {
      this.cartoonLoading = true
      try {
        const { data } = await listCartoon(this.queryParams)
        this.cartooonList = data.list
        this.cartoonTotal = data.count
      } finally {
        this.cartoonLoading = false
      }
    },
    handleSelectionBookChange(selection) {
      this.secIds = selection.map((item) => {
        return item.id
      })
    },

    // 增加
    async addBook() {
      const form = {
        cartoonIds: this.secIds,
        templateId: this.formData.templateId,
        gender: this.formData.gender
      }
      const { code } = await addTemRecommend(form)
      if (code === 200) {
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
      this.getCartoonList()
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
