
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
          <el-form-item label="任务ID" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入任务ID" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入任务名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="采集类型" prop="grabType">
            <el-select v-model="queryParams.grabType" clearable placeholder="采集类型">
              <el-option v-for="dict in grabTypelOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="采集方式" prop="grabMode">
            <el-select v-model="queryParams.grabMode" clearable placeholder="采集方式">
              <el-option v-for="dict in grabModelOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" clearable placeholder="状态">
              <el-option v-for="dict in stateOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否加新漫画" prop="addCartoonStatus" label-width="100px">
            <el-select v-model="queryParams.addCartoonStatus" clearable placeholder="请选择">
              <el-option v-for="dict in addCartoonStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
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
              v-permisaction="['admin:crawlerTask:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:crawlerTask:edit']"
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
              v-permisaction="['admin:crawlerTask:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          border
          :data="crawlerTaskList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="ID" width="80" align="center" prop="id" sortable="custom" />
          <el-table-column label="任务名称" align="center" prop="name" />
          <el-table-column label="采集类型" align="center" prop="grabType" :formatter="showGrabType" />
          <el-table-column label="采集规则ID" width="100" align="center" prop="ruleId" />
          <el-table-column label="源站漫画编号" align="center" prop="grabTypeContent" />
          <el-table-column label="同时采集数量" align="center" prop="numberCartoons" />
          <el-table-column label="更新列表采集数量" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.cutNum == 0 ? '无限' : scope.row.cutNum }}
            </template>
          </el-table-column>
          <el-table-column label="当前运行状态" align="center" prop="runningState" :formatter="showRunningState" />
          <el-table-column label="采集方式" align="center" prop="grabMode" :formatter="showGrabMode" />
          <el-table-column label="运行次数" align="center" prop="runNum" />
          <el-table-column label="采集次数" align="center" prop="grabModeNumber" />
          <el-table-column label="状态" align="center" prop="state" :formatter="showState" />
          <el-table-column label="是否加新书" align="center" prop="addCartoonStatus" :formatter="addCartoonStatusFormat" />
          <el-table-column label="休眠时长(秒)" align="center" prop="sleepTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:crawlerTask:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                v-permisaction="['admin:crawlerTask:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                v-permisaction="['admin:crawlerTask:log']"
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleTaskLog(scope.row)"
                >日志</el-button
              >
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

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-click-modal="false">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="form.name" placeholder="任务名称" />
            </el-form-item>
            <el-form-item label="采集方式">
              <!-- "采集方式, 1:无限循环采集 2:指定次数采集" -->
              <el-select v-model="form.grabMode" placeholder="请选择" @change="grabModechange">
                <el-option v-for="dict in grabModeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item v-show="grabMode_flag" ref="grabModeNumber" label="采集次数" prop="grabModeNumber">
              <el-input v-model="form.grabModeNumber" placeholder="采集次数" />
            </el-form-item>
            <!-- 采集方式 1:更新列表 2:单本小说采集 -->
            <el-form-item label="采集类型" prop="grabType">
              <el-select v-model="form.grabType" placeholder="请选择" @change="grabTypechange">
                <el-option v-for="dict in grabTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="同时采集数量" prop="numberCartoons">
              <el-input v-model="form.numberCartoons" placeholder="同一时间采集漫画数量" />
            </el-form-item>
            <el-form-item v-show="grabType_flag" label="源站漫画编号" prop="grabTypeContent">
              <el-input v-model="form.grabTypeContent" placeholder="多个编号英文逗号分割(eg:1,2,3)或者指定编号区间(eg:1-100)" />
            </el-form-item>
            <el-form-item v-show="!grabType_flag" label="更新列表采集数量" prop="cutNum">
              <el-input v-model="form.cutNum" placeholder="更新列表采集数量" />
            </el-form-item>
            <el-form-item label="采集规则" prop="ruleId">
              <el-select
                v-model="form.ruleId"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="规则选择"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in ruluOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.status == 1 ? false : true"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="休眠时长(秒)" prop="sleepTime">
              <el-input v-model="form.sleepTime" placeholder="休眠时长,单位:秒 " />
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="form.state" placeholder="请选择">
                <el-option v-for="dict in stateOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否加新漫画" prop="addCartoonStatus">
              <el-select v-model="form.addCartoonStatus" placeholder="请选择">
                <el-option v-for="dict in addCartoonStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="运行状态" prop="runningState">
              <el-select v-model="form.runningState" :disabled="true">
                <el-option v-for="dict in runningStateOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 查看任务执行日志对话框 -->
        <el-dialog title="查看任务日志" :visible.sync="openTaskLog" width="70%" :close-on-click-modal="false">
          <el-form ref="queryTaskLogForm" :model="queryTaskLogParams" :inline="true" label-width="68px">
            <el-form-item label="日志ID" prop="id">
              <el-input v-model="queryTaskLogParams.id" placeholder="请输入" clearable size="small" @keyup.enter.native="handleQueryLog" />
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="queryTaskLogParams.remarks"
                placeholder="请输入执行任务备注"
                clearable
                size="small"
                @keyup.enter.native="handleQueryLog"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryTaskLogParams.status" clearable placeholder="状态">
                <el-option v-for="dict in logStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryLog">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQueryLog">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                v-permisaction="['crawler:crawlertasklog:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multipleLog"
                @click="handleTaskLogDelete"
                >删除</el-button
              >
            </el-col>
          </el-row>

          <el-table v-loading="taskLogLoading" :data="crawlerTaskLogList" @selection-change="handleLogSelectionChange">
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column label="ID" width="80" align="center" prop="id" />
            <el-table-column label="任务ID" align="center" prop="taskId" />
            <el-table-column label="任务名称" width="150" align="center" prop="taskName" />
            <el-table-column label="备注" width="200" align="center" prop="remarks" :show-overflow-tooltip="true" />
            <el-table-column label="状态" width="150" align="center" prop="status">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === '1' ? 'danger' : 'success'" disable-transitions>{{ logStatusFormat(scope.row) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createdAt">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="updatedAt">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updatedAt) || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  v-permisaction="['crawler:crawlertasklog:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleTaskLogDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="totalTaskLog > 0"
            :total="totalTaskLog"
            :page.sync="queryTaskLogParams.pageIndex"
            :limit.sync="queryTaskLogParams.pageSize"
            @pagination="getCrawlerLogList"
          />
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addCrawlerTask,
  delCrawlerTask,
  getCrawlerTask,
  listCrawlerTask,
  updateCrawlerTask,
  listRule,
  delCrawlerTaskLog
} from '@/api/crawler-task'
import { listCrawlerTaskLog } from '@/api/crawler-task-log'

export default {
  name: 'CrawlerTask',
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      taskLogLoading: true,
      // 选中数组
      ids: [],
      // 选中的数组-任务日志
      taskLogIds: [],
      // 非单个禁用
      single: true,
      // 非单个禁用-任务日志
      singleLog: true,
      // 非多个禁用
      multiple: true,
      // 非多个禁用-任务日志
      multipleLog: true,
      // 总条数
      total: 0,
      totalTaskLog: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否任务日志弹出层
      openTaskLog: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      ruleList: [],
      crawlerTaskList: [],
      // 任务日志类型数据字典
      logStatusOptions: [{ dictValue: 1, dictLabel: '执行成功' }, { dictValue: 2, dictLabel: '执行失败' }],
      crawlerTaskLogList: [],
      ruluOptions: [],
      grabModeOptions: [{ value: 1, label: '无限循环采集' }, { value: 2, label: '指定次数采集' }],
      grabModelOptions: [{ value: 1, label: '无限循环采集' }, { value: 2, label: '指定次数采集' }],
      grabTypeOptions: [{ value: 1, label: '更新列表' }, { value: 2, label: '单本漫画采集' }],
      grabTypelOptions: [{ value: 1, label: '更新列表' }, { value: 2, label: '单本漫画采集' }],
      runningStateOptions: [
        { value: 1, label: '运行中' },
        { value: 2, label: '暂停' },
        { value: 3, label: '停止' },
        { value: 4, label: '异常退出' },
        { value: 5, label: '完成' },
        { value: 6, label: '运行超时' },
        { value: 7, label: '待运行' }
      ],
      stateOptions: [{ value: 1, label: '启用' }, { value: 2, label: '禁用' }],
      addCartoonStatusOptions: [{ dictValue: 1, dictLabel: '是' }, { dictValue: 2, dictLabel: '否' }],
      // 查询参数
      queryParams: {
        id: undefined,
        name: '',
        grabType: undefined,
        grabMode: undefined,
        state: undefined,
        addCartoonStatus: undefined,
        pageIndex: 1,
        pageSize: 10,
        idOrder: 'desc'
      },
      // 任务日志查询参数
      queryTaskLogParams: {
        pageIndex: 1,
        pageSize: 10,
        taskId: 0,
        remarks: '',
        status: ''
      },
      issshow: false,
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        id: [{ required: true, message: '自增id不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        grabType: [{ required: true, message: '采集类型,不能为空', trigger: 'blur' }],
        state: [{ required: true, message: '设置状态,不能为空', trigger: 'blur' }],
        sleepTime: [{ required: true, message: '休眠时长,不能为空', trigger: 'blur' }],
        grabMode: [{ required: true, message: '采集方式,不能为空', trigger: 'blur' }]
      },
      grabType_flag: false,
      grabMode_flag: false
    }
  },
  created() {
    this.getList()
    this.remoteMethod()
  },
  methods: {
    remoteMethod(query) {
      // 调用接口
      setTimeout(() => {
        var queryObj = {
          name: query,
          pageSize: 99999
        }
        listRule(queryObj).then(response => {
          this.ruluOptions = response.data.list
          this.loading = false
        })
      }, 200)
    },
    showState(row) {
      if (row.state === 1) {
        return '启用'
      } else if (row.state === 2) {
        return '禁用'
      } else {
        return '未知'
      }
    },
    showGrabType(row) {
      if (row.grabType === 1) {
        return '更新列表'
      } else if (row.grabType === 2) {
        return '单本小说'
      } else {
        return '未知'
      }
    },
    showGrabMode(row) {
      if (row.grabMode === 1) {
        return '无限循环采集'
      } else if (row.grabMode === 2) {
        return '指定次数采集'
      } else {
        return '未知'
      }
    },
    showRunningState(row) {
      if (row.runningState === 1) {
        return '运行中'
      } else if (row.runningState === 2) {
        return '暂停'
      } else if (row.runningState === 3) {
        return '停止'
      } else if (row.runningState === 4) {
        return '异常退出'
      } else if (row.runningState === 5) {
        return '完成'
      } else if (row.runningState === 6) {
        return '运行超时'
      } else if (row.runningState === 7) {
        return '待运行'
      } else {
        return '未知状态'
      }
    },
    // 是否加新书状态字典转换
    addCartoonStatusFormat(row) {
      return this.selectDictLabel(this.addCartoonStatusOptions, row.addCartoonStatus)
    },
    grabModechange(val) {
      if (val === 1) {
        // 无限循环采集,不需填写循环次数
        this.grabMode_flag = false
      } else {
        this.grabMode_flag = true
      }
    },
    grabTypechange(val) {
      if (val === 1) {
        // 更新列表,不需填写循环次数
        this.grabType_flag = false
      } else {
        this.grabType_flag = true
      }
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      this.ruleList = {}
      listRule({ pageIndex: 1, pageSize: 1000 }).then(response => {
        for (var i = 0; i < response.data.list.length; i++) {
          this.ruleList[response.data.list[i].id] = response.data.list[i]
        }
        listCrawlerTask(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.crawlerTaskList = response.data.list
          this.total = response.data.count
          this.loading = false
        })
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        createdTime: undefined,
        grabMode: undefined,
        grabModeNumber: undefined,
        grabType: undefined,
        grabTypeContent: undefined,
        id: undefined,
        isDelete: undefined,
        name: undefined,
        numberCartoons: undefined,
        ruleId: undefined,
        runningState: undefined,
        sleepTime: undefined,
        state: undefined,
        updatedTime: undefined,
        cutNum: undefined
      }
      this.resetForm('form')
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加采集任务'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getCrawlerTask(id).then(response => {
        // 如果采集方式是指定次数，才可以设置指定采集的次数
        if (response.data.grabMode === 2) {
          this.grabMode_flag = true
        } else {
          this.grabMode_flag = false
        }
        if (response.data.grabType === 2) {
          this.grabType_flag = true
        } else {
          this.grabType_flag = false
        }
        this.form = response.data
        this.open = true
        this.title = '修改采集任务'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 字符转类型
          this.form.grabMode = parseInt(this.form.grabMode)
          this.form.sleepTime = parseInt(this.form.sleepTime)
          this.form.grabModeNumber = parseInt(this.form.grabModeNumber)
          this.form.numberCartoons = parseInt(this.form.numberCartoons)
          this.form.ruleId = parseInt(this.form.ruleId)
          this.form.cutNum = parseInt(this.form.cutNum)
          if (this.form.id !== undefined) {
            updateCrawlerTask(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addCrawlerTask(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delCrawlerTask({ ids: Ids })
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
    // ----------------------------任务日志--------------------------------------
    handleQueryLog() {
      this.queryTaskLogParams.pageIndex = 1
      this.getCrawlerLogList()
    },
    resetQueryLog() {
      this.dateRange = []
      this.resetForm('queryTaskLogForm')
      this.handleQueryLog()
    },
    // 多选框选中数据
    handleLogSelectionChange(selection) {
      this.taskLogIds = selection.map(item => item.id)
      this.singleLog = selection.length !== 1
      this.multipleLog = !selection.length
    },
    // 获取任务日志列表
    getCrawlerLogList() {
      this.taskLogLoading = true
      listCrawlerTaskLog(this.addDateRange(this.queryTaskLogParams, this.dateRange)).then(response => {
        this.crawlerTaskLogList = response.data.list
        this.totalTaskLog = response.data.count
        this.taskLogLoading = false
      })
    },
    // 任务日志类型字典转换
    logStatusFormat(row) {
      return this.selectDictLabel(this.logStatusOptions, row.status)
    },
    // 查看任务日志操作
    handleTaskLog(row) {
      this.openTaskLog = true
      this.queryTaskLogParams.taskId = row.id
      this.getCrawlerLogList()
    },
    /** 删除任务日志操作 */
    handleTaskLogDelete(row) {
      const Ids = row.id || this.taskLogIds
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delCrawlerTaskLog(Ids)
        })
        .then(() => {
          this.getCrawlerLogList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    }
  }
}
</script>
