<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryParams" :inline="true" :rules="rules" :model="queryParams" size="small">
          <el-form-item label="应用名" prop="appName">
            <el-input v-model="queryParams.appName" placeholder="请输入应用名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="包名" prop="pkgName">
            <el-input v-model="queryParams.pkgName" placeholder="请输入包名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="id" prop="id">
            <el-input
              v-model.number="queryParams.id"
              placeholder="请输入id"
              clearable
              size="small"
              @blur="inputNumBlur('id')"
              @clear="inputNumBlur('id')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset('queryParams')">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: 15px">
          <el-button v-permisaction="['applyConfig:home:add']" type="primary" size="mini" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button
            v-permisaction="['applyConfig:home:edit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="single"
            @click="edit"
            >修改</el-button
          >
          <el-button
            v-permisaction="['applyConfig:home:remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="deleteData"
            >删除</el-button
          >
          <el-dropdown style="margin-left: 10px" @command="changeStatues" v-permisaction="['applyConfig:home:changeStatus']">
            <el-button type="primary" size="mini" :disabled="ids.length == 0">
              修改状态
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in statusList" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-permisaction="['applyConfig:home:createOrRef']"
            style="margin-left: 10px"
            type="primary"
            size="mini"
            @click="refreshFile"
            >生成/刷新静态文件</el-button
          >
          <el-button v-permisaction="['applyConfig:home:staticbtn']" type="primary" size="mini" @click="uploadStaticFile"
            >上传域名静态文件</el-button
          >
        </div>
        <el-divider />
        <el-table
          ref="table"
          v-loading="loading"
          :data="listTabel"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="应用名" align="center" prop="appName" />
          <el-table-column label="安卓打包名" align="center" width="150" prop="androidPkgName" />
          <el-table-column label="苹果备注" align="center" width="150" prop="iosAlias" />
          <el-table-column label="安卓备注" align="center" width="150" prop="androidAlias" />
          <el-table-column label="包名" align="center" width="200" prop="pkgName" />
          <el-table-column label="应用图标" align="center">
            <template slot-scope="scope">
              <img class="user_img_icon" alt="" :src="showIcon(scope.row.id)" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="广告总开关" align="center" width="200" prop="pkgName" /> -->
          <!-- <el-table-column label="已选应用模板" align="center" width="200" prop="pkgName" /> -->
          <el-table-column label="API域名" align="center" width="300" prop="apiDomain" />
          <el-table-column label="静态文件域名" align="center" width="300" prop="staticDomain" />
          <el-table-column label="图片域名" align="center" width="300" prop="imageDomain" />
          <el-table-column label="生成状态" align="center" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope" align="center">{{ scope.row.status | statusFilter }}</template>
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
          <el-table-column label="操作" fixed="right" align="center" width="180">
            <template slot-scope="scope">
              <el-button v-permisaction="['applyConfig:home:edit']" size="mini" type="text" @click="edit(scope.row)">修改</el-button>
              <el-button v-permisaction="['applyConfig:home:remove']" size="mini" type="text" @click="deleteData(scope.row)"
                >删除</el-button
              >
              <el-button v-permisaction="['applyConfig:home:create']" type="text" size="small" @click="genAppOpen(scope.row)"
                >生成</el-button
              >
              <el-button v-permisaction="['applyConfig:home:download']" type="text" size="small" @click="genAppOpen(scope.row, 'download')"
                >下载</el-button
              >
              <el-button v-permisaction="['applyConfig:home:check']" type="text" size="small" @click="getLog(scope.row)"
                >查看日志</el-button
              >
              <el-button v-permisaction="['applyConfig:home:signDown']" type="text" size="small" @click="dowanloadSign(scope.row)"
                >下载签名</el-button
              >
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
        <appconfig :open.sync="open" :form="editForm" :is-edit="isEdit" @success="success" />
        <reffeshFileBox :open.sync="refreshOpen" :form-data="form"></reffeshFileBox>
        <el-dialog title="请选择版本信息" :visible.sync="openPlatform" width="60%" :close-on-click-modal="false">
          <el-row>
            <el-col :span="18">
              <el-form ref="platformForm" :model="form" :rules="rulesdevier" label-width="80px">
                <el-form-item label="推广平台" prop="platformId">
                  <el-select v-model="form.platformId" placeholder="点击选择" @change="platChage">
                    <el-option v-for="dict in platFormSelect" :key="dict.id" :label="dict.name" :value="dict.id" />
                  </el-select>
                </el-form-item>
                <div v-show="event !== 'download'">
                  <el-form-item label="漫画id" prop="cartoonId">
                    <el-input v-model.number="form.cartoonId" placeholder="请输入id" clearable size="small" />
                  </el-form-item>
                </div>
                <el-form-item label="版本名">
                  <span>{{ form.versionName }}</span>
                </el-form-item>
                <el-form-item label="版本号">
                  <span>{{ form.versionNumber }}</span>
                </el-form-item>
                <div v-show="event === 'download'">
                  <el-form-item label="下载链接">
                    <span>{{ upLink }}</span>
                  </el-form-item>
                </div>
              </el-form>
            </el-col>
            <el-col :span="6">
              <div v-if="upLink" class="app_code_box">
                <div class="codebox">
                  <QrcodeVue :value="upLink" :size="160" level="H"></QrcodeVue>
                </div>
                <div class="txt">{{ row.appName }}</div>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="create">{{ txt }}</el-button>
            <el-button @click="openPlatform = false">取消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="上传域名静态文件" :visible.sync="staticFormShow" width="550px" :close-on-click-modal="false">
          <el-form ref="staticForm" :model="staticForm" :rules="rulesStatic" label-width="80px">
            <el-form-item label="oss域名" prop="oss">
              <el-input v-model="staticForm.oss" placeholder="请输入oss域名" clearable size="small" disabled />
            </el-form-item>
            <el-form-item label="应用名称" prop="appId">
              <appNameCon :select-val.sync="staticForm.appId" :is-clearable="false" :is-all-name="true"></appNameCon>
            </el-form-item>
            <el-form-item label="域名配置" prop="domainConfig">
              <el-input
                v-model="staticForm.domainConfig"
                type="textarea"
                :rows="6"
                placeholder="请输入域名配置"
                clearable
                size="small"
                :disabled="staticForm.appId === 0"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toUploadStaticNow(1)">上传oss</el-button>
            <el-button @click="closeUploadStaticFile">取消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="下载签名" :visible.sync="downloadSignFormShow" width="550px" :close-on-click-modal="false">
          <el-form ref="downloadSignForm" :model="downloadSignData" label-width="80px">
            <el-form-item label="密码" prop="oss">
              <el-input v-model="downloadSignData.pass" type="password" placeholder="请输入密码" clearable size="small" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="signClickNow('sure')">确定</el-button>
            <el-button @click="signClickNow('cancel')">取消</el-button>
          </span>
        </el-dialog>
        <log :id="logId" :open.sync="openLog" :is-open-log="isOpenLog" :log-status="logStatus" @updataList="upData"></log>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import appconfig from './components/appconfig.vue'
import reffeshFileBox from './components/refreshFile'
import QrcodeVue from 'qrcode.vue'
import {
  getOssDomainNameFeach,
  uploadOssDomainFeach,
  checkDevierInfoFeach,
  downloadAppSignFeach,
  createAppFeach,
  updateAppStatus
} from '@/api/app'
import { listPlatform } from '@/api/platform'
import { delApp, getApp, listApp } from '@/api/app'
import appNameCon from '@/components/AppNameCON'
import log from './components/log'

export default {
  name: 'ApplicationSet',
  filters: {
    statusFilter(val) {
      switch (val) {
        case 1:
          return '生成中'
        case 2:
          return '成功'
        case 3:
          return '失败'
        default:
          return '-'
      }
    }
  },
  components: {
    appconfig,
    QrcodeVue,
    reffeshFileBox,
    appNameCon,
    log
  },
  data() {
    return {
      queryParams: {
        id: undefined,
        pkgName: '',
        appName: '',
        pageIndex: 1,
        pageSize: 10,
        idOrder: 'desc'
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      rules: {
        id: [{ type: 'number', message: '请输入数字' }]
      },
      listTabel: [],
      ids: [],
      pidList: [],
      loading: false,
      total: 0,
      statusList: [
        { value: 1, label: '生成中' },
        { value: 2, label: '成功' },
        { value: 3, label: '失败' }
      ],
      open: false,
      isEdit: false,
      refreshOpen: false,
      isAllSelect: false,
      selectArr: [],
      selecData: [],
      pidSelect: [],
      pidSelectSec: [],
      upSelect: [],
      editForm: {},
      staticForm: {
        oss: '',
        appId: '',
        staticType: undefined,
        domainConfig: ''
      },
      rulesStatic: {
        appId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      staticFormShow: false,
      openPlatform: false,
      platFormSelect: [],
      form: {
        platformId: '',
        versionName: '',
        versionNumber: '',
        cartoonId: 0,
        branch: '',
        serverAppPath: ''
      },
      rulesdevier: {
        platformId: [{ required: true, message: '请选择推广平台', trigger: 'blur' }],
        cartoonId: [{ type: 'number', message: '请输入数字' }]
      },
      downloadSignFormShow: false,
      downloadSignData: {},
      signId: undefined,
      event: 'create',
      upLink: '',
      platformListArr: [],
      openLog: false,
      logId: '',
      isUndata: false,
      isOpenLog: false,
      logStatus: 2
    }
  },
  computed: {
    txt() {
      return this.event === 'create' ? '创建' : '下载'
    }
  },
  watch: {
    open(val) {
      if (!val) this.form = {}
    },
    'staticForm.appId'(val) {
      if (val === '') {
        return
      }
      if (val !== 0) {
        this.changeAppIdNow()
      } else {
        this.staticForm.domainConfig = ''
      }
    },
    openLog(val) {
      if (!val) {
        if (this.isUndata) {
          this.getList()
          this.isUndata = false
          this.logStatus = 2
        }
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
    async getPlatformList() {
      const { data } = await listPlatform({ pageIndex: 1, pageSize: 9999, idOrder: 'asc' })
      this.platformListArr = data.list
    },
    inputNumBlur(str) {
      if (this.queryParams[str] === '') {
        this.queryParams[str] = undefined
      }
    },
    handleQuery() {
      this.$refs.queryParams.validate(async (valid) => {
        if (valid) {
          this.queryParams.pageIndex = 1
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getList() {
      this.$refs.queryParams.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const { data } = await listApp(this.queryParams)
            if (data.list && data.list.length) {
              this.listTabel = data.list
            } else {
              this.listTabel = []
            }
            this.total = data.count
          } finally {
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset(name) {
      this.resetForm(name)
      this.handleQuery()
    },
    add(row) {
      this.isEdit = false
      this.open = true
    },
    async edit(row) {
      const id = row.id || this.ids[0]
      const { data } = await getApp(id)
      this.editForm = data
      this.isEdit = true
      this.open = true
    },
    refreshFile() {
      this.refreshOpen = true
    },
    deleteData(row) {
      const ids = row.id ? [row.id] : this.ids
      this.$confirm(`是否确认删除 ${ids.join(',')} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApp({ ids }).then((res) => {
          this.$message.success(res.msg)
          this.getList()
        })
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    success() {
      this.open = false
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeStatues(item) {
      const Ids = this.ids.join(',')
      this.$confirm(`是否修改id:${Ids}的状态为${item.label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAppStatus({ ids: this.ids, status: item.value }).then(() => {
          this.getList()
          this.msgSuccess('修改成功')
        })
      })
    },
    async selectClassifiVideoF(item) {
      await this.pidSelect.some((i) => {
        if (i.id === item) {
          this.pidSelectSec = i.children
        }
        return i.id === item
      })
      this.handleQuery()
    },
    clearClassifiVideoF() {
      this.pidSelectSec = []
    },
    selectClassifiVideoS(item) {
      this.handleQuery()
    },
    uploadStaticFile() {
      if (this.ids && this.ids.length) {
        this.staticForm.appId = this.ids[0]
      }
      this.staticFormShow = true
      this.getOssValue()
    },
    async getOssValue() {
      let { data } = await getOssDomainNameFeach()
      let datas = JSON.parse(data.configValue)
      this.staticForm.oss = datas.aliyun_oss_domain
    },
    async changeAppIdNow() {
      if (this.staticForm.appId === 0) {
        this.staticForm.domainConfig = ''
        return
      }
      const { data } = await getApp(this.staticForm.appId)
      const obj = {
        apiDomain: data.apiDomain,
        staticDomain: data.staticDomain,
        cacheDomain: data.cacheDomain,
        imageDomain: data.imageDomain,
        shareDownUrl: data.shareDownUrl,
        coverDomain: data.coverDomain
      }
      this.staticForm.domainConfig = JSON.stringify(obj)
    },
    closeUploadStaticFile() {
      this.staticForm = {
        oss: '',
        appId: '',
        staticType: undefined,
        domainConfig: ''
      }
      this.resetForm('staticForm')
      this.staticFormShow = false
    },
    toUploadStaticNow(num) {
      this.$refs.staticForm.validate(async (valid) => {
        if (valid) {
          const obj = {
            appId: this.staticForm.appId,
            staticType: num,
            domainConfig: this.staticForm.domainConfig !== '' ? JSON.parse(this.staticForm.domainConfig) : {}
          }
          const data = await uploadOssDomainFeach(obj)
          this.$message.success(data.msg)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async genAppOpen(row, isDownload) {
      this.form = {
        platformId: '',
        versionName: '',
        versionNumber: '',
        cartoonId: 0,
        branch: '',
        serverAppPath: ''
      }
      if (!isDownload) {
        this.form.branch = row.branch
        this.form.serverAppPath = row.serverAppPath
      }
      this.resetForm('platformForm')
      this.upLink = ''
      this.appId = row.id
      this.row = row
      const { data } = await checkDevierInfoFeach(row.id)
      const arr = []
      if (!data.editionDetails) {
        this.$message.warning('请设置推广平台的版本')
        return
      }
      data.editionDetails.forEach((item) => {
        const key = this.platformListArr.findIndex((k) => k.id === item.platformId)
        if (key !== -1) {
          const obj = {
            versionNumber: item.versionNumber,
            versionName: item.versionName,
            upLink: item.upLink || '',
            forceUpdate: item.forceUpdate || 2,
            updateDetails: item.updateDetails || '',
            id: this.platformListArr[key].id,
            name: this.platformListArr[key].name
          }
          arr.push(obj)
        }
      })
      this.platFormSelect = arr
      this.openPlatform = true
      this.event = isDownload ? 'download' : 'create'
    },
    getLog(row) {
      this.isOpenLog = true
      this.openLog = true
      this.logId = row.id
      this.logStatus = row.status
    },
    dowanloadSign(row) {
      this.downloadSignFormShow = true
      this.downloadSignData = {}
      this.signId = row.id
    },
    platChage(val) {
      const find = this.platFormSelect.find((item) => item.id === val)
      this.form.versionName = find.versionName
      this.form.versionNumber = find.versionNumber
      this.upLink = find.upLink
    },
    create() {
      this.$refs['platformForm'].validate((valid) => {
        if (valid) {
          if (this.event === 'create') {
            this.genApp(this.row)
          } else {
            if (this.upLink) {
              window.open(this.upLink)
            } else {
              this.$message.error('没有下载链接')
            }
          }
        }
      })
    },
    upData() {
      this.isUndata = true
    },
    signClickNow(str) {
      if (str === 'sure') {
        this.submitPassSign()
      } else {
        this.downloadSignFormShow = false
      }
    },
    async submitPassSign() {
      if (this.downloadSignData.pass) {
        const obj = {
          password: this.downloadSignData.pass,
          appId: this.signId
        }
        const data = await downloadAppSignFeach(obj)
        if (data.code === 200) {
          this.downloadSignFormShow = false
          window.location.href = data.data
        } else {
          this.$message.warning(data.msg)
        }
      } else {
        this.$message.warning('请填写密码')
      }
    },
    // 重新生成app
    genApp(row) {
      this.isOpenLog = false
      const paramsObj = {
        appId: this.appId,
        ...this.form
      }
      createAppFeach(paramsObj).then((res) => {
        row.status = 1
        this.openLog = true
        this.openPlatform = false
        this.logId = this.appId
      })
    },
    // 显示应用图标
    showIcon(id) {
      return `${process.env.VUE_APP_BASE_API}/static/launcher/launcher_${id}.png`
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
    }
  }
}
</script>

<style lang="scss" scoped>
.user_img_icon {
  width: 60px;
  height: 60px;
  display: block;
}
.app_code_box {
  .codebox {
    display: flex;
    justify-content: center;
  }
  .txt {
    line-height: 30px;
    width: 100%;
    text-align: center;
  }
}
</style>
