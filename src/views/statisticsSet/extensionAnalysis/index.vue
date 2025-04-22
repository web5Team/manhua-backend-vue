<template>
  <div class="app-container memberStatistics">
    <el-card shadow="hover" class="box-card">
      <el-form ref="queryForm" :model="form" :inline="true">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="form.appId" :is-clearable="false" :is-sel-first="form.appId ? false : true" @selectAppName="selectAppName"></appNameCon>
        </el-form-item>
        <el-form-item label="推广平台" prop="platformId">
          <el-select v-model="form.platformId" clearable placeholder="点击选择">
            <el-option v-for="dict in platformsNameOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计时段" prop="time">
          <el-select v-model="time" placeholder="点击选择" @change="timeSelectChange">
            <el-option v-for="dict in timeSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
          <el-date-picker
            v-if="time === 4"
            v-model="value1"
            type="daterange"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="timeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div v-loading="loading" class="overview">
        <h1>推广统计</h1>
        <div class="box">
          <div class="col">
            <div class="num">{{ overview.totalShareCount }}</div>
            <el-tooltip class="item" effect="dark" content="在当前应用内，邀请人发出的邀请总次数。" placement="bottom">
              <div class="name">总邀请次数</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.totalInviteNum }}</div>
            <el-tooltip class="item" effect="dark" content="在当前应用内，被邀请人成功安装应用的次数" placement="bottom">
              <div class="name">总被邀请次数</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.shareCount }}</div>
            <el-tooltip class="item" effect="dark" content="所选的日期内，邀请人发出邀请的次数" placement="bottom">
              <div class="name">所选日期的邀请次数</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.inviteNum }}</div>
            <el-tooltip class="item" effect="dark" content="所选的日期内，被邀请人成功安装应用的次数" placement="bottom">
              <div class="name">所选日期的被邀请次数</div>
            </el-tooltip>
          </div>
          <!-- <div class="col">
            <div class="num">{{ overview.totalAvarageReadingtime }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，会员平均阅读时长均值" placement="bottom">
              <div class="name">会员平均阅读时长</div>
            </el-tooltip>
          </div> -->
          <!-- <div class="col">
            <div class="num">{{ overview.shareNum }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，邀请人分享应用的次数" placement="bottom">
              <div class="name">邀请人分享次数</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.installNum }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，成功被邀请安装应用的次数" placement="bottom">
              <div class="name">被邀请人安装次数</div>
            </el-tooltip>
          </div> -->
        </div>

        <div class="title" style="margin-bottom:10px">
          数据趋势
          <span style="float:right;margin-right:10px">
            <i class="el-icon-download icon" @click="downloadXsls('推广统计')"></i>
            <el-tooltip class="item" effect="dark" content="所选日期内，会员平均阅读时长均值" placement="bottom">
              <template slot="content">
                <div id="u167_text" class="text">
                  <p>数据指标说明</p>
                  <!-- <p>总邀请数：在当前应用内，邀请人发出邀请的总次数。不选择应用时为所有应用的总邀请次数。</p>
                  <p>总被邀请次数：在当前应用内，被邀请人成功安装应用的次数。不选择应用时为所有应用总被邀请次数。</p> -->
                  <p>总邀请数：在当前应用内，邀请人发出邀请的总次数。</p>
                  <p>总被邀请次数：在当前应用内，被邀请人成功安装应用的次数。</p>
                  <p>所选日期的邀请次数：在当前应用内，按所选的日期统计，邀请人发出邀请的次数。</p>
                  <p>所选日期的被邀请次数：在当前应用内，按所选的日期统计，被邀请人成功安装应用的次数。</p>
                  <p>邀请次数(图表)：在当前应用内，按所选的日期，汇总成邀请人发出邀请的图表。</p>
                  <p>被邀请次数(图表)：在当前应用内，按所选的日期，汇总成被邀请人成功安装应用次数的图表。</p>
                </div>
              </template>
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="邀请次数" name="first">
              <Chart
                v-if="activeName === 'first'"
                name="邀请次数"
                :title="registerTitle"
                :x-axis="day"
                :series-data="memberRegister"
              ></Chart>
            </el-tab-pane>
            <el-tab-pane label="被邀请次数" name="second">
              <Chart
                v-if="activeName === 'second'"
                id="second"
                style="width:100%"
                name="被邀请次数"
                :x-axis="day"
                :series-data="readingtime"
              ></Chart>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="title">数据详情</div>
        <DataList :list="list" :column="column" :have-operation-yq="true" @btnClickCZ="btnClickCZ"></DataList>
        <DialogList
        :dialoglist="dialoglist"
        :dialog-column="dialogColumn"
        :dialog-open.sync="dialogOpen"
        :platform-id="form.platformId"
        :app-id="form.appId"
        :day-str="diaDayStr"
        :app-name="diaAppName"
        :page-count="pageCount"
        @getMoreList="getMoreList"></DialogList>
      </div>
    </el-card>
  </div>
</template>

<script>
import appNameCon from '@/components/AppNameCON'
import DataList from '../components/DataList'
import DialogList from '../components/dialogList'
import Chart from '../components/Chart'
import { listExtension, inviteeDailyDetail, inviteeDailyPassiveDetail } from '@/api/statisticsApi'
import { mapState, mapMutations } from 'vuex'
import mixins from '../mixins'
// import { secondToDate } from '@/utils'

export default {
  name: 'Index',
  components: { appNameCon, DataList, Chart, DialogList },
  mixins: [mixins],
  data() {
    return {
      form: {
        appId: undefined,
        platformId: undefined,
        startTime: '',
        endTime: ''
      },
      time: 1,
      value1: '',
      start: '',
      isReset: false,
      loading: false,
      activeName: 'first',
      list: [],
      column: [
        {
          label: '日期',
          prop: 'day'
        },
        {
          label: '邀请次数',
          prop: 'shareCount'
        },
        {
          label: '被邀请次数',
          prop: 'inviteCount'
        }
      ],
      overview: {
        inviteNum: 0,
        shareCount: 0,
        totalInviteNum: 0,
        totalShareCount: 0
      },
      day: [],
      memberRegister: [],
      readingtime: [],
      registerTitle: '',
      dialoglist: [],
      dialogColumn: [],
      dialogOpen: false,
      diaDayStr: '',
      diaAppName: '',
      platformsNameOptions: [],
      initAppId: '',
      pageCount: 0,
      tableTypeStr: ''
    }
  },
  computed: {
    ...mapState({
      extensionAnalysisForm: state => state.statistical.extensionAnalysisForm,
      extensionAnalysisTime: state => state.statistical.extensionAnalysisTime,
      extensionAnalysisNum: state => state.statistical.extensionAnalysisNum,
      channelList: state => state.user.channelList,
      isShowChannel: state => state.user.isShowChannel
    }),
    isChannelDefault() {
      return !this.extensionAnalysisNum
    }
  },
  watch: {
    channelList(val) {
      if (val && !this.extensionAnalysisNum) {
        setTimeout(() => {
          this.getExtensionHistory()
        }, 1)
      }
    },
    'form.appId'(val) {
      if (!this.initAppId) {
        this.initAppId = val
      }
      if (!this.platformsNameOptions.length) {
        this.getPlatformList()
      }
    }
  },
  created() {
    this.timeSelectChange(this.time)
  },
  mounted() {
    this.getCacheForm()
    // if (this.extensionAnalysisNum || !this.isShowChannel) {
    //   this.getExtensionHistory()
    // }
  },
  methods: {
    ...mapMutations(['statistical/SET_RETAINED_EXTENSION']),
    handleQuery() {
      if (!this.form.startTime) {
        this.$message.error('请选择时间区间')
        return
      }
      this.setcacheForm()
      this.getExtensionHistory()
    },
    resetQuery() {
      this.isReset = true
      this.form = {
        appId: undefined,
        platformId: undefined,
        startTime: '',
        endTime: ''
      }
      this.time = 1
      this.timeSelectChange(this.time)
      this.setcacheForm()
      this.getExtensionHistory()
      this.form.appId = this.initAppId
    },
    timeChange(time) {
      if (time) {
        this.form.startTime = time[0]
        this.form.endTime = time[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    getCacheForm() {
      const key = Object.keys(this.form)
      key.forEach(item => {
        if (this.extensionAnalysisForm[item]) {
          this.form[item] = this.extensionAnalysisForm[item]
        }
      })
      if (this.extensionAnalysisTime.time) this.time = this.extensionAnalysisTime.time
      if (this.extensionAnalysisTime.timeArr) this.value1 = this.extensionAnalysisTime.timeArr
    },
    setcacheForm() {
      const obj = {
        extensionAnalysisForm: this.form,
        extensionAnalysisTime: {
          time: this.time,
          timeArr: this.value1
        }
      }
      this.$store.commit('statistical/SET_RETAINED_EXTENSION', obj)
    },
    handleClick() {},
    async getExtensionHistory() {
      this.loading = true
      try {
        const { data } = await listExtension(this.form)
        this.list = this.getDay(data.list)
        // const last = data.data[data.data.length - 1]
        this.overview = {
          inviteNum: data.base.inviteNum,
          shareCount: data.base.shareCount,
          totalInviteNum: data.base.totalInviteNum,
          totalShareCount: data.base.totalShareCount
        }
      } catch {
        this.list = this.getDay()
      } finally {
        this.loading = false
      }
    },
    getDay(data) {
      const dayIndex = this.dayjs(this.form.endTime).diff(this.dayjs(this.form.startTime), 'day')
      const list = []
      for (let i = 0; i <= dayIndex; i++) {
        const day = this.dayjs(this.form.startTime)
          .add(i, 'day')
          .format('YYYY-MM-DD')
        let obj = {
          day,
          shareCount: 0,
          inviteCount: 0
        }
        if (data && Array.isArray(data)) {
          const findIndex = data.findIndex(item => item.day === day)
          if (findIndex > -1) {
            const item = data[findIndex]
            obj = {
              day,
              shareCount: item.shareCount,
              inviteCount: item.inviteCount
            }
          }
        }
        list.push(obj)
      }
      const blStr = this.activeName === 'first' ? 'shareCount' : 'inviteCount'
      const endDayNum = list[list.length - 1][blStr]
      const day = []
      const memberRegister = []
      const readingtime = []
      list.forEach(item => {
        day.push(item.day)
        memberRegister.push(item.shareCount)
        readingtime.push(item.inviteCount)
      })
      this.day = day
      this.memberRegister = memberRegister
      this.readingtime = readingtime
      this.registerTitle = `{a|当天  }{b|${endDayNum}}`
      return list
    },
    getDays(data, str) {
      const list = []
      data.forEach(item => {
        let obj = {}
        if (str === 'shareCount') {
          obj = {
            id: item.id,
            device: item.device,
            shareCount: item.shareCount,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        } else {
          obj = {
            id: item.id,
            device: item.device,
            pDevice: item.pDevice,
            invitCode: item.invitCode,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        }
        list.push(obj)
      })
      return list
    },
    async btnClickCZ(obj) {
      this.diaDayStr = obj.day
      this.tableTypeStr = obj.str
      const params = {
        day: obj.day,
        appId: this.form.appId,
        platformId: this.form.platformId,
        pageIndex: 1,
        pageSize: 10
      }
      this.getdialogList(params)
    },
    async getdialogList(params) {
      const api = this.tableTypeStr === 'shareCount' ? inviteeDailyDetail : inviteeDailyPassiveDetail
      const { data } = await api(params)
      this.pageCount = data.count
      const arr = data.list.map(i => {
        i.createdAt = this.parseTime(i.createdAt)
        i.updatedAt = this.parseTime(i.updatedAt)
        return i
      })
      this.dialoglist = this.getDays(arr, this.tableTypeStr)
      if (this.tableTypeStr === 'shareCount') {
        const dialogColumn = [
          {
            label: 'id',
            prop: 'id'
          },
          {
            label: '邀请人设备号',
            prop: 'device'
          },
          {
            label: '邀请次数',
            prop: 'shareCount'
          },
          {
            label: '创建时间',
            prop: 'createdAt'
          },
          {
            label: '更新时间',
            prop: 'updatedAt'
          }
        ]
        this.dialogColumn = dialogColumn
      } else {
        const dialogColumns = [
          {
            label: 'id',
            prop: 'id'
          },
          {
            label: '被邀请人设备号',
            prop: 'device'
          },
          {
            label: '邀请人设备号',
            prop: 'pDevice'
          },
          {
            label: '邀请码',
            prop: 'invitCode'
          },
          {
            label: '创建时间',
            prop: 'createdAt'
          },
          {
            label: '更新时间',
            prop: 'updatedAt'
          }
        ]
        this.dialogColumn = dialogColumns
      }
      this.dialogOpen = true
    },
    getMoreList(obj) {
      this.getdialogList(obj)
    },
    selectAppName(val) {
      this.diaAppName = val
    }
  }
}
</script>

<style lang="scss" scoped>
.memberStatistics {
  .overview {
    h1 {
      font-size: 18px;
      color: #464c5b;
      line-height: 24px;
      padding-bottom: 15px;
      font-weight: 400;
      margin: 0;
    }

    .box {
      display: flex;
      flex-wrap: wrap;
    }
    .col {
      padding-right: 40px;
      text-align: center;
    }
    .num {
      font-size: 32px;
      color: #464c5b;
      line-height: 48px;
      padding-right: 12px;
    }
    .name {
      min-width: 48px;
      font-size: 12px;
      color: #657180;
      line-height: 16px;
    }
  }
  .title {
    margin: 20px 0;
    font-size: 16px;
    color: #464c5b;
    line-height: 16px;
    font-weight: 600;
  }
  .icon {
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
    &:hover {
      color: #5cb6ff;
    }
  }
  .text {
    margin: 0;
    padding: 0;
  }
  // .tabs {
  //   // margin: 20px 0;
  // }
}
</style>
