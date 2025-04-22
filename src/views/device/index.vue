
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="queryParams.nickname" placeholder="请输入昵称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="邀请码" prop="inviteCode">
            <el-input v-model="queryParams.inviteCode" placeholder="请输入邀请码" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="设备号" prop="device">
            <el-input v-model="queryParams.device" placeholder="请输入设备号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="ip" prop="regIp">
            <el-input v-model="queryParams.regIp" placeholder="请输入ip" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="邀请id" prop="pid">
            <el-input v-model="queryParams.pid" placeholder="请输入邀请id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="邀请人数" prop="inviteNum">
            <div class="item_parantLabel_box">
              <el-select v-model="queryParams.inviteNumType" placeholder="选择" size="small">
                <el-option v-for="dict in likeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
              <el-input v-model.number="queryParams.inviteNum" placeholder="请输入邀请人数" clearable size="small" @keyup.enter.native="handleQuery" />
            </div>
          </el-form-item>
          <el-form-item label="应用id" prop="appId">
            <appNameCon :select-val.sync="queryParams.appId" :is-clearable="false" :is-sel-first="true"></appNameCon>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button :loading="loading" size="mini" icon="el-icon-download" type="success" @click="handleExport">导出盗链IP</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:device:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:device:edit']"
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
              v-permisaction="['admin:device:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:device:advertSet']" type="primary" size="mini" icon="el-icon-delete" :disabled="ids.length != 1" @click="advertSetNow">免广告设置</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          border
          :data="deviceList"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" align="center" prop="id" sortable="custom" :show-overflow-tooltip="true" />
          <el-table-column label="用户名" align="center" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="昵称" align="center" prop="nickname" :show-overflow-tooltip="true" />
          <el-table-column label="设备号" align="center" prop="device" :show-overflow-tooltip="true" width="180" />
          <el-table-column label="ip" align="center" prop="regIp" :show-overflow-tooltip="true" width="180" />
          <el-table-column label="应用名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.appId | arrFilter(['id', 'appName'], appNameOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邀请码" align="center" prop="inviteCode" :show-overflow-tooltip="true" />
          <el-table-column label="邀请id" align="center" width="100" prop="pid" sortable="custom" :show-overflow-tooltip="true" />
          <el-table-column label="成功邀请人数" align="center" prop="inviteNum" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['dictValue', 'dictLabel'], statusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="免广告时间" align="center" prop="freeTime" :show-overflow-tooltip="true" width="180" />
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
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:device:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:device:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="昵称" />
            </el-form-item>
            <el-form-item label="设备号" prop="device">
              <el-input v-model="form.device" placeholder="设备号" />
            </el-form-item>
            <el-form-item label="应用id" prop="appId">
              <appNameCon :select-val.sync="form.appId"></appNameCon>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <advertSetMask :open.sync="openAdvert" :form-data="advertForm" @successAdvert="successAdvert"></advertSetMask>
        <exportMask :open.sync="openExport" :form-data.sync="queryParams" @successAdvert="successAdvert"></exportMask>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addDevice, delDevice, getDevice, listDevice, updateDevice } from '@/api/device'
import { listApp } from '@/api/app'
import appNameCon from '@/components/AppNameCON'
import advertSetMask from './components/advertSetMask'
import exportMask from './components/exportMask'

export default {
  name: 'Device',
  components: {
    appNameCon,
    advertSetMask,
    exportMask
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      fileOpen: false,
      fileIndex: undefined,
      // 类型数据字典
      typeOptions: [],
      deviceList: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        appId: undefined,
        nickname: undefined,
        device: undefined,
        pid: undefined,
        inviteNum: undefined,
        status: undefined,
        inviteNumType: undefined,
        username: undefined,
        inviteCode: undefined,
        idOrder: 'desc'
      },
      statusOptions: [
        {
          dictValue: 1,
          dictLabel: '正常'
        },
        {
          dictValue: 2,
          dictLabel: '禁用'
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
      // 表单参数
      form: {
      },
      advertForm: {},
      openExport: false,
      // 表单校验
      rules: {
        appId: [
          { required: true, message: '应用id不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        device: [
          { required: true, message: '设备号不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      openAdvert: false,
      appNameOptions: [],
      initAppid: ''
    }
  },
  watch: {
    'queryParams.appId'(val) {
      if (!this.initAppid) {
        this.initAppid = val
      }
      this.handleQuery()
    }
  },
  created() {
    this.getAppnameList()
  },
  methods: {
    handleExport() {
      this.openExport = true
    },
    async getAppnameList() {
      const { data } = await listApp({ pageIndex: 1, pageSize: 9999, idOrder: 'asc' })
      this.appNameOptions = data.list
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listDevice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.deviceList = response.data.list
        this.total = response.data.count
        this.loading = false
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
        id: undefined,
        appId: undefined,
        nickname: undefined,
        device: undefined,
        status: 1
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
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
      this.queryParams.inviteNumType = undefined
      this.dateRange = []
      this.resetForm('queryForm')
      this.queryParams.appId = this.initAppid
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加设备管理'
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
      const id =
      row.id || this.ids
      getDevice(id, this.queryParams.appId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改设备管理'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateDevice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addDevice(this.form).then(response => {
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
      const paramsObj = { appId: this.queryParams.appId, ids: Ids }
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDevice(paramsObj)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    advertSetNow() {
      const obj = {
        id: this.ids[0],
        appId: this.queryParams.appId
      }
      this.advertForm = obj
      this.openAdvert = true
    },
    successAdvert() {
      this.handleQuery()
      this.openAdvert = false
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
      this.getList()
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
