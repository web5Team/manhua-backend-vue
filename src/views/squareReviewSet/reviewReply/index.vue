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
          <el-form-item label="评论人id" prop="commentMemberId">
            <el-input
              v-model.number="formData.commentMemberId"
              placeholder="请输入评论人id"
              clearable
              size="small"
              @input="() => enterNumber(formData.commentMemberId, formData, 'commentMemberId')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="回复人id" prop="memberId">
            <el-input
              v-model.number="formData.memberId"
              placeholder="请输入回复人id"
              clearable
              size="small"
              @input="() => enterNumber(formData.memberId, formData, 'memberId')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="回复内容" prop="content">
            <el-input v-model="formData.content" placeholder="请输入回复内容" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="点赞数" prop="like">
            <div class="item_label_box">
              <el-select v-model="formData.likeType" clearable placeholder="选择" size="small">
                <el-option v-for="dict in likeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
              <el-input
                v-model.number="formData.like"
                placeholder="请输入点赞数"
                clearable
                size="small"
                @input="() => enterNumber(formData.like, formData, 'like')"
                @keyup.enter.native="handleQuery"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: 15px">
          <el-button
            v-permisaction="['squareReview:reply:remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="ids.length == 0"
            @click="deleteData"
            >删除</el-button
          >
          <el-dropdown v-permisaction="['squareReview:reply:change']" style="margin-left: 10px" @command="changeStatues">
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
          <el-table-column label="评论人id" width="100" align="center" prop="commentMemberId" :show-overflow-tooltip="true" />
          <el-table-column label="回复人id" sortable="custom" width="100" align="center" prop="memberId" :show-overflow-tooltip="true" />
          <el-table-column label="回复内容" align="center" prop="content" />
          <el-table-column label="点赞数" sortable="custom" width="100" align="center" prop="like" />
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
import { squareReviewReplyList, editSquareReviewReplyStatus, delSquareReviewReply } from '@/api/squareReviewApi'
export default {
  name: 'FilmReply',
  data() {
    return {
      formData: {
        id: undefined,
        commentId: undefined,
        commentMemberId: undefined,
        memberId: undefined,
        content: '',
        like: undefined,
        likeType: '',
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
          label: '启用'
        },
        {
          value: 2,
          label: '禁用'
        },
        {
          value: 3,
          label: '审核中'
        },
        {
          value: 4,
          label: '审核不通过'
        }
      ],
      likeOptions: [
        {
          value: '=',
          label: '='
        },
        {
          value: '!=',
          label: '!='
        },
        {
          value: '>',
          label: '>'
        },
        {
          value: '<',
          label: '<'
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
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
        const { data } = await squareReviewReplyList(this.formData)
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
      this.formData.likeType = ''
      this.resetForm(name)
      this.handleQuery()
    },
    deleteData(row) {
      const ids = row.id || this.ids.join(',')
      this.$confirm(`是否确认删除 ${ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSquareReviewReply(ids).then((res) => {
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
      const memberIds = []
      this.listTabel.forEach((i) => {
        if (this.ids.includes(i.id)) {
          memberIds.push(i.memberId)
        }
      })
      this.$confirm(`是否修改id:${ids}的状态为${statusName}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editSquareReviewReplyStatus({ ids, status, memberIds: memberIds.join(',') }).then(() => {
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

<style lang="scss" scoped>
.item_label_box {
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
