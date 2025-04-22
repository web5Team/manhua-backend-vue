<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="formData" :inline="true" :model="formData" size="small">
          <el-form-item label="id" prop="id">
            <el-input
              v-model="formData.id"
              :placeholder="'请输入id'"
              clearable
              size="small"
              @input="() => enterNumber(formData.id, formData, 'id')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户id" prop="memberId">
            <el-input
              v-model="formData.memberId"
              placeholder="请输入用户id"
              clearable
              size="small"
              @input="() => enterNumber(formData.memberId, formData, 'memberId')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入用户昵称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="用户手机号码" prop="mobile">
            <el-input
              v-model="formData.mobile"
              placeholder="请输入用户手机号码"
              clearable
              size="small"
              @input="() => enterNumber(formData.mobile, formData, 'mobile')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="topicId">
            <el-select v-model="formData.topicId" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in listTag" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: 15px">
          <!-- <el-button v-permisaction="['squareList:btn:add']" type="primary" size="mini" icon="el-icon-plus" @click="add">新增</el-button> -->
          <el-button
            v-permisaction="['squareList:btn:edit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="ids.length != 1"
            @click="edit"
            >修改</el-button
          >
          <el-button
            v-permisaction="['squareList:btn:remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="ids.length == 0"
            @click="deleteData"
            >删除</el-button
          >
          <el-dropdown v-permisaction="['squareList:btn:change']" style="margin-left: 10px" @command="changeStatues">
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
          @select="select"
          @select-all="selectAll"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="推荐ID" fixed sortable="custom" width="110" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="用户ID" align="center" prop="memberId" sortable="custom" width="110" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.Member.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户手机号" align="center" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.Member.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签" align="center" prop="Topics" min-width="200" :show-overflow-tooltip="true" />
          <el-table-column label="推荐标题" align="center" prop="content" min-width="200" :show-overflow-tooltip="true" />
          <el-table-column label="推荐漫画名称" align="center" min-width="130" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.Cartoon.name }}</span>
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
        <AddSquareBox :open.sync="open" :is-edit="isEdit" :status-select="statusSelect" :form-data="form" @success="success"></AddSquareBox>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import AddSquareBox from './components/addSquareBox'
import { listSquarte, editSquarteStatus, delSquarte, listSquareTag } from '@/api/squareSetApi'

export default {
  name: 'SquareSetIndex',
  components: {
    AddSquareBox
  },
  data() {
    return {
      formData: {
        id: undefined,
        memberId: undefined,
        nickname: '',
        mobile: undefined,
        status: undefined,
        topicId: undefined,
        pageIndex: 1,
        pageSize: 10,
        sort: 'id',
        order: 'descending'
      },
      listTabel: [],
      ids: [],
      pidList: [],
      loading: false,
      total: 0,
      statusSelect: [
        { value: 1, label: '启用' },
        { value: 2, label: '审核中' },
        { value: 3, label: '禁用' }
      ],
      open: false,
      isEdit: false,
      form: {},
      listTag: []
    }
  },
  computed: {},
  watch: {
    open(val) {
      if (!val) this.form = {}
    }
  },
  created() {},
  mounted() {
    this.getList()
    this.getTagSquareList()
  },
  methods: {
    getTagSquareList() {
      listSquareTag({ pageSize: 9999, pageIndex: 1 }).then((res) => {
        this.listTag = res.data.list
      })
    },
    handleQuery() {
      this.formData.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      try {
        const { data } = await listSquarte(this.formData)
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
    add(row) {
      this.isEdit = false
      this.open = true
    },
    edit(row) {
      if (row.id) {
        this.form = row
      } else {
        let obj = {}
        this.listTabel.some((i) => {
          if (i.id === this.ids[0]) {
            obj = i
          }
          return i.id === this.ids[0]
        })
        this.form = obj
      }
      this.isEdit = true
      this.open = true
    },
    deleteData(row) {
      const Ids = row.id || this.ids.join(',')
      this.$confirm(`是否确认删除 ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSquarte(Ids).then((res) => {
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
    },
    sortChange(data) {
      this.formData.sort = data.prop
      this.formData.order = data.order || 'descending'
      this.getList()
    },
    upStatus(row, status) {
      const statusName = status === 1 ? '启用' : '禁用'
      const ids = typeof row === 'string' ? row : String(row.id)
      this.$confirm(`是否修改id:${ids}的状态为${statusName}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editSquarteStatus({ ids, status }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    },
    success() {
      this.getList()
      this.open = false
    },
    select(selection, row) {},
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
