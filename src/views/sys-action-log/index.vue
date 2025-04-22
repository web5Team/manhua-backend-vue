<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item label="系统模块" prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入系统模块"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="请求地址" prop="operUrl">
            <el-input
              v-model="queryParams.operUrl"
              placeholder="请输入请求地址"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="操作人员" prop="operName">
            <el-input
              v-model="queryParams.operName"
              placeholder="请输入操作人员"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="类型" prop="businessType">
            <el-select
              v-model="queryParams.businessType"
              placeholder="操作类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作状态码" prop="status" label-width="70">
            <el-input
              v-model="queryParams.status"
              type="number"
              placeholder="请输入操作状态码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="操作日期">
            <el-date-picker
              v-model="dateRange"
              size="small"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysoperlog:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysoperlog:clean']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleClean"
            >清空</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysoperlog:export']"
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          border
          :data="list"
          :default-sort="{prop: 'operTime', order: 'descending'}"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" width="80" align="center" prop="id" sortable="custom" />
          <el-table-column label="系统模块" align="center" prop="title" />
          <el-table-column label="操作类型" width="80" align="center" prop="businessType" :formatter="typeFormat" />
          <el-table-column label="请求方式" width="80" align="center" prop="requestMethod" :show-overflow-tooltip="true" />
          <el-table-column label="请求地址" align="center" prop="operUrl" :show-overflow-tooltip="true" />
          <el-table-column label="操作状态码" align="center" prop="status" :show-overflow-tooltip="true" />
          <el-table-column label="请求参数" prop="operParam" width="80">
            <template slot-scope="scope">
              <div>
                <el-popover v-if="scope.row.operParam" placement="top-start" trigger="hover">
                  <div class="popover-box">
                    <pre>{{ fmtBody(scope.row.operParam) }}</pre>
                  </div>
                  <i slot="reference" class="el-icon-view"></i>
                </el-popover>
                <span v-else>无</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="返回参数" prop="jsonResult" width="80">
            <template slot-scope="scope">
              <div>
                <el-popover v-if="scope.row.jsonResult" placement="top-start" trigger="hover">
                  <div class="popover-box">
                    <pre>{{ fmtBody(scope.row.jsonResult) }}</pre>
                  </div>
                  <i slot="reference" class="el-icon-view"></i>
                </el-popover>
                <span v-else>无</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作人员" align="center" prop="operName" :show-overflow-tooltip="true" />
          <el-table-column label="主机" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
          <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true" />
          <el-table-column label="操作日期" align="center" prop="operTime" width="180" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.operTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:sysoperlog:query']"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row,scope.index)"
              >详细</el-button>
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

        <!-- 操作日志详细 -->
        <el-dialog title="操作日志详细" :visible.sync="open" width="700px">
          <el-form ref="form" :model="form" label-width="100px" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
                <el-form-item
                  label="登录信息："
                >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
                <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="耗时：">{{ form.latencyTime }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作状态码：">{{ form.status }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.status === 1" label="异常信息：">{{ form.errorMsg }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="open = false">关 闭</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listSysOperlog, delSysOperlog, cleanOperlog } from '@/api/sys-action-log'
import { formatJson } from '@/utils'

export default {
  name: 'Operlog',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
        operTimeOrder: 'desc'
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_oper_type').then(response => {
      this.typeOptions = response.data
    })
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true
      listSysOperlog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType)
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
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = (row.id && [row.id]) || this.ids
      this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSysOperlog({ ids: operIds })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return cleanOperlog()
      }).then(() => {
        this.getList()
        this.msgSuccess('清空成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // const queryParams = this.queryParams
      this.$confirm('是否确认导出所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['日志编号', '系统模块', '操作类型', '请求方式', '操作人员', '主机', '操作地点', '操作状态', '操作url', '操作日期']
          const filterVal = ['ID', 'title', 'businessType', 'method', 'operName', 'operIp', 'operLocation', 'status', 'operUrl', 'operTime']
          const list = this.list
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '操作日志',
            autoWidth: true, // Optional
            bookType: 'xlsx' // Optional
          })
          this.downloadLoading = false
        })
      })
    },
    fmtBody(value) {
      try {
        return JSON.parse(value)
      } catch (err) {
        return value
      }
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
    }
  }
}
</script>

<style lang="scss">
.popover-box {
  background: #112435;
  color: #f08047;
  height: 600px;
  width: 420px;
  overflow: auto;
}
.popover-box::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>

