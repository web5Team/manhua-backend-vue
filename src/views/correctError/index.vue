<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
    <el-form ref="formData" :inline="true" :model="formData" :rules="rules" size="small">
      <el-form-item label="漫画id" prop="vodId">
        <el-input v-model.number="formData.vodId" placeholder="请输入漫画id" clearable size="small" @input="() => enterNumber(formData.vodId, formData, 'vodId')" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="漫画名称" prop="vodName">
        <el-input v-model="formData.vodName" placeholder="请输入漫画名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="错误类型" prop="type">
        <el-select v-model="formData.type" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in errorSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="采集规则名称" prop="crawlerRuleId">
        <el-select v-model="formData.crawlerRuleId" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in ruleOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="formData.status" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top:15px">
      <el-button v-permisaction="['taskList:btn:add']" type="primary" size="mini" @click="toSanningNow">{{ isSanningNow === '2' ? '正在扫描中...' : '扫描所有视频' }}</el-button>
      <el-button v-permisaction="['taskList:btn:remove']" type="danger" size="mini" :disabled="ids.length == 0" @click="deleteData">删除</el-button>
      <el-dropdown v-permisaction="['filmReview:comment:change']" style="margin-left: 10px;" @command="changeStatues">
        <el-button type="primary" size="mini" :disabled="ids.length == 0">
          修改状态
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in statusSelect" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="font-size:12px;color: #c0c4cc;margin-top: 10px;">{{ isSanningNow === '2' ? '正在扫描中...，点击按钮可以中断扫描' : '点击按钮开始扫描' }}</div>

    <el-divider />

    <el-table
      ref="table"
      v-loading="loading"
      row-key="id"
      :data="tabelList"
      border
      @selection-change="handleSelectionChange"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" />
      <el-table-column label="漫画id" sortable="custom" width="100" align="center" prop="vodId" :show-overflow-tooltip="true" />
      <el-table-column label="漫画名称" align="center" prop="vodName" />
      <el-table-column label="章节id" sortable="custom" width="100" align="center" prop="vodId" :show-overflow-tooltip="true" />
      <el-table-column label="章节名称" align="center" prop="vodName" />
      <el-table-column label="采集规则名称" align="center" width="200" prop="crawlerRuleName" />
      <el-table-column label="错误类型" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.type | arrFilter(['value', 'label'], errorSelect) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" width="100">
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
      <el-table-column label="操作" fixed="right" align="center" width="100">
        <template slot-scope="scope">
          <el-button v-permisaction="['taskList:btn:journal']" size="mini" type="text" @click="toChangeVideoInfo(scope.row)">自动修复</el-button>
          <el-button v-permisaction="['taskList:btn:journal']" size="mini" type="text" @click="toChangeVideoInfo(scope.row)">手动修复</el-button>
          <el-button v-permisaction="['taskList:btn:journal']" size="mini" type="text" @click="toChangeVideoInfo(scope.row)">查看章节</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="formData.pageIndex" :limit.sync="formData.pageSize" @pagination="getList" />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { getVideoErrorListFeach, delVideoErrorItemFeach, editVideoErrorStatusFeach, startScanningStatusFeach, blackScanningFeach, getScanningStatusFeach } from '@/api/cartoon.js'

export default {
  name: 'VideoErrorList',
  components: { },
  data() {
    return {
      formData: {
        vodId: undefined,
        vodName: '',
        status: undefined,
        type: undefined,
        crawlerRuleId: undefined,
        pageIndex: 1,
        pageSize: 10,
        sort: 'id',
        order: 'descending'
      },
      tabelList: [],
      ids: [],
      loading: false,
      total: 0,
      rules: {
        id: [{ type: 'number', message: '请输入数字' }],
        vodId: [{ type: 'number', message: '请输入数字' }]
      },
      statusSelect: [{ value: 1, label: '已处理' }, { value: 2, label: '待处理' }],
      errorSelect: [
        { value: 1, label: '章节对比错误(本站章节数比源站多)' },
        { value: 2, label: '缺少所有章节内容' },
        { value: 3, label: '缺少本章节内容' },
        { value: 4, label: '下载源站图片失败' },
        { value: 5, label: '抓取漫画详情失败' },
        { value: 6, label: '上传华为云失败' }
      ],
      ruleOptions: [
        { value: 1, label: '快看漫画' },
        { value: 2, label: '腾讯漫画' },
        { value: 3, label: '漫画大全' }
      ],
      open: false,
      isEdit: false,
      openSec: false,
      journalId: '',
      form: {},
      selecData: []
    }
  },
  computed: {
    ...mapState({
      isSanningNow: state => state.collection.isScanning
    })
  },
  watch: {
    open(val) {
      if (!val) this.form = {}
    }
  },
  created() {
    this.checkScaningNowStausFirst()
  },
  mounted() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    checkScaningNowStausFirst() {
      getScanningStatusFeach().then(res => {
        if (res.data === 1) {
          this.SET_SCANNIMG('2')
          this.checkScannStatus()
        } else {
          this.SET_SCANNIMG('1')
        }
      })
    },
    handleQuery() {
      this.formData.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      try {
        const { data } = await getVideoErrorListFeach(this.formData)
        if (data.list && data.list.length) {
          this.tabelList = data.list
        } else {
          this.tabelList = []
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
      if (row.id) {
        this.form.pid = row.id
      }
      this.isEdit = false
      this.open = true
    },
    toSeeJournalInfo(row) {
      this.openSec = true
      this.journalId = (row.id).toString()
    },
    edit(row) {
      this.form.id = row.id || this.ids[0]
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
        delVideoErrorItemFeach(Ids).then(res => {
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
      this.selecData = selection
    },
    sortChange(data) {
      this.formData.sort = data.prop
      this.formData.order = data.order || 'descending'
      this.getList()
    },
    upStatus(row, status) {
      const statusName = this.statusSelect.filter(i => status === i.value)
      const ids = typeof row === 'string' ? row : String(row.id)
      this.$confirm(`是否修改id:${ids}的状态为${statusName[0].label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editVideoErrorStatusFeach({ ids, status }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    },
    success() {
      this.getList()
      this.open = false
    },
    selectAll(selection) {
      const isSelect = selection.some(el => {
        const tableDataIds = this.tabelList.map(j => j.id)
        return tableDataIds.includes(el.id)
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
        this.tabelList.map(el => {
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
    },
    toChangeVideoInfo(row) {
      this.$store.commit('tagsView/ADD_CACHED_VIEWNAME', 'VideoErrorList')
      this.$router.push({
        path: '/videoPlayList/index',
        query: {
          id: row.vodId,
          sannId: row.id
        }
      })
    },
    toSanningNow() {
      if (this.isSanningNow === '1') {
        startScanningStatusFeach()
        this.SET_SCANNIMG('2')
        this.checkScannStatus()
      } else {
        this.$confirm(`是否暂停视频纠错扫描`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          blackScanningFeach().then(() => {
            this.$message.success('停止扫描')
            this.SET_SCANNIMG('1')
          })
        })
      }
    },
    ...mapMutations({ SET_SCANNIMG: 'collection/SET_SCANNIMG' }),
    ...mapActions('collection', { checkScannStatus: 'checkScannStatus' })
  }
}
</script>

<style lang="scss">
.video_jc_textarea_box {
  position: relative;
  .el-textarea__inner {
    border: none !important;
  }
}
</style>
