<template>
  <el-dialog ref="dialog" :title="title" :visible.sync="open" :before-close="handleClose" :close-on-click-modal="false" width="80%">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
      <el-row>
        <el-col :span="12">
          <AppNameSelect label-width="245px" :disabled="isEdit" :app-id-select.sync="form.appId" :app-arr="appArr"></AppNameSelect>
          <el-form-item label="版本号" prop="versionNumber" label-width="245px">
            <el-input-number
              v-model="form.versionNumber"
              :disabled="isEdit"
              class="inpNum"
              placeholder="请输入"
              :controls="false"
              :min="0"
              :max="999999"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="对应平台" prop="platform" label-width="245px">
            <el-select v-model="form.platform" placeholder="请选择" clearable size="small">
              <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阅读页显示广告的间隔页数(页)" prop="readPageNumber" label-width="245px">
            <el-input-number
              v-model="form.readPageNumber"
              class="inpNum"
              placeholder="范围: 3-1000"
              :controls="false"
              :min="3"
              :max="1000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="从后台唤醒的开屏广告间隔时间(秒)" prop="backgroundTailTime" label-width="245px">
            <el-input-number
              v-model="form.backgroundTailTime"
              class="inpNum"
              placeholder="请输入"
              :controls="false"
              :min="0"
              :max="10000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="新用户安装后显示广告(分)" prop="newUserDay" label-width="245px">
            <el-input-number
              v-model="form.newUserDay"
              class="inpNum"
              placeholder="范围: 0-1000"
              :controls="false"
              :min="0"
              :max="1000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="阅读页弹出广告拦截时间间隔(分)" prop="readPageTime" label-width="245px">
            <el-input-number
              v-model="form.readPageTime"
              class="inpNum"
              placeholder="范围: 1-10000"
              :controls="false"
              :min="1"
              :max="10000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="看视频免广告时长(分)" label-width="245px" prop="watchVideoFreeTime">
            <el-input-number
              v-model="form.watchVideoFreeTime"
              class="inpNum"
              placeholder="默认为0，表示不打开免广告功能"
              :controls="false"
              :min="0"
              :max="10000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="阅读时解锁首章节数" label-width="245px" prop="readUnlockChapter">
            <el-input-number
              v-model="form.readUnlockChapter"
              class="inpNum"
              placeholder="默认为0"
              :controls="false"
              :min="0"
              :max="10000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="阅读时解锁间隔的章节数" label-width="245px" prop="readUnlockIntervalChapter">
            <el-input-number
              v-model="form.readUnlockIntervalChapter"
              class="inpNum"
              placeholder="默认为0"
              :controls="false"
              :min="0"
              :max="10000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="推广平台" prop="platformIds" label-width="245px">
            <el-select v-model="platformIds" multiple placeholder="请选择" @change="changeSelect">
              <el-checkbox v-model="checked" class="allCheck" @change="selectAll">全选</el-checkbox>
              <el-option v-for="dict in platformSelect" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="首页框架新插屏广告间隔时间(分)" prop="homePageInterstitialTime" label-width="245px">
            <el-input-number
              v-model.number="form.homePageInterstitialTime"
              class="inpNum"
              :controls="false"
              :min="0"
              :max="100000000000"
              placeholder="0为不显示广告"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>安卓</span>
            </div>
            <el-form-item label="穿山甲ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.android.csjAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.android.csjWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="优量汇ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.android.ylhAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.android.ylhWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="淘豆ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.android.tdAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.android.tdWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="淘豆KEY" label-width="80px">
              <el-input v-model="form.adConfigJson.android.tdAdAppKey" />
            </el-form-item>
            <el-form-item label="快手ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.android.ksAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.android.ksWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
          </el-card>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>苹果</span>
            </div>
            <el-form-item label="穿山甲ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.ios.csjAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.ios.csjWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="优量汇ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.ios.ylhAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.ios.ylhWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="淘豆ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.ios.tdAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.ios.tdWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="淘豆KEY" label-width="80px">
              <el-input v-model="form.adConfigJson.ios.tdAdAppKey" />
            </el-form-item>
            <el-form-item label="快手ID" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="form.adConfigJson.ios.ksAdAppId" />
                </el-col>
                <el-col :span="10">
                  <el-input-number
                    v-model="form.adConfigJson.ios.ksWeight"
                    class="inpNum"
                    placeholder="请输入权重(范围0-100)"
                    :controls="false"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin: 15px 0">
      <el-button type="primary" @click="openDialog">添加</el-button>
      <span style="color: #d9001b">相同版本号的广告位置只能添加一条</span>
    </div>

    <el-table ref="tabel" row-key="id" :data="list" border @sort-change="sortChange">
      <el-table-column label="id" :sortable="isEdit ? 'custom' : isEdit" width="70" align="center" prop="id" />
      <!-- <el-table-column label="推广平台" width="120" :sortable="isEdit ? 'custom' : isEdit" align="center" prop="platformId">
        <template slot-scope="scope">
          <el-select v-model="scope.row.platformId" placeholder="请选择">
            <el-option v-if="scope.$index !== 0" label="同上" :value="undefined" />
            <el-option v-for="dict in platformSelect" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="广告SDK" width="120" :sortable="isEdit ? 'custom' : isEdit" align="center" prop="adSdk">
        <template slot-scope="scope">
          <el-select v-model="scope.row.adSdk" placeholder="请选择">
            <el-option v-if="scope.$index !== 0" label="同上" :value="undefined" />
            <el-option v-for="dict in adSdkSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="广告位置" width="300" align="center" prop="position">
        <template slot-scope="scope">
          <el-select v-model="scope.row.position" style="width: 270px" placeholder="请选择">
            <el-option v-for="dict in locationSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="广告类型" width="150" align="center" prop="adType">
        <template slot-scope="scope">
          <el-select v-model="scope.row.adType" placeholder="请选择">
            <el-option v-for="dict in typeSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="广告位ID" width="180" align="center" prop="adLocationId">
        <template slot-scope="scope">
          <el-input v-model="scope.row.adLocationId" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" placeholder="请选择">
            <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="权重" width="160" align="center" prop="weight">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.weight"
            class="numberInputbox"
            placeholder="请输入权重(范围0-100)"
            :controls="false"
            :min="0"
            :max="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteData(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="sava">确认</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>

    <el-dialog width="30%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
      <el-form :model="addForm" size="small">
        <el-form-item label="添加行数">
          <el-input-number v-model="addForm.length" :min="1" :max="50"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="addList">确认</el-button>
        <el-button @click="innerVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import adEnum from './enum'
import AppNameSelect from '@/components/AppNameSelect'
import { advertDetailFeach, updateAdvert, addAdvert, deleteAdvert } from '@/api/ad-base'

import _ from 'lodash'
// import { testCrawlerRule } from '@/api/crawlerrule'

export default {
  name: 'Index',
  components: {
    AppNameSelect
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Array,
      default: () => []
    },
    platformSelect: {
      type: Array,
      default: () => []
    },
    appArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        appId: undefined,
        versionNumber: undefined,
        platform: undefined,
        backgroundTailTime: undefined,
        newUserDay: undefined,
        readPageNumber: undefined,
        readPageTime: undefined,
        watchVideoFreeTime: undefined,
        readUnlockChapter: undefined,
        readUnlockIntervalChapter: undefined,
        homePageInterstitialTime: undefined,
        platformIds: undefined,
        adConfigJson: {
          android: {
            csjAdAppId: '', // 穿山甲广告APPID
            ylhAdAppId: '', // 优量汇广告APPID
            tdAdAppId: '', // 淘豆广告APPID
            tdAdAppKey: '', // 淘豆广告Key
            ksAdAppId: '', // 快手APPID
            csjWeight: undefined,
            ylhWeight: undefined,
            tdWeight: undefined,
            ksWeight: undefined
          },
          ios: {
            csjAdAppId: '', // 穿山甲广告APPID
            ylhAdAppId: '', // 优量汇广告APPID
            tdAdAppId: '', // 淘豆广告APPID
            tdAdAppKey: '', // 淘豆广告Key
            ksAdAppId: '', // 快手APPID
            csjWeight: undefined,
            ylhWeight: undefined,
            tdWeight: undefined,
            ksWeight: undefined
          }
        },
        adList: []
      },
      rules: {
        appId: [{ required: true, message: '请选择应用名称', trigger: 'blur' }],
        versionNumber: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        platform: [{ required: true, message: '请选择', trigger: 'blur' }],
        backgroundTailTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        newUserDay: [{ required: true, message: '请输入', trigger: 'blur' }],
        readPageNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        readPageTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        platformIds: [{ required: true, message: '请选择推广平台', trigger: 'blur' }],
        homePageInterstitialTime: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      loading: false,
      statusSelect: adEnum.statusSelect,
      adSdkSelect: adEnum.adSdkSelect,
      typeSelect: adEnum.typeSelect,
      locationSelect: adEnum.locationSelect,
      platformOptions: adEnum.platformOptions,
      innerVisible: false,
      addForm: {
        length: 1
      },
      listForm: {
        adLocationId: undefined,
        position: undefined,
        adSdk: undefined,
        adType: 1,
        // platformId: undefined,
        status: 1,
        weight: undefined
      },
      list: [],
      loadingInstance: null,
      isLastDelect: false, // 用于编辑时,删除最后一条时特殊处理
      platformIds: [],
      checked: false
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑广告' : '新增广告'
    },
    api() {
      return this.isEdit ? updateAdvert : addAdvert
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      } else {
        if (this.isEdit) {
          this.getEdit()
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:open', false)
    },
    sava() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          if (this.isEdit && this.isLastDelect) {
            // 编辑状态,删除数据是最后数据时,点击保存有数据变为新增请求,没数据关闭弹窗
            if (this.list && this.list.length) {
              const isThrough = this.checkList()
              if (!isThrough) return
              this.loading = true
              // this.loading = testCrawlerRule
              const objParam = JSON.parse(JSON.stringify(this.form))
              const strArr = ['csjWeight', 'ylhWeight', 'tdWeight', 'ksWeight']
              if (objParam.adConfigJson) {
                Object.keys(objParam.adConfigJson.android).forEach(i => {
                  strArr.forEach(k => {
                    if (i === k) {
                      objParam.adConfigJson.android[i] = (objParam.adConfigJson.android[i]).toString()
                    }
                  })
                })
                Object.keys(objParam.adConfigJson.ios).forEach(i => {
                  strArr.forEach(k => {
                    if (i === k) {
                      objParam.adConfigJson.ios[i] = (objParam.adConfigJson.ios[i]).toString()
                    }
                  })
                })
              }
              addAdvert(objParam)
                .then((res) => {
                  this.$message.success(res.msg)
                  this.$emit('success', true)
                })
                .finally(() => {
                  this.loading = false
                })
            } else {
              this.$emit('success', true)
            }
          } else {
            const isThrough = this.checkList()
            if (!isThrough) return
            this.loading = true
            const objParam = JSON.parse(JSON.stringify(this.form))
            const strArr = ['csjWeight', 'ylhWeight', 'tdWeight', 'ksWeight']
            if (objParam.adConfigJson) {
              Object.keys(objParam.adConfigJson.android).forEach(i => {
                strArr.forEach(k => {
                  if (i === k) {
                    objParam.adConfigJson.android[i] = (objParam.adConfigJson.android[i]).toString()
                  }
                })
              })
              Object.keys(objParam.adConfigJson.ios).forEach(i => {
                strArr.forEach(k => {
                  if (i === k) {
                    objParam.adConfigJson.ios[i] = (objParam.adConfigJson.ios[i]).toString()
                  }
                })
              })
            }
            this.api(objParam)
              .then((res) => {
                this.$message.success(res.msg)
                this.$emit('success', true)
              })
              .finally(() => {
                this.loading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resat() {
      this.form = {
        appId: undefined,
        versionNumber: undefined,
        platform: undefined,
        backgroundTailTime: undefined,
        newUserDay: undefined,
        readPageNumber: undefined,
        readPageTime: undefined,
        watchVideoFreeTime: undefined,
        readUnlockChapter: undefined,
        readUnlockIntervalChapter: undefined,
        homePageInterstitialTime: undefined,
        platformIds: undefined,
        adConfigJson: {
          android: {
            csjAdAppId: '',
            ylhAdAppId: '',
            tdAdAppId: '',
            tdAdAppKey: '',
            bqtAdAppId: '',
            csjWeight: undefined,
            ylhWeight: undefined,
            tdWeight: undefined,
            ksWeight: undefined
          },
          ios: {
            csjAdAppId: '',
            ylhAdAppId: '',
            tdAdAppId: '',
            tdAdAppKey: '',
            bqtAdAppId: '',
            csjWeight: undefined,
            ylhWeight: undefined,
            tdWeight: undefined,
            ksWeight: undefined
          }
        },
        adList: []
      }
      this.checked = false
      this.platformIds = []
      this.list = []
      this.loading = false
      this.isLastDelect = false
      this.$refs['form'].clearValidate()
    },
    async getEdit() {
      const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
      this.loadingInstance = this.$loading({
        target: dialogPanel
      })
      // this.list = _.cloneDeep(this.formData)
      const { appId, versionNumber, platform } = this.formData[0]
      this.form.appId = appId
      this.form.versionNumber = versionNumber
      this.form.platform = platform
      try {
        const { data } = await advertDetailFeach({ appId, versionNumber, platform })
        this.form.id = data.id
        this.form.appId = data.appId
        this.form.versionNumber = data.versionNumber
        this.form.backgroundTailTime = data.backgroundTailTime
        this.form.newUserDay = data.newUserDay
        this.form.readPageNumber = data.readPageNumber
        this.form.readPageTime = data.readPageTime
        this.form.watchVideoFreeTime = data.watchVideoFreeTime
        this.form.readUnlockChapter = data.readUnlockChapter
        this.form.readUnlockIntervalChapter = data.readUnlockIntervalChapter
        this.form.homePageInterstitialTime = data.homePageInterstitialTime
        const strArr = ['csjWeight', 'ylhWeight', 'tdWeight', 'ksWeight']
        if (data.adConfigJson) {
          Object.keys(data.adConfigJson.android).forEach(i => {
            strArr.forEach(k => {
              if (i === k && data.adConfigJson.android[i]) {
                data.adConfigJson.android[i] = Number(data.adConfigJson.android[i])
              }
            })
          })
          Object.keys(data.adConfigJson.ios).forEach(i => {
            strArr.forEach(k => {
              if (i === k && data.adConfigJson.ios[i]) {
                data.adConfigJson.ios[i] = Number(data.adConfigJson.ios[i])
              }
            })
          })
        }
        this.form.adConfigJson = data.adConfigJson
        this.form.platformIds = data.platformIds
        this.platformIds = data.platformIds.split(',').map((item) => Number(item))
        this.list = data.positionList
        this.checked = this.platformIds.length === this.platformSelect.length
      } finally {
        this.loadingInstance.close()
      }
    },
    addList() {
      this.innerVisible = false
      const line = Array.from({ length: this.addForm.length }, (_, idx) => ({
        ...this.listForm
      }))
      this.list = this.list.concat(line)
    },
    openDialog() {
      this.addForm.length = 1
      this.innerVisible = true
    },
    deleteData(s) {
      if (s.row.id) {
        // 编辑删除
        this.$confirm(`是否确认删除 ${s.row.id} 数据项?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAdvert({ ids: [s.row.id] }).then((res) => {
            this.$message.success(res.msg)
            this.$emit('refresh')
            this.list.splice(s.$index, 1)
            if (!res.data) {
              this.isLastDelect = true
            }
          })
        })
      } else {
        // 新增删除
        this.list.splice(s.$index, 1)
      }
    },
    checkList() {
      if (!this.list.length) {
        this.$message.error('广告数据不能为空')
        return false
      }
      const { adLocationId, position, adSdk } = this.list[0]
      if (!adLocationId || !position || !adSdk) {
        this.$message.error('广告数据不能为空')
        return false
      }

      const adList = _.cloneDeep(this.list)
      let isRepeat = false // 是否有重复相同数据
      const adPositionalArr = [] // 是否'阅读页广告拦截漫画'和'阅读页看漫画解锁章节'同时存在
      const unqi = [] // 去重后数组
      let repeatId = ''
      adList.forEach((item, index) => {
        // if (!item.platformId) {
        //   item.platformId = adList[index - 1].platformId
        // }
        if (!item.adSdk) {
          item.adSdk = adList[index - 1].adSdk
        }
        adPositionalArr.push(item.position)
        item.appId = this.form.appId
        item.versionNumber = this.form.versionNumber
        item.adBaseId = this.form.id

        // 判断去重
        let flag = true // 记录标识
        unqi.forEach((i) => {
          if (i.adSdk === item.adSdk && i.position === item.position) {
            isRepeat = true
            flag = false
            repeatId = item.adLocationId
          }
        })
        if (flag) unqi.push(item)
      })
      // 判断所有是否存在空值
      const k = adList.findIndex((item) => !item.adLocationId || !item.position || !item.adSdk)
      if (k !== -1) {
        this.$message.error('广告数据不能为空')
        return false
      }
      if (isRepeat) {
        this.$message.error(`广告位信息存在重复信息,不能重复添加,广告位id:${repeatId}`)
        return false
      }
      if (adPositionalArr.includes(8) && adPositionalArr.includes(13)) {
        this.$message.error('相同版本号的“阅读页广告拦截视频”和“阅读页看视频解锁章节”不能同时存在')
        return
      }
      this.form.adList = adList
      return true
    },
    sortChange(r) {
      if (r.order === 'descending') {
        this.list = _.orderBy(this.list, r.prop, 'desc')
      } else {
        this.list = _.orderBy(this.list, r.prop, 'asc')
      }
    },
    changeSelect(val) {
      this.checked = val.length === this.platformSelect.length
      this.form.platformIds = val.sort((a, b) => a - b).join(',')
    },
    // 点击全选
    selectAll(val) {
      if (val) {
        // 全选
        if (this.platformIds.length !== this.platformSelect.length) {
          this.platformIds = this.platformSelect.map((item) => {
            return item.id
          })
        }
      } else {
        this.platformIds = []
      }
      this.changeSelect(this.platformIds)
    }
  }
}
</script>

<style lang="scss" scoped>
.inpNum {
  :global(.el-input__inner) {
    text-align: inherit;
  }
}
.numberInputbox {
  width: 130px;
  input {
    box-sizing: border-box;
  }
}
.allCheck {
  text-align: right;
  width: 100%;
  padding-right: 10px;
}
</style>
