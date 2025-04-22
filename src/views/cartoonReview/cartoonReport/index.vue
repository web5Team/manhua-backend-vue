
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="评论id" prop="commentId">
            <el-input v-model="queryParams.commentId" placeholder="请输入评论id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="评论内容" prop="content">
            <el-input v-model="queryParams.content" placeholder="请输入评论内容" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="举报人id" prop="memberId">
            <el-input v-model="queryParams.memberId" placeholder="请输入举报人id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="举报类型" prop="typeCode">
            <el-select v-model="queryParams.typeCode" clearable placeholder="请选择" size="small" @change="handleQuery">
              <el-option v-for="dict in reportOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="评论类型" prop="type">
            <el-select v-model="queryParams.type" clearable placeholder="请选择" size="small" @change="handleQuery">
              <el-option v-for="dict in replyOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
           <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="请选择" size="small" @change="handleQuery">
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
              v-permisaction="['admin:cartoonReport:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown v-permisaction="['admin:cartoonReport:change']" style="margin-left: 10px;" @command="changeStatues">
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
          :data="cartoonComList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" fixed align="center" prop="id" sortable="custom" width="80" :show-overflow-tooltip="true" />
          <el-table-column label="评论id" align="center" prop="commentId" width="110" :show-overflow-tooltip="true" sortable="custom" />
          <el-table-column label="评论内容" align="center" prop="content" :show-overflow-tooltip="true" />
          <el-table-column label="举报类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.typeCode | arrFilter(['value', 'label'], reportOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="举报人id" align="center" prop="memberId" width="110" :show-overflow-tooltip="true" />
          <el-table-column label="评论类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | arrFilter(['value', 'label'], replyOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['value', 'label'], statusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" label="创建时间" align="center" prop="createdAt" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" label="更新时间" align="center" prop="updatedAt" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updatedAt) }}</span>
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
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { deleteCartoonReport, listCartoonReport, editCartoonReportStatus } from '@/api/cartoonReview'

export default {
  name: 'CartoonReply',
  components: {

  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      cartoonComList: [],
      // 关系表类型
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '禁用' },
        { value: 3, label: '审核中' },
        { value: 4, label: '审核不通过' }
      ],
      reportOptions: [
        { value: 1, label: '广告诈骗' },
        { value: 2, label: '政治敏感' },
        { value: 3, label: '色情暴力' },
        { value: 4, label: '其他' }
      ],
      replyOptions: [
        { value: 1, label: '主题' },
        { value: 2, label: '回复' }
      ],
      dateRange: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        commentId: undefined,
        content: undefined,
        memberId: undefined,
        typeCode: undefined,
        type: undefined,
        status: undefined,
        idOrder: 'desc'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listCartoonReport(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.cartoonComList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteCartoonReport({ ids: Ids })
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
    changeStatues(item) {
      const Ids = this.ids.join(',')
      this.$confirm(`是否修改id:${Ids}的状态为${item.label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editCartoonReportStatus({ ids: this.ids, status: item.value }).then(res => {
          this.getList()
          this.msgSuccess(res.msg)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item_parantLabel_box {
    display: inline-flex;
    .el-select {
        width: 80px;
        margin-right: 5px;
    }
    .el-input {
        width: 199px;
    }
}
</style>
