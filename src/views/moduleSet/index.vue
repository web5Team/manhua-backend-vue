<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="模板名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入模板名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:moduleSet:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:moduleSet:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:moduleSet:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown v-permisaction="['admin:moduleSet:change']" style="margin-left: 10px;" @command="changeStatues">
              <el-button type="primary" size="mini" :disabled="ids.length == 0">
                修改状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in statusOptions" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          border
          :data="moduleSetList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="模板名称" fixed align="center" prop="name" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['value', 'label'], statusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdAt" :show-overflow-tooltip="true" width="180" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" prop="updatedAt" :show-overflow-tooltip="true" width="180" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="180">
            <template slot-scope="scope">
              <el-button v-permisaction="['admin:moduleSet:editModule']" size="mini" type="text" @click="editModule(scope.row)">模板设置</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <addmoduleMask
          :open.sync="open"
          :is-edit="isEdit"
          :status-options="statusOptions"
          :form-data="form"
          @success="success"
        ></addmoduleMask>
        <configureMain :open.sync="openSec" :form="templateForm"></configureMain>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import addmoduleMask from './components/addmoduleMask'
import configureMain from './components/configureMain'
import { delTemplateFeach, templateListFeach, modifyTemplateStatusFeach } from '@/api/moduleSet'

export default {
  name: 'Category',
  components: {
    addmoduleMask,
    configureMain
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        id: undefined,
        name: '',
        status: undefined,
        pageIndex: 1,
        pageSize: 10,
        idOrder: 'desc'
      },
      single: true,
      multiple: true,
      moduleSetList: [],
      ids: [],
      pidList: [],
      loading: false,
      total: 0,
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '禁用' }
      ],
      dateRange: [],
      open: false,
      isEdit: false,
      form: {},
      isAllSelect: false,
      selectArr: [],
      selecData: [],
      pidSelect: [],
      pidSelectSec: [],
      openSec: false,
      templateForm: {}
    }
  },
  watch: {
    open(val) {
      if (!val) this.form = {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      templateListFeach(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.moduleSetList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isEdit = false
      this.open = true
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id ? row.id : this.ids[0]
      const obj = this.moduleSetList.filter(i => i.id === id)
      if (obj.length) {
        this.form = obj[0]
      }
      this.isEdit = true
      this.open = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delTemplateFeach({ ids: Ids })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 排序回调函数 */
    handleSortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      Object.keys(this.queryParams).forEach(i => {
        if (/[a-zA-Z]*Order$/.test(i)) {
          this.queryParams[i] = undefined
        }
      })
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
    editModule(row) {
      this.openSec = true
      this.templateForm = { id: row.id }
    },
    changeStatues(item) {
      const Ids = this.ids
      this.upStatus(Ids, item.value)
    },
    upStatus(row, status) {
      const objArr = this.statusOptions.filter(i => i.value === status)
      this.$confirm(`是否修改id:${row.join(',')}的状态为${objArr[0].label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyTemplateStatusFeach({ ids: row, status }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    },
    success() {
      this.getList()
      this.open = false
    }
  }
}
</script>

