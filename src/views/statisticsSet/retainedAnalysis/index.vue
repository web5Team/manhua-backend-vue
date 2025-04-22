<template>
  <div class="app-container retainedAnalysis">
    <el-card shadow="hover" class="box-card">
      <el-form ref="queryForm" :model="form" :inline="true">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="form.appId" :is-clearable="false" :is-sel-first="form.appId ? false : true"></appNameCon>
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

      <div class="overview">
        <div class="title" style="margin-bottom:10px;overflow:hidden">
          留存分析
          <span style="float:right;margin-right:10px">
            <el-radio-group v-model="form.type" size="mini" @change="groupChange">
              <el-radio-button :label="1">日</el-radio-button>
              <el-radio-button :label="2">周</el-radio-button>
              <el-radio-button :label="3">月</el-radio-button>
            </el-radio-group>
            <i class="el-icon-download icon" @click="downloadXsls('留存分析')"></i>
            <el-tooltip class="item" effect="dark" content="所选日期内，会员平均阅读时长均值" placement="bottom">
              <template slot="content">
                <div id="u167_text" class="text">
                  <p>数据指标说明</p>
                  <p>新增设备留存率: 所选日期内的新增设备，在之后指定时间内还在使用应用的比例。</p>
                  <p>活跃设备留存率: 所选日期内的活跃设备，在之后指定时间内还在使用应用的比例。</p>
                  <p>
                    N日留存率:
                    某日新增（或活跃）设备在之后第N日使用过应用的设备比例。某日新增（或活跃）后第N日使用过应用的设备/该日新增（或活跃）设备。无特殊说明时，一般均指新增设备活跃率。
                  </p>
                  <p>
                    N周留存率: 某自然周新增设备，在该周后第N个自然周使用过应用的设备比例。该周后第N个自然周使用过应用的设备/该周新增设备。
                  </p>
                  <p>
                    N月留存率:
                    某自然月新增设备，在该月后第N个自然月使用过应用的设备比例。该自然月后第N个自然月中使用过应用的设备/该自然月新增设备。
                  </p>
                  <p>有效均值: 判断+n是否是未来日期或没有完全结束的日期，是的话不参与计算。</p>
                </div>
              </template>
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="新增设备留存" name="first">
              <DataList style="padding-bottom: 10px;" :loading="loading" :list="list" :column="column"></DataList>
            </el-tab-pane>
            <el-tab-pane label="活跃设备留存" name="second">
              <DataList style="padding-bottom: 10px;" :loading="loading" :list="list" :column="column"></DataList>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import appNameCon from '@/components/AppNameCON'
import DataList from '../components/DataList'
import { retainedStatistics } from '@/api/statisticsApi'
import { mapState, mapMutations } from 'vuex'
import mixins from '../mixins'
import { secondToDate } from '@/utils'

export default {
  name: 'Index',
  components: { appNameCon, DataList },
  mixins: [mixins],
  data() {
    return {
      form: {
        appId: undefined,
        platformId: undefined,
        startTime: '',
        endTime: '',
        type: 1,
        anaType: 1
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
          label: '注册会员',
          prop: 'registerNumber'
        },
        {
          label: '近3天注册会员',
          prop: 'lastThreeRegister'
        },
        {
          label: '近7天注册会员',
          prop: 'lastSevenRegister'
        },
        {
          label: '近30天注册会员',
          prop: 'lastThirtyRegister'
        },
        {
          label: '会员阅读时长',
          prop: 'secondReading'
        }
      ],
      overview: {
        totalRegister: 0,
        lastThreeRegister: 0,
        lastSevenRegister: 0,
        lastThirtyRegister: 0,
        totalAvarageReadingtime: secondToDate(0)
      },
      day: [],
      memberRegister: [],
      readingtime: [],
      registerTitle: '',
      firstRes: 0,
      appIdOption: [],
      platformsNameOptions: [],
      initAppId: ''
    }
  },
  computed: {
    ...mapState({
      retainedAnalysisForm: state => state.statistical.retainedAnalysisForm,
      retainedAnalysisTime: state => state.statistical.retainedAnalysisTime,
      retainedAnalysisNum: state => state.statistical.retainedAnalysisNum,
      retainedAnalysisFirst: state => state.statistical.retainedAnalysisFirst,
      channelList: state => state.user.channelList,
      isShowChannel: state => state.user.isShowChannel
    }),
    isChannelDefault() {
      return !this.retainedAnalysisNum
    },
    isAppDefault() {
      return !this.retainedAnalysisNum || this.isShowChannel
    }
  },
  watch: {
    // 'form.createBy'(val) {
    //   if (val && this.retainedAnalysisNum && this.appIdOption.length) {
    //     this.form.appId = this.appIdOption[0].id || ''
    //   }
    // },
    'form.appId'(val) {
      if (!this.initAppId) {
        this.initAppId = val
      }
      if (val && !this.retainedAnalysisNum && !this.firstRes) {
        this.getKeepanalysisList()
      }
      if (!this.platformsNameOptions.length) {
        this.getPlatformList()
      }
      // if (val && this.isReset && this.isShowChannel) {
      //   this.getKeepanalysisList()
      //   this.isReset = false
      // }
    }
  },
  created() {
    this.timeSelectChange(this.time)
  },
  mounted() {
    this.getCacheForm()
    this.getColumn(this.form.type)
    this.activeName = this.form.anaType === 1 ? 'first' : 'second'
    // if (this.retainedAnalysisNum) {
    //   this.getKeepanalysisList()
    // }
    // this.getKeepanalysisList()
  },
  methods: {
    ...mapMutations(['statistical/SET_RETAINED_ANALYSIS']),
    handleQuery() {
      this.list = []
      if (!this.form.startTime) {
        this.$message.error('请选择时间区间')
        return
      }
      if (!this.form.appId) {
        this.$message.error('请选择应用名称')
        return
      }
      this.setcacheForm()
      this.getKeepanalysisList()
    },
    resetQuery() {
      // this.isReset = true
      this.form = {
        appId: undefined,
        platformId: undefined,
        startTime: '',
        endTime: '',
        type: 1,
        anaType: 1
      }
      this.time = 1
      this.form.appId = this.initAppId
      this.timeSelectChange(this.time)
      if (!this.isShowChannel && this.appIdOption.length) {
        this.form.appId = this.appIdOption[0].id
      }
      if (this.isShowChannel) {
        this.form.appId = this.retainedAnalysisFirst.appId
        this.form.createBy = this.retainedAnalysisFirst.createBy
        this.getKeepanalysisList()
      }
      if (!this.isShowChannel) this.getKeepanalysisList()
      this.setcacheForm()
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
    groupChange(val) {
      this.getColumn(val)
      this.handleQuery()
    },
    appIdArr(arr) {
      this.appIdOption = arr
    },
    getCacheForm() {
      const key = Object.keys(this.form)
      key.forEach(item => {
        if (this.retainedAnalysisForm[item]) {
          this.form[item] = this.retainedAnalysisForm[item]
        }
      })
      if (this.retainedAnalysisTime.time) this.time = this.retainedAnalysisTime.time
      if (this.retainedAnalysisTime.timeArr) this.value1 = this.retainedAnalysisTime.timeArr
    },
    setcacheForm() {
      const obj = {
        retainedAnalysisForm: this.form,
        retainedAnalysisTime: {
          time: this.time,
          timeArr: this.value1
        }
      }
      this.$store.commit('statistical/SET_RETAINED_ANALYSIS', obj)
    },
    handleClick() {
      this.form.anaType = this.activeName === 'first' ? 1 : 2
      this.handleQuery()
    },
    async getKeepanalysisList() {
      if (!this.form.appId) {
        this.$message.error('请选择应用名称')
        this.list = []
        return
      }
      this.loading = true
      this.list = []
      if (!this.isShowChannel) {
        delete this.form.createBy
      }
      try {
        const { data } = await retainedStatistics(this.form)
        if (!this.retainedAnalysisNum && !this.firstRes) {
          this.$store.commit('statistical/SET_RETAINED_ANALYSIS_FIRST', { createBy: this.form.createBy, appId: this.form.appId })
        }
        if (!this.firstRes) this.firstRes = 1
        const list = []
        const dayIndex = this.dayjs(this.form.endTime).diff(this.dayjs(this.form.startTime), 'day')
        const column = this.column
          .filter(item => item.prop !== 'name' && item.prop !== 'count')
          .map(item => {
            return item.prop
          })
        const columnIndex = [1, 2, 3, 4, 5, 6, 7, 14, 30]
        const mean = { name: '均值', count: 0 }
        mean.countArr = []
        column.forEach((k, index) => {
          mean[k + 'Arr'] = []
        })
        data.list.forEach(item => {
          column.forEach((k, index) => {
            if (!mean[k]) mean[k] = 0
            if (!item[k]) item[k] = 0
          })
        })

        list.push(mean)
        const meanHash = {}
        if (this.form.type === 1) {
          for (let i = 0; i <= dayIndex; i++) {
            const day = this.dayjs(this.form.startTime)
              .add(i, 'day')
              .format('YYYY-MM-DD')
            let obj = { name: day, count: 0 }
            column.forEach((item, index) => {
              const addDay = this.dayjs(this.dayjs(day).add(columnIndex[index], 'day'))
              if (this.dayjs().isBefore(addDay)) {
                obj[item] = ''
              } else {
                obj[item] = 'N/A'
              }
              if (!meanHash[item]) meanHash[item] = false
            })
            const findIndex = data.list.findIndex(item => item.name === day)
            if (findIndex > -1) {
              obj = data.list[findIndex]
              if (!this.dayjs(day).isToday()) {
                mean.countArr.push(obj.count)
              }
              column.forEach((item, index) => {
                const addDay = this.dayjs(this.dayjs(day).add(columnIndex[index], 'day'))
                if (obj[item] || obj[item] === 0) {
                  if (this.dayjs().isBefore(addDay)) {
                    obj[item] = ''
                  } else if (obj[item] === -1) {
                    obj[item] = '0.0%'
                  } else {
                    if (!this.dayjs(addDay).isToday() && obj[item] !== -1) mean[item + 'Arr'].push(obj[item])
                    obj[item] = (obj[item] * 100).toFixed(1) + '%'
                    if (!meanHash[item]) meanHash[item] = true
                  }
                }
              })
            }
            list.push(obj)
          }
        } else if (this.form.type === 2) {
          const weekIndex = this.dayjs(this.dayjs(this.form.endTime).startOf('w')).diff(
            this.dayjs(this.form.startTime).startOf('w'),
            'week'
          )
          const thisWeek = this.dayjs()
            .startOf('w')
            .add(1, 'day')
            .format('YYYY-MM-DD')
          for (let i = 0; i <= weekIndex; i++) {
            const weekDay = this.dayjs(this.form.startTime).day()
            const startDay = this.dayjs(this.form.startTime)
              .add(7 - weekDay + 7 * (i - 1) + 1, 'day')
              .format('YYYY-MM-DD')
            const endDay = this.dayjs(this.form.startTime)
              .add(7 - weekDay + 7 * (i - 1) + 7, 'day')
              .format('YYYY-MM-DD')
            const week = startDay + '~' + endDay
            let obj = { name: week, count: 0 }
            column.forEach((item, index) => {
              if (this.dayjs().isBefore(this.dayjs(this.dayjs(startDay).add(columnIndex[index], 'week')))) {
                obj[item] = ''
              } else {
                obj[item] = 'N/A'
              }
              if (!meanHash[item]) meanHash[item] = false
            })
            const findIndex = data.list.findIndex(item => item.name === week)
            if (findIndex > -1) {
              obj = data.list[findIndex]
              if (thisWeek !== startDay) {
                mean.countArr.push(obj.count)
              }
              column.forEach((item, index) => {
                const addWeek = this.dayjs(this.dayjs(startDay).add(columnIndex[index], 'week'))
                const weekStatDay = this.dayjs(addWeek)
                  .startOf('w')
                  .add(1, 'day')
                  .format('YYYY-MM-DD')
                if (obj[item] || obj[item] === 0) {
                  if (this.dayjs().isBefore(addWeek)) {
                    obj[item] = ''
                  } else if (obj[item] === -1) {
                    obj[item] = '0.0%'
                  } else {
                    if (weekStatDay !== startDay && obj[item] !== -1) mean[item + 'Arr'].push(obj[item])
                    obj[item] = (obj[item] * 100).toFixed(1) + '%'
                    if (!meanHash[item]) meanHash[item] = true
                  }
                }
              })
            }
            list.push(obj)
          }
        } else if (this.form.type === 3) {
          const monthIndex = this.dayjs(this.form.endTime).month() - this.dayjs(this.form.startTime).month()
          const thisMon = this.dayjs()
            .startOf('m')
            .format('YYYY-MM')
          for (let i = 0; i <= monthIndex; i++) {
            const month = this.dayjs(this.form.startTime)
              .add(i, 'month')
              .startOf('month')
              .format('YYYY-MM')
            let obj = { name: month, count: 0 }
            column.forEach((item, index) => {
              if (this.dayjs().isBefore(this.dayjs(this.dayjs(month).add(columnIndex[index], 'month')))) {
                obj[item] = ''
              } else {
                obj[item] = 'N/A'
              }
              if (!meanHash[item]) meanHash[item] = false
            })
            const findIndex = data.list.findIndex(item => item.name === month)
            if (findIndex > -1) {
              obj = data.list[findIndex]
              if (thisMon !== month) {
                mean.countArr.push(obj.count)
              }
              column.forEach((item, index) => {
                const addMon = this.dayjs(this.dayjs(month).add(columnIndex[index], 'month'))
                if (obj[item] || obj[item] === 0) {
                  if (this.dayjs().isBefore(addMon)) {
                    obj[item] = ''
                  } else if (obj[item] === -1) {
                    obj[item] = '0.0%'
                  } else {
                    if (thisMon !== this.dayjs(addMon).format('YYYY-MM') && obj[item] !== -1) mean[item + 'Arr'].push(obj[item])
                    obj[item] = (obj[item] * 100).toFixed(1) + '%'
                    if (!meanHash[item]) meanHash[item] = true
                  }
                }
              })
            }
            list.push(obj)
          }
        }
        if (mean.countArr.length) {
          mean.count = Math.ceil(mean.countArr.reduce((acc, val) => acc + val, 0) / mean.countArr.length)
        }
        column.forEach((item, index) => {
          if (meanHash[item]) {
            const k = this.average(mean[item + 'Arr'])
            mean[item] = (k * 100).toFixed(1) + '%'
          } else {
            mean[item] = '--'
          }
        })
        this.list = list
      } catch {
        // this.list = this.getDay()
      } finally {
        this.loading = false
      }
    },
    getColumn(val) {
      const day = ['日', '周', '月']
      const index = [1, 2, 3, 4, 5, 6, 7, 14, 30]
      const dataDay = [9, 7, 6]
      const column = [
        {
          label: '日期',
          prop: 'name'
        },
        {
          label: '设备数',
          prop: 'count'
        }
      ]
      for (let i = 0; i < dataDay[val - 1]; i++) {
        const obj = {
          label: `+${index[i]}${day[val - 1]}`,
          prop: `column${i + 1}`
        }
        column.push(obj)
      }
      this.column = column
    },
    average(arr) {
      return arr.length ? arr.reduce((acc, val) => acc + val, 0) / arr.length : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.retainedAnalysis {
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
