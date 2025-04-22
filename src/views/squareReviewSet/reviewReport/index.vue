<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="formData" :inline="true" :model="formData" size="small">
          <el-form-item label="id" prop="id">
            <el-input
              v-model.number="formData.id"
              placeholder="请输入id"
              clearable
              size="small"
              @input="() => enterNumber(formData.id, formData, 'id')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="评论id" prop="commentId">
            <el-input
              v-model.number="formData.commentId"
              placeholder="请输入评论id"
              clearable
              size="small"
              @input="() => enterNumber(formData.commentId, formData, 'commentId')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="评论内容" prop="content">
            <el-input
              v-model.number="formData.content"
              placeholder="请输入评论内容"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="举报人id" prop="reportMemberId">
            <el-input
              v-model.number="formData.reportMemberId"
              placeholder="请输入举报人id"
              clearable
              size="small"
              @input="() => enterNumber(formData.reportMemberId, formData, 'reportMemberId')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="举报类型" prop="typeCode">
            <el-select v-model="formData.typeCode" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in reportOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="评论类型" prop="type">
            <el-select v-model="formData.type" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in typeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: 15px">
          <el-button
            v-permisaction="['squareReview:report:remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="ids.length == 0"
            @click="deleteData"
            >删除</el-button
          >
          <el-dropdown v-permisaction="['squareReview:report:change']" style="margin-left: 10px" @command="changeStatues">
            <el-button type="primary" size="mini" :disabled="ids.length == 0">
              修改状态
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in statusSelect" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-divider />

        <el-table
          ref="table"
          v-loading="loading"
          row-key="id"
          :data="listTabel"
          border
          @selection-change="handleSelectionChange"
          @select-all="selectAll"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="评论id" sortable="custom" width="100" align="center" prop="commentId" :show-overflow-tooltip="true" />
          <el-table-column label="评论内容" align="center" prop="content" />
          <el-table-column label="举报类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.typeCode | arrFilter(['value', 'label'], reportOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="举报人id"
            sortable="custom"
            width="100"
            align="center"
            prop="reportMemberId"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="评论类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | arrFilter(['value', 'label'], typeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['value', 'label'], statusSelect) }}</span>
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
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="formData.pageIndex"
          :limit.sync="formData.pageSize"
          @pagination="getList"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { squareReviewReportList, editSquareReviewReportStatus, delSquareReviewReport } from '@/api/squareReviewApi'
export default {
  name: 'FilmReport',
  data() {
    return {
      formData: {
        id: undefined,
        commentId: undefined,
        content: '',
        reportMemberId: undefined,
        typeCode: undefined,
        type: undefined,
        status: undefined,
        pageIndex: 1,
        pageSize: 10,
        sort: 'id',
        order: 'descending'
      },
      listTabel: [],
      ids: [],
      loading: false,
      total: 0,
      statusSelect: [
        {
          value: 1,
          label: '通过'
        },
        {
          value: 2,
          label: '未处理'
        },
        {
          value: 3,
          label: '驳回'
        }
      ],
      reportOptions: [
        {
          value: 1,
          label: '广告诈骗'
        },
        {
          value: 2,
          label: '政治敏感'
        },
        {
          value: 3,
          label: '色情暴力'
        },
        {
          value: 4,
          label: '其他'
        }
      ],
      typeOptions: [
        {
          value: 1,
          label: '评论'
        },
        {
          value: 2,
          label: '回复'
        }
      ],
      selecData: []
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    handleQuery() {
      this.formData.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      try {
        const { data } = await squareReviewReportList(this.formData)
        if (data.list && data.list.length) {
          this.listTabel = data.list
        } else {
          this.listTabel = []
        }
        this.total = data.count
      } finally {
        this.loading = false
      }
    },
    reset(name) {
      this.resetForm(name)
      this.handleQuery()
    },
    deleteData(row) {
      const Ids = row.id || this.ids.join(',')
      this.$confirm(`是否确认删除 ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSquareReviewReport(Ids).then((res) => {
          this.$message.success(res.msg)
          this.getList()
        })
      })
    },
    handleSelectionChange(selection) {
      let ids = []
      selection.forEach((item) => {
        ids = ids.concat(item.id)
      })
      this.ids = ids
      this.selecData = selection
    },
    sortChange(data) {
      this.formData.sort = data.prop
      this.formData.order = data.order || 'descending'
      this.getList()
    },
    upStatus(row, status) {
      let statusName = ''
      this.statusSelect.forEach((i) => {
        if (i.value === status) {
          statusName = i.label
        }
      })
      const ids = typeof row === 'string' ? row : String(row.id)
      this.$confirm(`是否修改id:${ids}的状态为${statusName}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editSquareReviewReportStatus({ ids, status }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    },
    selectAll(selection) {
      const isSelect = selection.some((el) => {
        const tableDataIds = this.listTabel.map((j) => j.Id)
        return tableDataIds.includes(el.Id)
      })
      if (isSelect) {
        selection.map((el) => {
          if (el.children) {
            el.children.map((j) => {
              this.toggleSelection(j, true)
            })
          }
        })
      } else {
        this.listTabel.map((el) => {
          if (el.children) {
            el.children.map((j) => {
              this.toggleSelection(j, false)
            })
          }
        })
      }
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.toggleRowSelection(row, select)
        })
      }
    },
    cancelAll() {
      this.$refs.table.clearSelection()
    },
    changeStatues(item) {
      const Ids = this.ids.join(',')
      this.upStatus(Ids, item.value)
    }
  }
}
</script>

<style lang="scss" scoped></style>

