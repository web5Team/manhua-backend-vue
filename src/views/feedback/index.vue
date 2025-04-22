
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
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="漫画名" prop="cartoonName">
            <el-input
              v-model="queryParams.cartoonName"
              placeholder="请输入漫画名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="漫画id" prop="cartoonId">
            <el-input v-model="queryParams.cartoonId" placeholder="请输入漫画id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="反馈内容" prop="content">
            <el-input v-model="queryParams.content" placeholder="请输入反馈内容" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="手机型号" prop="deviceModel">
            <el-input
              v-model="queryParams.deviceModel"
              placeholder="请输入手机型号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="系统版本" prop="sysVersion">
            <el-input
              v-model="queryParams.sysVersion"
              placeholder="请输入系统版本"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="app版本" prop="appVersion">
            <el-input
              v-model="queryParams.appVersion"
              placeholder="请输入app版本"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="class">
            <el-select v-model="queryParams.class" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in classOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="分类标签" prop="type">
            <el-select v-model="queryParams.type" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in typeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="应用id" prop="appId">
            <appNameCon :select-val.sync="queryParams.appId"></appNameCon>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:feedback:reply']"
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
              v-permisaction="['admin:feedback:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown v-permisaction="['admin:feedback:change']" style="margin-left: 10px" @command="changeStatues">
              <el-button type="primary" size="mini" :disabled="ids.length == 0">
                修改状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in statusOptions" :key="item.dictValue" :command="item">{{
                  item.dictLabel
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

        <el-table v-loading="loading" border :data="feedbackList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="应用名" width="130" align="center" prop="appName" :show-overflow-tooltip="true" />
          <el-table-column label="设备号" width="100" align="center" prop="device" :show-overflow-tooltip="true" />
          <el-table-column label="用户id" align="center" width="100" prop="memberId" sortable="custom" />
          <el-table-column label="联系方式" align="center" width="130" prop="mobile" />
          <el-table-column label="漫画id" align="center" width="100" prop="cartoonId" sortable="custom" />
          <el-table-column label="漫画名称" align="center" prop="cartoonName" />
          <el-table-column label="章节id" align="center" prop="chapterId" />
          <el-table-column label="章节名" align="center" prop="chapterName" />
          <el-table-column label="反馈内容" align="center" width="200" prop="content" />
          <el-table-column label="类型" align="center" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.class | arrFilter(['value', 'label'], classOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分类标签" align="center">
            <template slot-scope="scope">
              <span>{{ countTypeAll(scope.row.class, scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机型号" align="center" prop="deviceModel" />
          <el-table-column label="系统版本" align="center" prop="sysVersion" />
          <el-table-column label="APP版本" align="center" prop="appVersion" />
          <el-table-column label="状态" align="center" width="180" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['dictValue', 'dictLabel'], statusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="回复内容" align="center" width="200" prop="replyContent" />
          <!-- <el-table-column label="反馈截图" align="center">
              <template slot-scope="scope">
                <img class="feedback_img" v-show="scope.row.picture" :src="scope.row.picture" alt="">
              </template>
          </el-table-column> -->
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
                v-permisaction="['admin:feedback:reply']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >回复
              </el-button>
              <el-button
                v-permisaction="['admin:feedback:remove']"
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
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="应用名称" prop="appId">
              <appNameCon :select-val.sync="form.appId"></appNameCon>
            </el-form-item>
            <el-form-item label="消息标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入消息标题" clearable size="small" />
            </el-form-item>
            <el-form-item label="消息内容" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入消息内容" clearable size="small" />
            </el-form-item>
            <el-form-item label="消息类型" prop="type">
              <el-select v-model="form.type" clearable placeholder="点击选择" size="small" disabled>
                <el-option v-for="dict in messageTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="内容参数" prop="extra">
              <el-input v-model="form.extra" placeholder="请输入内容参数" clearable size="small" />
              <div>选择"漫画详情"时，在"内容参数"中输入漫画id，选择"系统通知"时，不用填"内容参数"</div>
            </el-form-item>
            <el-form-item label="发送目标" prop="target">
              <el-select v-model="form.target" clearable placeholder="点击选择" size="small" disabled>
                <el-option v-for="dict in sendMessageOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备号" prop="devices">
              <el-input v-model="form.devices" placeholder="请输入设备号" clearable size="small" />
              <div>选择自定义目标是，设备号必须填一个</div>
            </el-form-item>
            <el-form-item label="系统平台" prop="platform">
              <el-radio-group v-model="form.platform">
                <el-radio v-for="item in systemOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发送类型" prop="sendType">
              <el-radio-group v-model="form.sendType">
                <el-radio v-for="item in sendOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
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
import { addFeedback, delFeedback, getFeedback, listFeedback, replyFeedback, editFeedbackStatus } from '@/api/feedback'
import appNameCon from '@/components/AppNameCON'

export default {
  name: 'Feedback',
  components: {
    appNameCon
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
      feedbackList: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        device: undefined,
        content: undefined,
        mobile: undefined,
        class: undefined,
        type: undefined,
        status: undefined,
        memberId: undefined,
        cartoonId: undefined,
        cartoonName: undefined,
        deviceModel: undefined,
        sysVersion: undefined,
        appVersion: undefined,
        appId: undefined,
        idOrder: 'desc'
      },
      // 表单参数
      form: {},
      statusOptions: [
        {
          dictValue: 1,
          dictLabel: '已处理'
        },
        {
          dictValue: 2,
          dictLabel: '未处理'
        }
      ],
      classOptions: [
        {
          value: 1,
          label: '意见反馈'
        },
        {
          value: 2,
          label: '章节纠错'
        }
      ],
      typesOptions: [
        { type: 1, value: 1, label: '不流畅' },
        { type: 1, value: 2, label: '更新慢' },
        { type: 1, value: 3, label: '漫画少' },
        { type: 1, value: 4, label: '操作难' },
        { type: 1, value: 5, label: '提示少' },
        { type: 1, value: 6, label: '不到账' },
        { type: 1, value: 7, label: '活动少' },
        { type: 1, value: 8, label: '其他' },
        { type: 2, value: 1, label: '内容排版混乱' },
        { type: 2, value: 2, label: '章节顺序错乱' },
        { type: 2, value: 3, label: '章节缺失或重复' },
        { type: 2, value: 4, label: '加载章节失败' },
        { type: 2, value: 5, label: '更新延迟或断更' },
        { type: 2, value: 7, label: '其他' }
      ],
      // 表单校验
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        target: [{ required: true, message: '请选择', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        appId: [{ required: true, message: '请选择应用名', trigger: 'change' }]
      },
      messageTypeOptions: [
        {
          value: 1,
          label: '推送'
        },
        {
          value: 2,
          label: '找到书发通知'
        },
        {
          value: 3,
          label: 'HTTP网页'
        },
        {
          value: 4,
          label: '回复意见反馈'
        },
        {
          value: 5,
          label: '客服手动发系统消息'
        }
      ],
      systemOptions: [
        {
          value: 1,
          label: '全平台'
        },
        {
          value: 2,
          label: 'ios'
        },
        {
          value: 3,
          label: 'android'
        }
      ],
      sendOptions: [
        {
          value: 1,
          label: '极光推送'
        },
        {
          value: 2,
          label: '消息中心'
        },
        {
          value: 3,
          label: '消息+推送'
        }
      ],
      sendMessageOptions: [
        {
          value: 1,
          label: '所有用户'
        },
        {
          value: 2,
          label: '注册用户'
        },
        {
          value: 3,
          label: '自定义'
        }
      ]
    }
  },
  watch: {
    'queryParams.class': {
      handler(val) {
        if (val) {
          this.typeOptions = this.typesOptions.filter((i) => i.type === val)
        } else {
          this.typeOptions = []
        }
        this.queryParams.type = undefined
      },
      immediate: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listFeedback(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
        this.feedbackList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    countTypeAll(type1, type2) {
      let selArr = this.typesOptions.filter((i) => i.type === type1 && i.value === type2)
      if (selArr.length) {
        return selArr[0].label
      } else {
        return ''
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        feedBackId: undefined,
        appId: undefined,
        title: '',
        content: '',
        type: 4,
        extra: '',
        target: 3,
        devices: '',
        platform: 1,
        sendType: 1,
        status: 1
      }
      this.resetForm('form')
    },
    getImgList: function () {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function () {
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
      this.title = '添加意见反馈与纠错'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getFeedback(id).then((response) => {
        const { device, appId, id } = response.data
        this.form.devices = device
        this.form.appId = appId
        this.form.feedBackId = id
        this.open = true
        this.title = '回复意见反馈与纠错'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.feedBackId !== undefined) {
            replyFeedback(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('回复成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addFeedback(this.form).then((response) => {
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
      })
        .then(function () {
          return delFeedback({ ids: Ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 排序回调函数 */
    handleSortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      Object.keys(this.queryParams).forEach((i) => {
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
        editFeedbackStatus({ ids: this.ids, status: item.dictValue }).then((res) => {
          this.getList()
          this.msgSuccess(res.msg)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback_img {
  width: 100px;
  display: block;
  margin: 0 auto;
}
</style>
