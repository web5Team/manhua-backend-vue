<template>
  <div class="app-container">
    <el-card shadow="hover" class="box-card">
      <el-form ref="formData" :inline="true" :model="formData" size="small">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="formData.appId"></appNameCon>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNumber">
          <el-select v-model="formData.versionNumber" :no-data-text="versionText" placeholder="点击选择" clearable>
            <el-option v-for="dict in versionArr" :key="dict.id" :label="dict.versionNumber" :value="dict.versionNumber" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告SDK" prop="adSdk">
          <el-select v-model="formData.adSdk" placeholder="点击选择" clearable>
            <el-option v-for="dict in adSdkSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="推广平台" prop="platformId">
          <el-select v-model="formData.platformId" placeholder="点击选择" clearable>
            <el-option v-for="dict in platformSelect" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型" prop="adType">
          <el-select v-model="formData.adType" placeholder="点击选择" clearable>
            <el-option v-for="dict in typeSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="对应平台" prop="platform">
          <el-select v-model="formData.platform" placeholder="请选择" clearable size="small">
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
          <el-select v-model="formData.position" placeholder="点击选择" clearable>
            <el-option v-for="dict in locationSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="点击选择" clearable>
            <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-top:15px">
        <el-button type="primary" size="mini" icon="el-icon-plus" v-permisaction="['admin:adBase:add']" @click="add">新增</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit" v-permisaction="['admin:adBase:edit']" :disabled="ids.length == 0" @click="edit">修改</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" v-permisaction="['admin:adBase:remove']" :disabled="ids.length == 0" @click="deleteData">删除</el-button>
      </div>

      <el-divider />

      <el-table v-loading="loading" row-key="id" :data="list" border @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="id" width="70" sortable="custom" align="center" prop="id" :show-overflow-tooltip="true" />
        <el-table-column width="180" label="应用名称" align="center" prop="appId">
          <template slot-scope="scope"
            >{{ scope.row.appId }} - {{ scope.row.appName }}</template
          >
        </el-table-column>
        <el-table-column width="120" label="推广平台" align="center" prop="platformNames"> </el-table-column>
        <el-table-column label="版本号" align="center" prop="versionNumber" :show-overflow-tooltip="true" />
        <el-table-column label="广告SDK" align="center" prop="adSdk" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.adSdk | arrFilter(['value', 'label'], adSdkSelect) }}</template>
        </el-table-column>
        <el-table-column label="广告位置" width="180" align="center" prop="position"
          ><template slot-scope="scope">{{ scope.row.position | arrFilter(['value', 'label'], locationSelect) }}</template>
        </el-table-column>
        <el-table-column label="广告类型" align="center" prop="adType" :show-overflow-tooltip="true"
          ><template slot-scope="scope">{{ scope.row.adType | arrFilter(['value', 'label'], typeSelect) }}</template>
        </el-table-column>
        <el-table-column label="对应平台" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.platform | arrFilter(['value', 'label'], platformOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="广告位ID" align="center" prop="adLocationId" />
        <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true"
          ><template slot-scope="scope">{{ scope.row.status | arrFilter(['value', 'label'], statusSelect) }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" sortable="custom" align="center" prop="createdAt" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180" sortable="custom" align="center" prop="updatedAt" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updatedAt) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="formData.pageIndex" :limit.sync="formData.pageSize" @pagination="getList" />
      <AdvAdd
        :open.sync="open"
        :is-edit="isEdit"
        :form-data="form"
        :app-arr="appArr"
        :platform-select="platformSelect"
        @success="success"
        @refresh="getList"
      ></AdvAdd>
    </el-card>
  </div>
</template>

<script>
import appNameCon from '@/components/AppNameCON'
import { listPlatform } from '@/api/platform'
import { listAdvert, listVersion, deleteAdvert } from '@/api/ad-base'
import adEnum from './components/enum.js'
import AdvAdd from './components/AdvAdd'

export default {
  name: 'Index',
  components: { appNameCon, AdvAdd },
  data() {
    return {
      formData: {
        appId: undefined,
        versionNumber: undefined,
        adSdk: undefined,
        platformId: undefined,
        platform: undefined,
        adType: undefined,
        position: undefined,
        status: undefined,
        pageIndex: 1,
        pageSize: 10,
        idOrder: 'desc'
      },
      list: [],
      ids: [],
      form: [],
      loading: false,
      open: false,
      isEdit: false,
      total: 0,
      statusSelect: adEnum.statusSelect,
      adSdkSelect: adEnum.adSdkSelect,
      platformSelect: [],
      typeSelect: adEnum.typeSelect,
      locationSelect: adEnum.locationSelect,
      platformOptions: adEnum.platformOptions,
      appArr: [],
      versionArr: [],
      selection: [],
      isSame: true
    }
  },
  computed: {
    versionText() {
      return this.formData.appId ? '该应用暂无版本号' : '请先选择应用管理'
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.form = []
      }
    },
    'formData.appId'(val) {
      if (val) {
        this.getVersionNumber()
      } else {
        this.versionArr = []
      }
    }
  },
  created() {
    this.getPlatformList()
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
        const { data } = await listAdvert(this.formData)
        this.total = data.count
        this.list = data.list
      } finally {
        this.loading = false
      }
    },
    reset(name) {
      this.resetForm(name)
      this.handleQuery()
    },
    add() {
      this.isEdit = false
      this.open = true
    },
    edit() {
      if (!this.isSame) {
        this.$message.error('不允许同时修改不同应用或版本号的记录，请重新勾选')
        return
      }
      this.form = this.selection
      this.isEdit = true
      this.open = true
    },
    deleteData(row) {
      if (!this.isSame) {
        this.$message.error('不允许同时删除不同应用或版本号的记录，请重新勾选')
        return
      }
      const Ids = row.id || this.ids.join(',')
      const ids = row.id ? [row.id] : this.ids
      this.$confirm(`是否确认删除 ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除成功')
        deleteAdvert({ ids }).then(res => {
          this.getList()
          this.$message.success(res.msg)
        })
      })
    },
    handleSelectionChange(selection) {
      let ids = []
      selection.forEach(item => {
        ids = ids.concat(item.id)
      })
      this.selection = selection
      this.ids = ids
      this.isSame = true
      if (selection && selection.length > 0) {
        const { appId, versionNumber } = selection[0]
        selection.forEach(item => {
          if (appId !== item.appId || versionNumber !== item.versionNumber) {
            this.isSame = false
          }
        })
      }
    },
    sortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.formData[this.order] = undefined
      }
      if (order === 'descending') {
        this.formData[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.formData[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.formData[prop + 'Order'] = undefined
      }
      this.getList()
    },
    success() {
      this.getList()
      this.open = false
    },
    getAppArr(val) {
      this.appArr = val
    },
    async getPlatformList() {
      const { data } = await listPlatform({ pageIndex: 1, pageSize: 9999 })
      this.platformSelect = data.list
    },
    async getVersionNumber() {
      const { data } = await listVersion({ appId: this.formData.appId })
      this.versionArr = data
    }
  }
}
</script>

<style lang="scss" scoped></style>
