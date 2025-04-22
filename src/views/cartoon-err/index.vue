<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="漫画ID" prop="cartoonId">
            <el-input v-model="queryParams.cartoonId" placeholder="请输入漫画ID" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="漫画名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入漫画名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="采集规则名称" prop="ruleId" label-width="100px">
            <el-select v-model="queryParams.ruleId" placeholder="请选择" clearable @change="handleQuery">
              <el-option v-for="item in ruleList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="请选择">
              <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="错误类型" prop="type">
            <el-select v-model="queryParams.type" clearable placeholder="请选择">
              <el-option v-for="dict in typeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="queryParams.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="queryParams.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:cartoonErr:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="add"
            >新增
            </el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:cartoonErr:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="ids.length == 0"
              @click="handleDelete"
              >删除
            </el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:cartoonErr:edit']"
              type="primary"
              size="mini"
              :disabled="ids.length == 0"
              @click="repair"
            >一键修复
            </el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-dropdown v-permisaction="['admin:cartoonErr:change']" style="margin-left: 10px" @command="changeStatues">
              <el-button type="primary" size="mini" :disabled="ids.length == 0">
                修改状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in statusOptions" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="15">
            <el-button
              size="mini"
              v-permisaction="['admin:cartoonErr:autojc']"
              type="primary"
              :disabled="ids.length == 0"
              @click="handleAutoToSure"
              >一键修复</el-button
            >
          </el-col>
        </el-row>

        <!-- <div class="tips">一键修复功能说明：只修复错误类型为”缺少所有章节内容”，”缺少本章节内容”的章节，其他的类型需要手动进入纠错处理。</div> -->

        <el-divider />

        <el-table
          v-loading="loading"
          border
          :data="cartoonErrList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column sortable="custom" label="id" width="80" align="center" prop="id" />
          <el-table-column sortable="custom" label="漫画ID" width="100" align="center" prop="cartoonId" />
          <el-table-column label="漫画名称" width="180" align="center" prop="name" />
          <el-table-column label="章节ID" align="center" prop="chapterId" :show-overflow-tooltip="true" />
          <el-table-column label="章节名称" width="300" align="center" prop="chapterName"></el-table-column>
          <el-table-column label="采集规则" width="180" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.ruleId | arrFilter(['id', 'name'], ruleList) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="错误类型" width="180" align="center" prop="type" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.type | arrFilter(['value', 'label'], typeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="处理状态" align="center" prop="status" :formatter="showStatus" />
          <el-table-column sortable="custom" label="创建时间" width="180" align="center" prop="createdAt">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" label="更新时间" width="180" align="center" prop="updatedAt">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-permisaction="['admin:cartoonErr:manualjc']" @click="handleUpdate(scope.row)"
                >纠错</el-button
              >
              <el-button size="mini" type="text" v-permisaction="['admin:cartoonErr:manualxf']" @click="handleOpenSelf(scope.row)"
                >手动修复</el-button
              >
              <el-button size="mini" type="text" v-permisaction="['admin:cartoonErr:check']" @click="handleOpenCheck(scope.row)"
                >查看章节</el-button
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

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="60%" :close-on-click-modal="false">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="漫画名" prop="name">
              <el-input v-model="form.name" placeholder="漫画名" :disabled="true" />
            </el-form-item>
            <el-form-item label="错误原因" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="错误原因" />
            </el-form-item>
            <el-form-item label="章节比对">
              <el-row>
                <el-col :span="10" style="text-align: center"
                  >源站章节(共{{ sourceChapterList.length }}章)
                  <el-dropdown size="mini" style="float: right; margin-right: 17px" @command="handleCommandCartoonSel">
                    <el-button type="primary" size="mini">
                      {{ sourceSelBtnTxt }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="item in ruleSourceList" :key="item.id" :command="item.id">{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col :span="4" style="text-align: center">操作</el-col>
                <el-col :span="10" style="text-align: center">
                  本地章节(共{{ myChapterList.length }}章)
                  <el-button
                    :loading="loadingMyChapter"
                    style="float: right; margin-right: 17px"
                    type="primary"
                    size="mini"
                    :disabled="!selectMyRows.length"
                    @click="chapterDelcet"
                    v-permisaction="['admin:cartoonErr:removeJc']"
                    >删除</el-button
                  >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <div class="grid-content" @mouseenter="isMouseSoure = true" @mouseleave="isMouseSoure = false">
                    <pl-table
                      ref="sourceList"
                      v-loading="loadingSourceChapter"
                      border
                      stripe
                      max-height="400px"
                      :row-height="44"
                      use-virtual
                      :data="sourceChapterList"
                      style="width: 95%"
                      big-data-checkbox
                      @selection-change="handleSelectionSource"
                      @table-body-scroll="tabelScrollSourceList"
                    >
                      <pl-table-column type="selection" width="55" />
                      <pl-table-column label="章节名称" prop="name">
                        <template slot-scope="scope">
                          <a :href="scope.row.content_url" target="_blank">
                            <span class="underline"
                              >{{ scope.row.name }} <span style="color: #f56c6c" v-if="scope.row.isFree === '2'">VIP</span></span
                            >
                          </a>
                        </template>
                      </pl-table-column>
                    </pl-table>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content" style="height: 400px; min-height: 400px; text-align: center; padding-top: 150px">
                    <el-row>
                      <el-button type="primary" @click="handleRecord" v-permisaction="['admin:cartoonErr:soureRecord']">源站补录</el-button>
                    </el-row>
                    <el-row>
                      <div style="padding-top: 10px" />
                      <el-button
                        type="primary"
                        :loading="replaceLoading"
                        @click="handleReplace"
                        v-permisaction="['admin:cartoonErr:replace']"
                        >一键替换</el-button
                      >
                    </el-row>
                    <div style="padding-top: 10px" />
                    <el-row>
                      <el-button
                        type="primary"
                        :loading="insertLoading"
                        :disabled="insertDis"
                        @click="insert(1)"
                        v-permisaction="['admin:cartoonErr:insertTop']"
                        >向上插入</el-button
                      >
                    </el-row>
                    <div style="padding-top: 10px" />
                    <el-row>
                      <el-button
                        type="primary"
                        :loading="insertLoading"
                        :disabled="insertDis"
                        @click="insert(2)"
                        v-permisaction="['admin:cartoonErr:insertBottom']"
                        >向下插入</el-button
                      >
                    </el-row>
                    <div style="padding-top: 10px" />
                    <el-row>
                      <el-button
                        type="primary"
                        :loading="allReplaceLoading"
                        @click="handleAllReplace"
                        v-permisaction="['admin:cartoonErr:insertAll']"
                        >全本替换</el-button
                      >
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content" @mouseenter="isMouseMy = true" @mouseleave="isMouseMy = false">
                    <pl-table
                      ref="myList"
                      v-loading="loadingMyChapter"
                      border
                      stripe
                      max-height="400px"
                      :row-height="44"
                      use-virtual
                      :data="myChapterList"
                      style="width: 95%"
                      big-data-checkbox
                      @selection-change="handleSelectionMy"
                      @table-body-scroll="tabelScrollMyList"
                    >
                      <pl-table-column type="selection" width="55" />
                      <pl-table-column label="章节名称" prop="name" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <a :href="scope.row.myContentUrl" target="_blank">
                            <span class="underline" :style="{ color: scope.row.color ? 'red' : '' }">{{ scope.row.name }}</span>
                          </a>
                        </template>
                      </pl-table-column>
                      <pl-table-column v-if="errStatus" width="73" label="替换状态" prop="errStatus">
                        <template slot-scope="scope">
                          <span>{{ scope.row.errStatus | arrFilter(['value', 'label'], errStatusOptions) }}</span>
                        </template>
                      </pl-table-column>
                    </pl-table>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- <AddCartoonErr :open.sync="addOpen" :rule-list="ruleList" @addSucces="succes"></AddCartoonErr>
        <ChapterErr :open.sync="openChapter" :form-data="chapterData" @succes="succes"></ChapterErr> -->
        <ChapterListDemo
          :open.sync="chapterFData.open"
          :form-data="chapterFData.formdata"
          type="cartoonerr"
          :ruleList="ruleList"
        ></ChapterListDemo>
        <EditChapterDemo
          :isEdit="true"
          :open.sync="chapterSData.open"
          :cartoonId="chapterSData.cartoonId"
          :chapterId="chapterSData.chapterId"
          :isErrorJC="true"
        ></EditChapterDemo>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addCartoonErr,
  delCartoonErr,
  getCartoonErr,
  listCartoonErr,
  updateCartoonErr,
  getSourceChapterList,
  replaceChapter,
  replaceAllChapter,
  oneClickReplaceError,
  replaceChapterLog,
  insertChapterSort,
  editCartoonerrorStatus,
  autoCartoonerrorExec,
  editSourceIdRecord
} from '@/api/cartoon-err'
import { chapterList, delChapter, ruleNameList } from '@/api/cartoon'
import AddCartoonErr from './component/AddCartoonErr'
import ChapterErr from './component/ChapterErr'
import ChapterListDemo from '@/views/cartoon/components/chapterList.vue'
import EditChapterDemo from '@/views/cartoon/components/editChapter.vue'

export default {
  name: 'CartoonErr',
  components: { AddCartoonErr, ChapterErr, ChapterListDemo, EditChapterDemo },
  data() {
    return {
      // 遮罩层
      loading: true,
      loadingMyChapter: true,
      loadingSourceChapter: true,
      allReplaceLoading: false,
      replaceLoading: false,
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
      // 类型数据字典
      statusOptions: [
        { value: 1, label: '待处理' },
        { value: 2, label: '已处理' }
      ],
      errStatusOptions: [
        { value: 1, label: '处理中' },
        { value: 2, label: '完成' },
        { value: 3, label: '失败' }
      ],
      typeOptions: [
        { value: 1, label: '章节对比错误' },
        { value: 2, label: '缺少所有章节内容' },
        { value: 3, label: '缺少本章节内容' },
        { value: 4, label: '其他' },
        { value: 5, label: '下载源站图片失败' },
        { value: 6, label: '抓取漫画详情失败' },
        { value: 7, label: '上传华为云失败' },
        { value: 9, label: '源站图片数与本地图片数不一致' }
      ],
      cartoonErrList: [],
      // 本地章节列表
      myChapterList: [],
      myChapterTotal: 0,
      // 源站章节列表
      sourceChapterList: [],
      sourceChapterTotal: 0,
      // 选中的源站章节列表
      multipleSource: true,
      selectSourceRows: [],
      // 选中本地章节列表
      multipleMy: true,
      selectMyRows: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        cartoonId: undefined,
        name: undefined,
        type: undefined,
        sourceChapterId: undefined,
        ruleId: undefined,
        remark: undefined,
        startTime: '',
        endTime: '',
        status: 1,
        idOrder: 'desc'
      },
      // 查询本地章节列表参数
      queryParamsChapter: {
        pageIndex: 1,
        pageSize: 100,
        cartoonId: 0,
        sortOrder: 'asc'
      },
      // 查询源站章节列表参数
      queryParamsSourceChapter: {
        id: 0,
        cartoonId: undefined,
        ruleId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: '漫画名不能为空', trigger: 'blur' }]
      },
      addOpen: false,
      isMouseSoure: false,
      isMouseMy: false,
      row: {},
      errStatus: false,
      oldSelectMyRows: [],
      time: null,
      insertLoading: false,
      openChapter: false,
      chapterData: {},
      ruleList: [],
      chapterFData: {
        open: false,
        formdata: {}
      },
      chapterSData: {
        open: false,
        cartoonId: 0,
        chapterId: 0
      },
      ruleSourceList: []
    }
  },
  computed: {
    insertDis() {
      return this.selectSourceRows.length === 0 || this.selectMyRows.length !== 1
    },
    sourceSelBtnTxt() {
      let arr = this.ruleSourceList.filter((i) => i.id === this.queryParamsSourceChapter.ruleId)
      return arr.length ? arr[0].name : '更多菜单'
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.sourceChapterList = []
        this.myChapterList = []
        this.ruleSourceList = []
        this.oldSelectMyRows = []
        this.errStatus = false
        this.queryParamsChapter = {
          pageIndex: 1,
          pageSize: 100,
          cartoonId: 0,
          sortOrder: 'asc'
        }
        this.myChapterTotal = 0
        clearTimeout(this.time)
        this.time = null
      }
    },
    openChapter(val) {
      if (!val) {
        this.chapterData = {}
      }
    }
  },
  created() {
    this.getList()
    this.getRuleList()
  },
  methods: {
    showStatus(row) {
      if (row.status === 1) {
        return '待处理'
      } else if (row.status === 2) {
        return '已处理'
      } else {
        return '未知'
      }
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listCartoonErr(this.queryParams).then((response) => {
        this.cartoonErrList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 获取本地章节列表
    getMyChapterList(isStatus = false) {
      this.loadingMyChapter = true
      return new Promise((resolve, reject) => {
        chapterList(this.queryParamsChapter)
          .then((res) => {
            if (isStatus) {
              this.replaceCartoonChapterData(this.form.id, false)
            }
            this.myChapterTotal = res.data.count
            resolve(res.data.list)
          })
          .catch(() => {
            this.loadingMyChapter = false
            reject()
          })
      })
    },
    // 获取源站章节列表
    getSourceChapterList() {
      this.loadingSourceChapter = true
      return new Promise((resolve, reject) => {
        getSourceChapterList(this.queryParamsSourceChapter)
          .then((res) => {
            this.loadingSourceChapter = false
            // this.sourceChapterList = res.data
            this.sourceChapterTotal = res.data.length
            resolve(res.data)
          })
          .catch(() => {
            this.loadingSourceChapter = false
            reject()
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
        id: undefined,
        cartoonId: undefined,
        name: undefined,
        remark: undefined,
        taskId: undefined
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 多选框选中书籍-源站章节列表
    handleSelectionSource(selection) {
      this.selectSourceRows = selection.sort((a, b) => Number(a.sort) - Number(b.sort))
      this.multipleSource = !selection.length
    },
    // 多选框选中书籍-本地章节列表
    handleSelectionMy(selection) {
      this.selectMyRows = selection.sort((a, b) => Number(a.sort) - Number(b.sort))
      this.multipleMy = !selection.length
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getCartoonErr(id).then(async (response) => {
        this.sourceChapterList = []
        this.myChapterList = []
        this.form = response.data
        this.open = true
        this.ruleSourceList = response.data.sourceRule
        response.data.sourceRule.forEach((i) => {
          if (i.id === row.ruleId && !i.sourceCartoonId) this.handleRecord()
        })
        this.title = '漫画纠错'
        this.isEdit = true

        // 获取本地章节
        this.queryParamsChapter.cartoonId = row.cartoonId

        // 获取源站章节
        this.queryParamsSourceChapter.id = id
        this.queryParamsSourceChapter.cartoonId = row.cartoonId
        this.queryParamsSourceChapter.ruleId = row.ruleId
        this.row = row
        try {
          let data = await this.getSourceChapterList()
          this.sourceChapterList = data
          this.getChapterList()
        } catch {
          this.loadingMyChapter = false
        }
      })
    },
    async getChapterList(status) {
      if (
        this.queryParamsChapter.pageIndex === 1 ||
        this.queryParamsChapter.pageIndex <= Math.ceil(this.myChapterTotal / this.queryParamsChapter.pageSize)
      ) {
        if (this.queryParamsChapter.pageIndex === 1) {
          this.myChapterList = []
        }
        try {
          let myChapterList = await this.getMyChapterList(status)
          this.myChapterList = [...this.myChapterList, ...myChapterList]
          this.queryParamsChapter.pageIndex = this.queryParamsChapter.pageIndex + 1
          this.getChapterList()
        } finally {
          this.loadingMyChapter = false
        }
      } else {
        setTimeout(() => {
          this.myChapterList = this.upDateTag(this.myChapterList)
        }, 200)
        this.loadingMyChapter = false
      }
    },
    upDateTag(myChapterList) {
      const row = this.row
      // let myChapterList = this.myChapterList
      const sourceChapterList = this.sourceChapterList
      if (row.type === 3 || row.type === 5 || row.type === 6 || row.type === 7 || row.type === 8) {
        let scorllIndex = 0
        myChapterList = myChapterList.map((i, oi) => {
          if (row.chapterId === i.id) {
            if (scorllIndex === 0) {
              scorllIndex = oi
            }
            i.color = true
          }
          return i
        })
        const el = this.$refs.myList.$el.querySelector('.el-table__body-wrapper')
        const els = this.$refs.sourceList.$el.querySelector('.el-table__body-wrapper')
        setTimeout(() => {
          el.scrollTop = 44 * scorllIndex
          els.scrollTop = 44 * scorllIndex
        }, 200)
      }
      if (row.type === 1) {
        const sourceChapterListLength = sourceChapterList.length
        myChapterList = myChapterList.map((item, index) => {
          let isNotSame = false
          if (sourceChapterListLength > index) {
            isNotSame = sourceChapterList[index].name !== item.name
          }
          return {
            ...item,
            color: isNotSame
          }
        })
      }
      return myChapterList
    },
    // 一键替换
    handleReplace() {
      if (this.selectSourceRows.length === 0) {
        this.msgError('请勾选需要替换的源站章节')
        return
      }
      if (this.selectMyRows.length === 0) {
        this.msgError('请勾选需要替换的本地章节')
        return
      }
      if (this.selectMyRows.length !== this.selectSourceRows.length) {
        this.msgError('本地章节数量跟勾选的源站章节数量不相等')
        return
      }
      // this.$confirm('确定一键替换？', '温馨提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      this.replaceLoading = true
      this.form.selectSourceRows = this.selectSourceRows
      this.form.selectMyRows = this.selectMyRows
      this.form.ruleId = this.queryParamsSourceChapter.ruleId
      this.oldSelectMyRows = this.selectMyRows
      replaceChapter(this.form)
        .then((response) => {
          this.replaceLoading = false
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.queryParamsChapter.pageIndex = 1
            this.getChapterList(true)
            // this.getMyChapterList(true)
            this.getList()
            // this.replaceCartoonChapterData(this.form.id, false)
            // this.selectMyRows = []
            this.$refs['myList'].clearSelection()
            // getNovelBookErr(this.form.id).then(response => {
            //   this.form = response.data
            // })
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(() => {
          this.replaceLoading = false
        })
      // })
      // .catch(() => {})
    },
    // 全本替换
    handleAllReplace() {
      this.$confirm('确定全本替换？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.allReplaceLoading = true
        this.form.ruleId = this.queryParamsSourceChapter.ruleId
        delete this.form.selectSourceRows
        delete this.form.selectMyRows
        replaceAllChapter(this.form)
          .then((response) => {
            this.allReplaceLoading = false
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.myChapterList = this.myChapterList.map((item) => {
                return {
                  errStatus: 1,
                  ...item
                }
              })
              setTimeout(() => {
                this.replaceCartoonChapterData(this.form.id, true)
              }, 1500)
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
          .catch(() => {
            this.allReplaceLoading = false
          })
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCartoonErr(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addCartoonErr(this.form).then((response) => {
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
    add() {
      this.addOpen = true
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
          return delCartoonErr({ ids: Ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    succes() {
      this.addOpen = false
      this.openChapter = false
      this.getList()
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
    tabelScrollSourceList(i) {
      if (this.isMouseMy) return
      const el = this.$refs.myList.$el.querySelector('.el-table__body-wrapper')
      const b = this.$refs.sourceList.$el.querySelector('.el-table__body-wrapper')
      el.scrollTop = b.scrollTop
    },
    tabelScrollMyList(i) {
      if (this.isMouseSoure) return
      const el = this.$refs.sourceList.$el.querySelector('.el-table__body-wrapper')
      const b = this.$refs.myList.$el.querySelector('.el-table__body-wrapper')
      el.scrollTop = b.scrollTop
    },
    chapterDelcet() {
      const arr = this.selectMyRows.map((item) => {
        return item.id
      })
      const Ids = arr.join(',')
      this.$confirm(`是否删除id为 ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delChapter({ cartoonId: this.queryParamsChapter.cartoonId, ids: arr }).then((res) => {
          this.msgSuccess(res.msg)
          this.queryParamsChapter.pageIndex = 1
          this.getChapterList()
          // this.getMyChapterList()
        })
      })
    },
    repair() {
      const Ids = this.ids.join(',')
      this.$confirm(`是否修复id ${Ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 修复接口
        oneClickReplaceError({ ids: Ids }).then((res) => {
          this.msgSuccess(res.msg)
          this.getList()
        })
      })
    },
    openSourceBooks(row) {
      window.open(row.sourceCartoonUrl)
    },
    openSourceBooksChapter(row) {
      window.open(row.sourceChapterUrl)
    },
    async replaceCartoonChapterData(id, isAllReplace) {
      this.loadingMyChapter = true
      clearTimeout(this.time)
      try {
        const { data, msg } = await replaceChapterLog(id)
        let myChapterList = this.myChapterList
        const my = this.$refs.myList.$el.querySelector('.el-table__body-wrapper')
        const height = my.scrollTop
        this.errStatus = true
        const status = data && data.length ? 1 : 2
        const length = this.myChapterList.length

        if (isAllReplace) {
          // 全本替换
          myChapterList = myChapterList.map((item) => {
            return {
              errStatus: status,
              ...item
            }
          })
        } else {
          // 一键替换
          this.oldSelectMyRows.forEach((item) => {
            myChapterList.find((i) => item.id === i.id).errStatus = data ? status : 1
          })

          if (!data) {
            this.myChapterList.splice(0, this.myChapterList.length, ...myChapterList)
          }
        }
        if (data && data.length) {
          if (isAllReplace) {
            const updata = this.upDateTag(data)
            this.myChapterList.splice(0, length, ...updata)
          } else {
            data.forEach((item) => {
              const errStatus = item.errStatus
              myChapterList.find((i) => item.id === i.id).errStatus = errStatus || 1
            })
            this.$nextTick(() => {
              this.myChapterList.splice(0, this.myChapterList.length, ...myChapterList)
            })
          }
        }

        if (data && !data.length) {
          myChapterList = this.myChapterList.map((item) => {
            if (item.errStatus && item.errStatus === 1) {
              item.errStatus = 2
            }
            return {
              ...item
            }
          })
          this.myChapterList.splice(0, this.myChapterList.length, ...myChapterList)
          this.$message.success(msg)
          clearTimeout(this.time)
        }
        setTimeout(() => {
          my.scrollTop = height
        }, 200)
        if (data && data.length) {
          this.time = setTimeout(() => {
            this.replaceCartoonChapterData(id, isAllReplace)
          }, 20000)
        }
        if (!data && msg === '返回成功') {
          this.time = setTimeout(() => {
            this.replaceCartoonChapterData(id, isAllReplace)
          }, 10000)
        }
      } catch {
        this.time = setTimeout(() => {
          this.replaceCartoonChapterData(id, isAllReplace)
        }, 10000)
      } finally {
        this.loadingMyChapter = false
      }
    },
    async insert(type) {
      this.insertLoading = true
      const selectSourceSort = this.selectSourceRows.sort((a, b) => Number(a.sort) - Number(b.sort))
      const chapterId = this.selectMyRows[0].id
      // let isNotBookName = true
      // selectSourceSort.forEach(item => {
      //   const index = this.myChapterList.findIndex(i => i.name === item.name)
      //   if (index > -1) isNotBookName = false
      // })
      // if (!isNotBookName) {
      //   this.$message.error('不能插入有相同章节名的章节')
      //   this.insertLoading = false
      //   return
      // }
      try {
        const { code, msg } = await insertChapterSort({
          cartoonErr: this.form,
          chapterId,
          sourceCartoonList: selectSourceSort,
          type,
          ruleId: this.queryParamsSourceChapter.ruleId
        })
        if (code === 200) {
          this.$message.success(msg)
          this.$refs.sourceList.clearSelection()
          this.queryParamsChapter.pageIndex = 1
          this.getChapterList()
          // this.getMyChapterList()
        }
      } finally {
        this.insertLoading = false
      }
    },
    openChapterErr(row) {
      this.chapterData = {
        id: row.id,
        cartoonId: row.cartoonId,
        chapterId: row.chapterId
      }
      this.openChapter = true
    },
    async getRuleList() {
      const { data } = await ruleNameList({ pageSize: 9999, pageIndex: 1 })
      this.ruleList = data.list
    },
    handleOpenSelf(row) {
      this.chapterSData = {
        open: true,
        cartoonId: row.cartoonId,
        chapterId: row.chapterId
      }
    },
    handleOpenCheck(row) {
      this.chapterFData = {
        open: true,
        formdata: {
          id: row.cartoonId,
          chapterId: row.chapterId
        }
      }
    },
    changeStatues(item) {
      const Ids = this.ids.join(',')
      this.$confirm(`是否将:${Ids}的状态为${item.label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editCartoonerrorStatus({ ids: this.ids.join(','), status: item.value }).then((res) => {
          this.getList()
          this.msgSuccess(res.msg)
        })
      })
    },
    handleAutoToSure() {
      autoCartoonerrorExec({ ids: this.ids.join(',') }).then(() => {
        this.$message.success('开始自动纠错')
      })
    },
    async handleCommandCartoonSel(e) {
      this.queryParamsSourceChapter.ruleId = e
      let selData = this.ruleSourceList.filter((i) => i.id === e)
      if (!selData[0].sourceCartoonId) {
        this.handleRecord()
      } else {
        this.changeSoureChapterTarget()
      }
    },
    async changeSoureChapterTarget() {
      try {
        let data = await this.getSourceChapterList()
        this.sourceChapterList = data
        if (!this.myChapterList.length) this.getChapterList()
      } catch {
        this.sourceChapterList = []
      }
      setTimeout(() => {
        this.myChapterList = this.upDateTag(this.myChapterList)
      }, 200)
    },
    handleRecord() {
      let arrObj = this.ruleSourceList.filter((i) => i.id === this.queryParamsSourceChapter.ruleId)
      let inputValue = arrObj.length ? arrObj[0].sourceCartoonId : ''
      let that = this
      this.$prompt('请输入需要补录的源站id', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue
      })
        .then(({ value }) => {
          editSourceIdRecord({
            cartoonId: that.queryParamsSourceChapter.cartoonId,
            ruleId: that.queryParamsSourceChapter.ruleId,
            sourceCartoonId: value
          }).then((res) => {
            that.changeSoureChapterTarget()
          })
        })
        .catch(() => {
          return false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}
.underline {
  text-decoration: underline;
}
</style>
