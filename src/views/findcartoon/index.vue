
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="用户id" prop="memberId">
            <el-input v-model="queryParams.memberId" placeholder="请输入用户id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="设备号" prop="device">
            <el-input v-model="queryParams.device" placeholder="请输入设备号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="漫画名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入漫画名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="关键字" prop="keyword">
            <el-input v-model="queryParams.keyword" placeholder="请输入关键字" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="请选择状态" size="small" @change="handleQuery">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
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
              v-permisaction="['admin:findcartoon:reply']"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >回复
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:findcartoon:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown v-permisaction="['admin:findcartoon:change']" style="margin-left: 10px;" @command="changeStatues">
              <el-button type="primary" size="mini" :disabled="ids.length == 0">
                修改状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in statusOptions" :key="item.dictValue" :command="item">{{ item.dictLabel }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          border
          :data="findcartoonList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" align="center" prop="id" sortable="custom" :show-overflow-tooltip="true" />
          <el-table-column label="设备号" align="center" prop="device" width="180" :show-overflow-tooltip="true" />
          <el-table-column label="用户id" align="center" width="100" prop="memberId" sortable="custom" :show-overflow-tooltip="true" />
          <el-table-column label="漫画名" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="关键字" align="center" prop="keyword" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" :formatter="statusFormat">
            <template slot-scope="scope">
              {{ statusFormat(scope.row) }}
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
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:findcartoon:reply']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >回复
              </el-button>
              <el-button
                v-permisaction="['admin:findcartoon:remove']"
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
        <el-dialog :title="title" :visible.sync="open" width="60%">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="消息标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入消息标题" />
            </el-form-item>
            <el-form-item label="消息内容" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="6" resize="none" placeholder="请输入消息内容" />
            </el-form-item>
            <el-form-item label="消息类型" prop="type">
              <el-select v-model="form.type" clearable placeholder="请选择状态" size="small" disabled>
                <el-option v-for="dict in messageOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="内容参数" prop="extra">
              <el-input
                v-model="form.extra"
                :disabled="form.type === 7"
                clearable
                size="small"
                @input="form.extra = form.extra.replace(/[^\d]/g, '')"
              />
            </el-form-item>
            <el-form-item label="发送目标" prop="target">
              <el-select v-model="form.target" clearable placeholder="请选择状态" disabled size="small">
                <el-option v-for="dict in sendTargetOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备号" prop="devices">
              <el-input v-model="form.devices" placeholder="请输入设备号" />
              <div class="tips">选择自定义目标时，设备号必填</div>
            </el-form-item>
            <el-form-item label="系统平台" prop="platform">
              <el-radio-group v-model="form.platform">
                <el-radio v-for="dict in systemOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发送类型" prop="sendType">
              <el-radio-group v-model="form.sendType">
                <el-radio v-for="dict in sendTypeOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addFindcartoon, delFindcartoon, listFindcartoon, replyFindcartoon, editFindcartoonStatus } from '@/api/findcartoon'
export default {
  name: 'Findcartoon',
  components: {
  },
  data() {
    var checkTarget = (rule, value, callback) => {
      if (this.form.target !== 3) {
        callback()
      } else {
        if (!this.form.devices) {
          callback(new Error('选择自定义目标时，设备号必填'))
        } else {
          callback()
        }
      }
    }
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
      findcartoonList: [],
      // 关系表类型
      statusOptions: [
        { dictValue: 1, dictLabel: '已处理' },
        { dictValue: 2, dictLabel: '未处理' }
      ],
      systemOptions: [
        { dictValue: 1, dictLabel: '全平台' },
        { dictValue: 2, dictLabel: 'IOS' },
        { dictValue: 3, dictLabel: 'Android' }
      ],
      sendTypeOptions: [
        { dictValue: 1, dictLabel: '极光推送' },
        { dictValue: 2, dictLabel: '消息中心' },
        { dictValue: 3, dictLabel: '消息+推送' }
      ],
      messageOptions: [
        { dictValue: 2, dictLabel: '回复会员找漫画' }
      ],
      sendTargetOptions: [
        { dictValue: 1, dictLabel: '所有用户' },
        { dictValue: 2, dictLabel: '注册用户' },
        { dictValue: 3, dictLabel: '自定义' }
      ],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        device: undefined,
        memberId: undefined,
        name: undefined,
        keyword: undefined,
        status: undefined,
        idOrder: 'desc'
      },
      // 表单参数
      form: {
      },
      rowData: {},
      // 表单校验
      rules: {
        appId: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '消息内容不能为空', trigger: 'blur' }],
        platform: [{ required: true, message: '请选择系统平台', trigger: 'blur' }],
        sendType: [{ required: true, message: '请选择发送类型', trigger: 'blur' }],
        type: [{ required: true, message: '请选择消息类型', trigger: 'blur' }],
        target: [{ required: true, message: '请选择发送目标', trigger: 'blur' }],
        devices: [{ validator: checkTarget, trigger: 'blur' }]
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.resetForm('addForm')
        const { appId, device, id, name, keyword } = this.rowData
        this.form.appId = appId
        this.form.devices = device
        this.form.id = id
        this.form.feedBackId = id
        this.form.title = `查找漫画名: ${name}`
        this.form.content = `查找漫画名: ${name}, 关键词: ${keyword}`
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
      listFindcartoon(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.findcartoonList = response.data.list
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
        appId: null,
        title: null,
        content: null,
        type: 2,
        target: 3,
        sendType: null,
        platform: null,
        extra: undefined,
        id: null,
        feedBackId: null,
        devices: undefined
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加用户找书'
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
      const id = row.id || this.ids[0]
      const rowData = this.findcartoonList.filter(i => i.id === id)
      if (rowData.length) {
        this.rowData = rowData[0]
      }
      this.open = true
      this.title = '回复找漫画'
      this.isEdit = TextTrackCueList
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.feedBackId !== undefined) {
            replyFindcartoon(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addFindcartoon(this.form).then(response => {
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
        return delFindcartoon({ ids: Ids })
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
      this.$confirm(`是否修改id:${Ids}的状态为${item.dictLabel}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editFindcartoonStatus({ ids: this.ids, status: item.dictValue }).then(res => {
          this.getList()
          this.msgSuccess(res.msg)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  margin: 0;
  padding: 0;
  color: #999;
  font-size: 12px;
  line-height: 18px;
}
</style>
