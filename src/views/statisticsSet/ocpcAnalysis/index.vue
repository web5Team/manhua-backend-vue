<template>
  <div class="app-container memberStatistics">
    <el-card shadow="hover" class="box-card">
      <el-form ref="queryForm" :model="form" :inline="true">
        <el-form-item label="应用名称" prop="appId">
          <appNameCon :select-val.sync="form.appId" :is-clearable="false" :is-sel-first="form.appId ? false : true"></appNameCon>
        </el-form-item>
        <el-form-item label="广告渠道" prop="platformType">
          <el-select v-model="form.platformType" clearable placeholder="点击选择">
            <el-option v-for="dict in platformsNameOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接序号" prop="appType">
          <el-input
            v-model.number="form.appType"
            placeholder="请输入链接序号"
            clearable
            size="small"
            @input="() => enterNumber(form.appType, form, 'appType')"
            @keyup.enter.native="handleQuery"
          />
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
            <div class="num">{{ overview.hits }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，每日点击下载应用的总点击数量。" placement="bottom">
              <div class="name">点击数量</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.activation }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，每日首次安装并打开应用的设备数" placement="bottom">
              <div class="name">激活数量</div>
            </el-tooltip>
          </div>
        </div>

        <div class="title" style="margin-bottom:10px">
          数据趋势
          <span style="float:right;margin-right:10px">
            <i class="el-icon-download icon" @click="downloadXsls('推广统计')"></i>
            <el-tooltip class="item" effect="dark" content="所选日期内，会员平均阅读时长均值" placement="bottom">
              <template slot="content">
                <div id="u167_text" class="text">
                  <p>数据指标说明</p>
                  <p>点击数量：所选日期内，每日点击下载应用的总点击数量。</p>
                  <p>激活数量：所选日期内，每日首次安装并打开应用的设备数。</p>
                </div>
              </template>
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="点击数量" name="first">
              <Chart
                v-if="activeName === 'first'"
                name="点击数量"
                :title="registerTitle"
                :x-axis="day"
                :series-data="memberRegister"
              ></Chart>
            </el-tab-pane>
            <el-tab-pane label="激活数量" name="second">
              <Chart
                v-if="activeName === 'second'"
                id="second"
                style="width:100%"
                name="激活数量"
                :x-axis="day"
                :series-data="readingtime"
              ></Chart>
            </el-tab-pane>
            <el-tab-pane label="次日留存" name="third">
              <Chart
                v-if="activeName === 'third'"
                id="third"
                style="width:100%"
                name="次日留存"
                :x-axis="day"
                :series-data="ndayTime"
                y-type="percentage"
              ></Chart>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="title">数据详情</div>
        <DataList :list="list" :column="column"></DataList>
      </div>
    </el-card>
  </div>
</template>

<script>
import appNameCon from '@/components/AppNameCON'
import DataList from '../components/DataList'
import Chart from '../components/Chart'
import { ocpcAlysisFeach } from '@/api/statisticsApi'
import { mapState, mapMutations } from 'vuex'
import mixins from '../mixins'

export default {
  name: 'Index',
  components: { appNameCon, DataList, Chart },
  mixins: [mixins],
  data() {
    return {
      form: {
        appId: undefined,
        platformType: undefined,
        appType: undefined,
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
          label: '点击数量',
          prop: 'hits'
        },
        {
          label: '激活数量',
          prop: 'activation'
        },
        {
          label: '次日留存',
          prop: 'nday'
        }
      ],
      overview: {
        activation: 0,
        hits: 0
      },
      day: [],
      memberRegister: [],
      readingtime: [],
      ndayTime: [],
      registerTitle: '',
      platformsNameOptions: [
        {
          id: 1,
          name: '百度'
        },
        {
          id: 2,
          name: '神马'
        },
        {
          id: 3,
          name: '巨量'
        },
        {
          id: 4,
          name: '搜狗'
        }
      ],
      initAppId: '',
      tableTypeStr: ''
    }
  },
  computed: {
    ...mapState({
      ocpcAnalysisForm: state => state.statistical.ocpcAnalysisForm,
      ocpcAnalysisTime: state => state.statistical.ocpcAnalysisTime,
      ocpcAnalysisNum: state => state.statistical.ocpcAnalysisNum,
      channelList: state => state.user.channelList,
      isShowChannel: state => state.user.isShowChannel
    }),
    isChannelDefault() {
      return !this.ocpcAnalysisNum
    }
  },
  watch: {
    channelList(val) {
      if (val && !this.ocpcAnalysisNum) {
        setTimeout(() => {
          this.getMemberReadingHistory()
        }, 1)
      }
    },
    'form.appId'(val) {
      if (!this.initAppId) {
        this.initAppId = val
      }
      if (this.ocpcAnalysisNum || !this.isShowChannel) {
        if (this.getMemberReadingHistory) {
          this.getMemberReadingHistory()
        }
      }
    }
  },
  created() {
    this.timeSelectChange(this.time)
  },
  mounted() {
    this.getCacheForm()
    // if (this.extensionAnalysisNum || !this.isShowChannel) {
    //   this.getMemberReadingHistory()
    // }
    const num = 0
    console.log(num.toFixed(0))
  },
  methods: {
    ...mapMutations(['statistical/SET_RETAIEND_OCPC']),
    handleQuery() {
      if (!this.form.startTime) {
        this.$message.error('请选择时间区间')
        return
      }
      this.setcacheForm()
      this.getMemberReadingHistory()
    },
    resetQuery() {
      this.isReset = true
      this.form = {
        appId: undefined,
        platformType: undefined,
        appType: undefined,
        startTime: '',
        endTime: ''
      }
      this.time = 1
      this.timeSelectChange(this.time)
      this.setcacheForm()
      this.getMemberReadingHistory()
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
      console.log(this.ocpcAnalysisForm)
      key.forEach(item => {
        if (this.ocpcAnalysisForm[item]) {
          this.form[item] = this.ocpcAnalysisForm[item]
        }
      })
      if (this.ocpcAnalysisTime.time) this.time = this.ocpcAnalysisTime.time
      if (this.ocpcAnalysisTime.timeArr) this.value1 = this.ocpcAnalysisTime.timeArr
    },
    setcacheForm() {
      const obj = {
        ocpcAnalysisForm: this.form,
        ocpcAnalysisTime: {
          time: this.time,
          timeArr: this.value1
        }
      }
      this.$store.commit('statistical/SET_RETAIEND_OCPC', obj)
    },
    handleClick() {},
    async getMemberReadingHistory() {
      this.loading = true
      try {
        const { data } = await ocpcAlysisFeach(this.form)
        this.list = this.getDay(data.list)
        // const last = data.data[data.data.length - 1]
        this.overview = {
          hits: data.hits,
          activation: data.activation
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
        const obj = {
          day,
          hits: 0,
          activation: 0,
          nday: '0%',
          ndayNum: 0
        }
        if (data && Array.isArray(data)) {
          const findIndex = data.findIndex(item => item.date === day)
          if (findIndex > -1) {
            const item = data[findIndex]
            obj.day = day
            obj.hits = item.hits
            obj.activation = item.activation
            if (item.activation === 0) {
              obj.nday = '0%'
              obj.ndayNum = 0
            } else {
              obj.nday = ((item.nday * 100) / item.activation).toFixed(0) + '%'
              obj.ndayNum = ((item.nday * 100) / item.activation).toFixed(0)
            }
          }
        }
        list.push(obj)
      }
      // const blStr = this.activeName === 'first' ? 'hits' : this.activeName === 'second' ? 'activation' : 'nday'
      // const endDayNum = list[list.length - 1][blStr]
      const day = []
      const memberRegister = []
      const readingtime = []
      const ndayTime = []
      list.forEach(item => {
        day.push(item.day)
        memberRegister.push(item.hits)
        readingtime.push(item.activation)
        ndayTime.push(item.ndayNum)
      })
      this.day = day
      this.memberRegister = memberRegister
      this.readingtime = readingtime
      this.ndayTime = ndayTime
      // this.registerTitle = `{a|当天  }{b|${endDayNum}}`
      return list
    },
    getDays(data, str) {
      const list = []
      data.forEach(item => {
        let obj = {}
        if (str === 'hits') {
          obj = {
            id: item.id,
            hits: item.hits,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        } else if (str === 'activation') {
          obj = {
            id: item.id,
            activation: item.activation,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        } else {
          obj = {
            id: item.id,
            nday: item.nday,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        }
        list.push(obj)
      })
      return list
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
