<template>
  <div class="app-container appOverview">
    <el-card shadow="hover" class="box-card">
      <el-form ref="queryForm" :model="form" :inline="true">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="form.appId" :is-sel-first="form.appId ? false : true"></appNameCon>
        </el-form-item>
        <el-form-item label="推广平台" prop="platformId">
          <el-select v-model="form.platformId" clearable placeholder="点击选择">
            <el-option v-for="dict in platformsNameOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计时长" prop="time">
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
        <h1>应用概览</h1>
        <div class="box">
          <div class="col">
            <div class="num">{{ base.totalSumEquipment }}</div>
            <el-tooltip class="item" effect="dark" content="在当前应用内，首次安装并且打开应用的设备总数。" placement="bottom">
              <div class="name">总累计设备</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ base.totalEquipment }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="所选日期内，首次安装并且打开应用的设备总数。一台设备，只在首次安装打开应用时计作累计设备，重复安装应用的设备不会重复计量"
              placement="bottom"
            >
              <div class="name">所选日期的总设备</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ base.lastThreeActive }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="从所选的结束日期起，最近3天（不含结束日期）至少使用过一次应用的设备数"
              placement="bottom"
            >
              <div class="name">近3天活跃设备</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ base.lastSevenActive }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="从所选的结束日期起，最近7天（不含结束日期）至少使用过一次应用的设备数"
              placement="bottom"
            >
              <div class="name">近7天活跃设备</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ base.lastThirtyActive }}</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="从所选的结束日期起，最近30天（不含结束日期）至少使用过一次应用的设备数"
              placement="bottom"
            >
              <div class="name">近30天活跃设备</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ base.numberStarts }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，应用被启动的总次数" placement="bottom">
              <div class="name">启动次数</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ base.averageDuration }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，活跃设备使用应用的时长均值" placement="bottom">
              <div class="name">使用时长均值</div>
            </el-tooltip>
          </div>
        </div>

        <div class="title" style="margin-bottom:10px">
          数据趋势
          <span style="float:right;margin-right:10px">
            <i class="el-icon-download icon" @click="downloadXsls('应用概览')"></i>
            <el-tooltip class="item" effect="dark" content="所选日期内，会员平均阅读时长均值" placement="bottom">
              <template slot="content">
                <div id="u167_text" class="text">
                  <p>数据指标说明</p>
                  <p>
                    新增设备:
                    所选日期内，每日首次安装并且打开应用的设备数。一台设备，只在首次安装打开应用时计作新增设备，重复安装应用的设备不会重复计量。
                  </p>
                  <p>活跃设备: 所选日期内，每日的活跃设备数。</p>
                  <p>启动次数: 所选日期内，每日应用被启动的总次数。</p>
                  <p>使用时长: 所选日期内，每日启动应用的时长均值。图表值单位为“秒”</p>
                </div>
              </template>
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="新增设备" name="first">
              <Chart v-if="activeName === 'first'" name="新增设备" :title="newDevicesTitle" :x-axis="day" :series-data="addData"></Chart>
            </el-tab-pane>
            <el-tab-pane label="活跃设备" name="second">
              <Chart
                v-if="activeName === 'second'"
                id="second"
                name="活跃设备"
                :x-axis="day"
                :title="activeDevicesTitle"
                :series-data="activeDevices"
              ></Chart>
            </el-tab-pane>
            <el-tab-pane label="启动次数" name="third">
              <Chart
                v-if="activeName === 'third'"
                id="third"
                name="启动次数"
                :title="operationCountsTitle"
                :x-axis="day"
                :series-data="operationCounts"
              ></Chart>
            </el-tab-pane>
            <el-tab-pane label="使用时长" name="fourth">
              <Chart v-if="activeName === 'fourth'" id="fourth" name="使用时长" :x-axis="day" :series-data="useTime"></Chart>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="title">数据详情</div>
        <DataList :list="list" :column="column" :have-operation="true" @handleBtnClick="handleBtnClick"></DataList>
        <DialogList
        :dialoglist="dialoglist"
        :dialog-column="dialogColumn"
        :dialog-open.sync="dialogOpen"
        :day-str="diaDayStr"
        :page-count="pageCount"
        @getMoreList="getMoreList"></DialogList>
      </div>
    </el-card>
  </div>
</template>

<script>
import appNameCon from '@/components/AppNameCON'
import DataList from '../components/DataList'
import DialogList from '../components/dialogList.vue'
import Chart from '../components/Chart'
import { listAppoverview, listOverviewInfo } from '@/api/statisticsApi'
import { mapState, mapMutations } from 'vuex'
import mixins from '../mixins'
import { secondToDate } from '@/utils'

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
          label: '新增设备',
          prop: 'addData'
        },
        {
          label: '活跃设备',
          prop: 'activeData'
        },
        {
          label: '启动次数',
          prop: 'operationCounts'
        },
        {
          label: '使用时长',
          prop: 'secondReading'
        }
      ],
      base: {
        averageDuration: secondToDate(0),
        lastThreeActive: 0,
        lastSevenActive: 0,
        lastThirtyActive: 0,
        totalEquipment: 0,
        totalSumEquipment: 0,
        numberStarts: 0
      },
      newEquipment: {
        nearlySevenData: 0,
        nearlyThirtyData: 0,
        yesterdayData: 0,
        todayData: 0
      },
      day: [],
      addData: [],
      activeDevices: [],
      memberRegister: [],
      operationCounts: [],
      useTime: [],
      readingtime: [],
      registerTitle: '',
      operationCountsTitle: '',
      newDevicesTitle: '',
      activeDevicesTitle: '',
      platformsNameOptions: [],
      dialoglist: [],
      dialogColumn: [],
      dialogOpen: false,
      diaDayStr: '',
      diaAppName: '',
      tableTypeRow: {
        pageIndex: 1,
        pageSize: 10,
        day: '',
        str: ''
      },
      pageCount: 0
    }
  },
  computed: {
    ...mapState({
      appOverviewForm: state => state.statistical.appOverviewForm,
      appOverViewTime: state => state.statistical.appOverViewTime,
      appOverviewNum: state => state.statistical.appOverviewNum,
      channelList: state => state.user.channelList,
      isShowChannel: state => state.user.isShowChannel
    }),
    isChannelDefault() {
      return !this.appOverviewNum
    }
  },
  watch: {
    channelList(val) {
      if (val && !this.appOverviewNum) {
        setTimeout(() => {
          this.getAppOverview()
        }, 1)
      }
    },
    'form.appId'() {
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
  },
  methods: {
    ...mapMutations(['statistical/SET_APP_OVERVIEW']),
    handleQuery() {
      if (!this.form.startTime) {
        this.$message.error('请选择时间区间')
        return
      }
      this.setcacheForm()
      this.getAppOverview()
    },
    resetQuery() {
      this.isReset = true
      this.form = {
        appId: undefined,
        platformId: this.platformsNameOptions.length ? this.platformsNameOptions[0].id : undefined,
        startTime: '',
        endTime: ''
      }
      this.time = 1
      this.timeSelectChange(this.time)
      this.setcacheForm()
      this.getAppOverview()
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
        if (this.appOverviewForm[item]) {
          this.form[item] = this.appOverviewForm[item]
        }
      })
      if (this.appOverViewTime.time) this.time = this.appOverViewTime.time
      if (this.appOverViewTime.timeArr) this.value1 = this.appOverViewTime.timeArr
    },
    setcacheForm() {
      const obj = {
        appOverviewForm: this.form,
        appOverViewTime: {
          time: this.time,
          timeArr: this.value1
        }
      }
      this.$store.commit('statistical/SET_APP_OVERVIEW', obj)
    },
    handleClick() {},
    async getAppOverview() {
      this.loading = true
      if (!this.isShowChannel) {
        delete this.form.createBy
      }
      try {
        const { data } = await listAppoverview(this.form)
        // 后端聚合计算
        this.list = this.getDay(data.list)
        // 前端聚合计算
        // this.list = this.getAggregationData(data.list)
        if (data.base) {
          this.base = {
            averageDuration: secondToDate(data.base.averageDuration),
            lastThreeActive: data.base.lastThreeActive,
            lastSevenActive: data.base.lastSevenActive,
            lastThirtyActive: data.base.lastThirtyActive,
            totalEquipment: data.base.totalEquipment,
            totalSumEquipment: data.base.totalSumEquipment,
            numberStarts: data.base.numberStarts
          }
        }
        if (data.newEquipment) {
          const { nearlySevenData, nearlyThirtyData, yesterdayData, todayData } = data.newEquipment
          this.newDevicesTitle = `{a|当天}{b| ${todayData}}   {a|前一天}{b| ${yesterdayData}}   {a|近7天}{b| ${nearlySevenData}}   {a|近30天}{b| ${nearlyThirtyData}}`
        }
        const end = this.list[this.list.length - 1]
        if (data.activeDevices) {
          const { yesterdayData } = data.activeDevices
          this.activeDevicesTitle = `{a|当天}{b| ${end.activeData}}   {a|前一天}{b| ${yesterdayData}}`
        }
      } catch {
        this.list = this.getDay()
        this.newDevicesTitle = `{a|当天}{b| 0}   {a|前一天}{b| 0}   {a|近7天}{b| 0}   {a|近30天}{b| 0}`
        this.activeDevicesTitle = `{a|当天}{b| 0}   {a|前一天}{b| 0}`
      } finally {
        this.loading = false
      }
    },
    getDay(data) {
      const dayIndex = this.dayjs(this.form.endTime).diff(this.dayjs(this.form.startTime), 'day')
      const list = []
      let operationCountsNum = 0
      for (let i = 0; i <= dayIndex; i++) {
        const day = this.dayjs(this.form.startTime)
          .add(i, 'day')
          .format('YYYY-MM-DD')
        let obj = {
          day,
          addData: 0,
          activeData: 0,
          operationCounts: 0,
          useTime: 0,
          secondReading: secondToDate(0)
        }
        if (data && Array.isArray(data)) {
          const findIndex = data.findIndex(item => this.dayjs(item.day).format('YYYY-MM-DD') === day)
          if (findIndex > -1) {
            const item = data[findIndex]
            obj = {
              day,
              addData: item.addData,
              activeData: item.activeData,
              operationCounts: item.operationCounts,
              useTime: item.useTime,
              secondReading: secondToDate(item.useTime)
            }
          }
        }
        operationCountsNum = operationCountsNum + obj.operationCounts
        list.push(obj)
      }
      const day = []
      const addData = []
      const activeDevices = []
      const operationCounts = []
      const useTime = []
      list.forEach(item => {
        day.push(item.day)
        addData.push(item.addData)
        activeDevices.push(item.activeData)
        operationCounts.push(item.operationCounts)
        useTime.push(item.useTime)
      })
      this.day = day
      this.addData = addData
      this.activeDevices = activeDevices
      this.operationCounts = operationCounts
      this.useTime = useTime
      const mean = operationCountsNum / (dayIndex + 1)
      this.operationCountsTitle = `{a|启动次数均值  }{b|${mean.toFixed(2)}}`
      return list
    },

    // 前端聚合计算
    getAggregationData(data) {
      const dayIndex = this.dayjs(this.form.endTime).diff(this.dayjs(this.form.startTime), 'day')
      data = data.map(item => {
        return {
          day: this.dayjs(item.day).format('YYYY-MM-DD'),
          addData: item.addData,
          activeData: item.activeData,
          operationCounts: item.operationCounts,
          useTime: item.useTime
        }
      })
      const list = []
      let operationCountsNum = 0
      for (let i = 0; i <= dayIndex; i++) {
        const day = this.dayjs(this.form.startTime)
          .add(i, 'day')
          .format('YYYY-MM-DD')
        const obj = {
          day,
          addData: 0,
          activeData: 0,
          operationCounts: 0,
          useTime: 0
        }
        if (data && Array.isArray(data)) {
          const filterList = data.filter(item => this.dayjs(item.day).format('YYYY-MM-DD') === day)
          filterList.forEach(item => {
            obj.addData = obj.addData + item.addData
            obj.activeData = obj.activeData + item.activeData
            obj.operationCounts = obj.operationCounts + item.operationCounts
            obj.useTime = obj.useTime + item.useTime
          })
        }
        operationCountsNum = operationCountsNum + obj.operationCounts
        list.push({ secondReading: secondToDate(obj.useTime), ...obj })
      }
      const dayList = []
      const addData = []
      const activeDevices = []
      const operationCounts = []
      const useTime = []
      list.forEach(item => {
        dayList.push(item.day)
        addData.push(item.addData)
        activeDevices.push(item.activeData)
        operationCounts.push(item.operationCounts)
        useTime.push(item.useTime)
      })
      this.day = dayList
      this.addData = addData
      this.activeDevices = activeDevices
      this.operationCounts = operationCounts
      this.useTime = useTime
      const mean = operationCountsNum / (dayIndex + 1)
      this.operationCountsTitle = `{a|启动次数均值  }{b|${mean.toFixed(2)}}`
      return list
    },
    handleBtnClick(obj) {
      const { day, str } = obj
      this.tableTypeRow.pageIndex = 1
      this.tableTypeRow.pageSize = 10
      this.tableTypeRow.day = day
      this.tableTypeRow.str = str
      this.getdialogList()
    },
    async getdialogList() {
      let obj = {}
      if (this.tableTypeRow.str === 'add') {
        obj = {
          appId: this.form.appId,
          platformId: this.form.platformId,
          day: this.tableTypeRow.day,
          isFirst: 1,
          pageIndex: this.tableTypeRow.pageIndex,
          pageSize: this.tableTypeRow.pageSize
        }
      } else {
        obj = {
          appId: this.form.appId,
          platformId: this.form.platformId,
          day: this.tableTypeRow.day,
          dayFirst: 1,
          pageIndex: this.tableTypeRow.pageIndex,
          pageSize: this.tableTypeRow.pageSize
        }
      }
      const { data } = await listOverviewInfo(obj)
      this.pageCount = data.count
      const arr = data.list.map(i => {
        i.createdAt = this.parseTime(i.createdAt)
        i.updatedTime = this.parseTime(i.updatedTime)
        i.memberType = i.userId === 0 ? '否' : '是'
        i.duration = secondToDate(i.duration)
        return i
      })
      this.dialoglist = arr
      if (this.tableTypeRow.str === 'add') {
        const dialogColumn = [
          {
            label: 'id',
            prop: 'id'
          },
          {
            label: '设备号',
            prop: 'device'
          },
          {
            label: '是否会员',
            prop: 'memberType'
          },
          {
            label: '应用名称',
            prop: 'appName'
          },
          {
            label: '使用时长',
            prop: 'duration'
          },
          {
            label: '启动次数',
            prop: 'reportTimes'
          },
          {
            label: '拦截广告点击数',
            prop: 'clickTimes'
          },
          {
            label: '拦截播完回调数',
            prop: 'finishTimes'
          },
          {
            label: '创建时间',
            prop: 'createdAt'
          },
          {
            label: '更新时间',
            prop: 'updatedTime'
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
            label: '设备号',
            prop: 'device'
          },
          {
            label: '是否会员',
            prop: 'memberType'
          },
          {
            label: '应用名称',
            prop: 'appName'
          },
          {
            label: '使用时长',
            prop: 'duration'
          },
          {
            label: '启动次数',
            prop: 'reportTimes'
          },
          {
            label: '拦截广告点击数',
            prop: 'clickTimes'
          },
          {
            label: '拦截播完回调数',
            prop: 'finishTimes'
          },
          {
            label: '创建时间',
            prop: 'createdAt'
          },
          {
            label: '更新时间',
            prop: 'updatedTime'
          }
        ]
        this.dialogColumn = dialogColumns
      }
      this.dialogOpen = true
    },
    getMoreList(obj) {
      const { pageIndex, pageSize } = obj
      this.tableTypeRow.pageIndex = pageIndex
      this.tableTypeRow.pageSize = pageSize
      this.getdialogList()
    }
  }
}
</script>

<style lang="scss" scoped>
.appOverview {
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
      // padding-right: 12px;
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
