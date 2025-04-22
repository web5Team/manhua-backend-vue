
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="消息标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入消息标题" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="消息类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="点击选择" clearable size="small">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送类型" prop="sendType">
            <el-select v-model="queryParams.sendType" placeholder="点击选择" clearable size="small">
              <el-option
                v-for="item in sendTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送目标" prop="target">
            <el-select v-model="queryParams.target" placeholder="点击选择" clearable size="small">
              <el-option
                v-for="item in targetOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指定平台" prop="platform">
            <el-select v-model="queryParams.platform" placeholder="点击选择" clearable size="small">
              <el-option
                v-for="item in platformOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送状态" prop="pushStatus">
            <el-select v-model="queryParams.pushStatus" placeholder="点击选择" clearable size="small">
              <el-option
                v-for="item in pushStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" prop="appId">
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
              v-permisaction="['admin:messageCenter:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:messageCenter:remove']"
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
          :data="list"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" fixed align="center" prop="id" sortable="custom" width="80" :show-overflow-tooltip="true" />
          <el-table-column label="消息标题" align="center" width="160" prop="title" :show-overflow-tooltip="true" />
          <el-table-column label="消息内容" align="center" width="260" prop="content" :show-overflow-tooltip="true" />
          <el-table-column label="其他参数" align="center" prop="extra" />
          <el-table-column label="消息类型" align="center">
              <template slot-scope="scope">
                  <span>{{ scope.row.type | arrFilter(['value', 'label'], typeOptions) }}</span>
              </template>
          </el-table-column>
          <el-table-column label="发送类型" align="center">
              <template slot-scope="scope">
                  <span>{{ scope.row.sendType | arrFilter(['value', 'label'], sendTypeOptions) }}</span>
              </template>
          </el-table-column>
          <el-table-column label="发送目标" align="center">
              <template slot-scope="scope">
                  <span>{{ scope.row.target | arrFilter(['value', 'label'], targetOptions) }}</span>
              </template>
          </el-table-column>
          <el-table-column label="指定会员id" align="center" width="120" prop="memberId" sortable="custom" />
          <el-table-column label="指定设备号" width="300" align="center" prop="device" />
          <el-table-column label="指定平台" align="center">
              <template slot-scope="scope">
                  <span>{{ scope.row.platform | arrFilter(['value', 'label'], platformOptions) }}</span>
              </template>
          </el-table-column>
          <el-table-column label="应用名称" align="center" width="160" prop="appName" :show-overflow-tooltip="true" />
          <el-table-column label="推送状态" align="center">
              <template slot-scope="scope">
                  <span>{{ scope.row.pushStatus | arrFilter(['value', 'label'], pushStatusOptions) }}</span>
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
        <addMessageMask
            :open.sync="open"
            :type-options="typeOptions"
            :target-options="targetOptions"
            :send-type-options="sendTypeOptions"
            :platform-options="platformOptions"
            @success="success"
    ></addMessageMask>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { deleteMessage, listMessage } from '@/api/messageCenter'
import appNameCon from '@/components/AppNameCON'
import addMessageMask from './components/addMessageMask'

export default {
  name: 'Category',
  components: {
    appNameCon,
    addMessageMask
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
      open: false,
      isEdit: false,
      list: [],
      // 关系表类型
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '禁用' }
      ],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        appId: undefined,
        id: undefined,
        title: '',
        type: '',
        sendType: '',
        target: '',
        platform: '',
        pushStatus: '',
        idOrder: 'desc'
      },
      typeOptions: [
        {
          value: 1,
          label: '漫画详情'
        },
        {
          value: 2,
          label: '找漫画通知'
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
          label: '系统通知'
        }
      ],
      sendTypeOptions: [
        {
          value: 1,
          label: '极光推送'
        },
        {
          value: 2,
          label: '消息通知'
        },
        {
          value: 3,
          label: '极光+消息'
        }
      ],
      targetOptions: [
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
      ],
      platformOptions: [
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
      pushStatusOptions: [
        {
          value: 0,
          label: '普通类型'
        },
        {
          value: 1,
          label: '发送成功'
        },
        {
          value: 2,
          label: '发送失败'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listMessage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.loading = false
      })
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
      this.open = true
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
        return deleteMessage({ ids: Ids })
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
    success() {
      this.getList()
      this.open = false
    }
  }
}
</script>
