<template>
  <CardBox>
    <el-form ref="formData" :inline="true" :model="formData" size="small">
      <el-form-item :label="typeTxt + 'id'" prop="recommendId">
        <el-input v-model="formData.recommendId" :placeholder="'请输入' + typeTxt + 'id'" clearable size="small" @input="() => enterNumber(formData.recommendId, formData, 'recommendId')" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="举报人id" prop="reportMemberId">
        <el-input v-model="formData.reportMemberId" placeholder="请输入举报人id" clearable size="small" @input="() => enterNumber(formData.reportMemberId, formData, 'reportMemberId')" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="举报状态" prop="status">
        <el-select v-model="formData.status" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in statusOptons" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="举报类型" prop="typeCode">
        <el-select v-model="formData.typeCode" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in reportTypeOptons" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="举报次数" prop="reportCount">
        <div class="item_label_box">
          <el-select v-model="formData.reportCountType" clearable placeholder="选择" size="small">
            <el-option v-for="dict in reportOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
          <el-input v-model.number="formData.reportCount" placeholder="请输入举报次数" clearable size="small" @keyup.enter.native="handleQuery" />
        </div>
      </el-form-item>
      <el-form-item label="广场类型" prop="squareType">
        <el-select v-model="formData.squareType" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in squareTypeOptons" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top:15px">
      <el-button v-permisaction="['squareReport:btn:remove']" type="danger" size="mini" icon="el-icon-delete" :disabled="ids.length == 0" @click="deleteData">删除</el-button>
      <el-dropdown v-permisaction="['squareReport:btn:change']" style="margin-left: 10px;" @command="changeStatues">
        <el-button type="primary" size="mini" :disabled="ids.length == 0">
          修改举报状态
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in statusOptons" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
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
      <el-table-column :label="typeTxt + 'id'" fixed align="center" prop="recommendId" width="110" sortable="custom" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="广场类型" align="center" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.status | arrFilter(['value', 'label'], squareTypeOptons) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column v-if="formData.squareType === 2" :label="typeTxt + '标题'" align="center" prop="intro" min-width="200" :show-overflow-tooltip="true" />
      <!-- <el-table-column v-if="" label="话题描述" align="center" prop="memberId" min-width="300" :show-overflow-tooltip="true" /> -->
      <el-table-column label="创建人id" align="center" width="110" prop="preportMemberId" />
      <el-table-column label="举报人id" align="center" width="110" prop="reportMemberId" sortable="custom" />
      <el-table-column :label="typeTxt +'标题'" align="center" prop="content" />
      <el-table-column label="举报类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeCode | arrFilter(['value', 'label'], reportTypeOptons) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="举报次数" align="center" width="110" prop="reportCount" />
      <el-table-column label="举报状态" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.status | arrFilter(['value', 'label'], statusOptons) }}</span>
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
    <pagination v-show="total > 0" :total="total" :page.sync="formData.pageIndex" :limit.sync="formData.pageSize" @pagination="getList" />
  </CardBox>
</template>

<script>
import { listSquarteReport, editSquarteReportStatus, delSquarteReport } from '@/api/squareSetApi'
export default {
  name: 'VideoSheet',
  components: {

  },
  data() {
    return {
      formData: {
        recommendId: undefined,
        reportMemberId: undefined,
        typeCode: undefined,
        reportCount: '',
        reportCountType: undefined,
        status: undefined,
        squareType: 1,
        pageIndex: 1,
        pageSize: 10,
        sort: 'id',
        order: 'descending'
      },
      listTabel: [],
      ids: [],
      loading: false,
      total: 0,
      statusOptons: [{ value: 1, label: '已审核' }, { value: 2, label: '未审核' }, { value: 3, label: '审核不通过' }],
      reportTypeOptons: [{ value: 1, label: '相似内容太多' }, { value: 2, label: '内容质量太差' }],
      squareTypeOptons: [{ value: 1, label: '推荐' }],
      reportOptions: [
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
      ]
    }
  },
  computed: {
    typeTxt() {
      const arr = this.squareTypeOptons.filter(i => i.value === this.formData.squareType)
      if (arr.length) {
        return arr[0].label
      } else {
        return ''
      }
    }
  },
  created() {

  },
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
        const { data } = await listSquarteReport(this.formData)
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
      this.formData.reportCountType = undefined
      this.resetForm(name)
      this.handleQuery()
    },
    deleteData(row) {
      const Ids = row && row.id ? row.id.toString() : this.ids.join(',')
      this.$confirm(`是否确认删除 ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSquarteReport(Ids).then(res => {
          this.$message.success(res.msg)
          this.getList()
        })
      })
    },
    handleSelectionChange(selection) {
      let ids = []
      selection.forEach(item => {
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
      const objArr = this.statusOptons.filter(i => i.value === status)
      const ids = typeof row === 'string' ? row : String(row.id)
      this.$confirm(`是否修改id:${ids}的状态为${objArr[0].label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editSquarteReportStatus({ ids, status }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    },
    selectAll(selection) {
      const isSelect = selection.some(el => {
        const tableDataIds = this.listTabel.map(j => j.Id)
        return tableDataIds.includes(el.Id)
      })
      if (isSelect) {
        selection.map(el => {
          if (el.children) {
            el.children.map(j => {
              this.toggleSelection(j, true)
            })
          }
        })
      } else {
        this.listTabel.map(el => {
          if (el.children) {
            el.children.map(j => {
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
