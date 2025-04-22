<template>
  <div class="app-container memberStatistics">
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
        <h1>会员统计</h1>
        <div class="box">
          <div class="col">
            <div class="num">{{ overview.totalRegister }}</div>
            <el-tooltip class="item" effect="dark" content="所选日期内，注册的会员数" placement="bottom">
              <div class="name">注册会员</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.lastThreeRegister }}</div>
            <el-tooltip class="item" effect="dark" content="从所选的结束日期起，最近3天（不含结束日期）注册的会员数" placement="bottom">
              <div class="name">近3天注册会员</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.lastSevenRegister }}</div>
            <el-tooltip class="item" effect="dark" content="从所选的结束日期起，最近7天（不含结束日期）注册的会员数" placement="bottom">
              <div class="name">近7天注册会员</div>
            </el-tooltip>
          </div>
          <div class="col">
            <div class="num">{{ overview.lastThirtyRegister }}</div>
            <el-tooltip class="item" effect="dark" content="从所选的结束日期起，最近30天（不含结束日期）注册的会员数" placement="bottom">
              <div class="name">近30天注册会员</div>
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
            <i class="el-icon-download icon" @click="downloadXsls('会员统计')"></i>
            <el-tooltip class="item" effect="dark" content="所选日期内，会员平均阅读时长均值" placement="bottom">
              <template slot="content">
                <div id="u167_text" class="text">
                  <p>数据指标说明</p>
                  <p>注册会员: 所选日期内，用户已在登录页面注册成为会员的数量。</p>
                  <!-- <p>会员阅读时长: 所选日期内，从进行过阅读的会员里面，累计的阅读时长均值。图表值单位为“秒”</p> -->
                  <p>近3天注册会员: 按所选时段的结束日期，最近3天（不含当日的前3天）注册会员数。</p>
                  <p>近7天注册会员: 按所选时段的结束日期，最近7天（不含当日的前7天）注册会员数。</p>
                  <p>近30天注册会员: 按所选时段的结束日期，最近30天（不含当日的前30天）注册会员数</p>
                </div>
              </template>
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="注册会员" name="first">
              <Chart
                v-if="activeName === 'first'"
                name="注册会员"
                :title="registerTitle"
                :x-axis="day"
                :series-data="memberRegister"
              ></Chart>
            </el-tab-pane>
            <!-- <el-tab-pane label="阅读时长" name="second">
              <Chart
                v-if="activeName === 'second'"
                id="second"
                style="width:100%"
                name="阅读时长"
                :x-axis="day"
                :series-data="readingtime"
              ></Chart>
            </el-tab-pane> -->
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
import { memberStatistics } from '@/api/statisticsApi'
import { mapState, mapMutations } from 'vuex'
import mixins from '../mixins'
import { secondToDate } from '@/utils'

export default {
  name: 'Index',
  components: { appNameCon, DataList, Chart },
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
        }
        // {
        //   label: '会员阅读时长',
        //   prop: 'secondReading'
        // }
      ],
      overview: {
        totalRegister: 0,
        lastThreeRegister: 0,
        lastSevenRegister: 0,
        lastThirtyRegister: 0,
        shareNum: 0,
        installNum: 0,
        totalAvarageReadingtime: secondToDate(0)
      },
      day: [],
      memberRegister: [],
      readingtime: [],
      registerTitle: '',
      platformsNameOptions: []
    }
  },
  computed: {
    ...mapState({
      memberStatisticsForm: state => state.statistical.memberStatisticsForm,
      memberStatisticsTime: state => state.statistical.memberStatisticsTime,
      toMemberStatisticsNum: state => state.statistical.toMemberStatisticsNum,
      channelList: state => state.user.channelList,
      isShowChannel: state => state.user.isShowChannel
    }),
    isChannelDefault() {
      return !this.toMemberStatisticsNum
    }
  },
  watch: {
    channelList(val) {
      if (val && !this.toMemberStatisticsNum) {
        setTimeout(() => {
          this.getMemberReadingHistory()
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
    // if (this.toMemberStatisticsNum || !this.isShowChannel) {
    //   this.getMemberReadingHistory()
    // }
  },
  methods: {
    ...mapMutations(['statistical/SET_MEMBER_STATISTICS']),
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
        platformId: undefined,
        startTime: '',
        endTime: ''
      }
      this.time = 1
      this.timeSelectChange(this.time)
      this.setcacheForm()
      this.getMemberReadingHistory()
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
        if (this.memberStatisticsForm[item]) {
          this.form[item] = this.memberStatisticsForm[item]
        }
      })
      if (this.memberStatisticsTime.time) this.time = this.memberStatisticsTime.time
      if (this.memberStatisticsTime.timeArr) this.value1 = this.memberStatisticsTime.timeArr
    },
    setcacheForm() {
      const obj = {
        memberStatisticsForm: this.form,
        memberStatisticsTime: {
          time: this.time,
          timeArr: this.value1
        }
      }
      this.$store.commit('statistical/SET_MEMBER_STATISTICS', obj)
    },
    handleClick() {},
    async getMemberReadingHistory() {
      this.loading = true
      try {
        const { data } = await memberStatistics(this.form)
        this.list = this.getDay(data.data)
        // const last = data.data[data.data.length - 1]
        this.overview = {
          totalRegister: data.totalRegister,
          lastThreeRegister: data.lastThreeRegister,
          lastSevenRegister: data.lastSevenRegister,
          lastThirtyRegister: data.lastThirtyRegister,
          shareNum: data.shareNum || 0,
          installNum: data.installNum || 0,
          totalAvarageReadingtime: secondToDate(data.totalAvarageReadingtime)
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
          registerNumber: 0,
          lastThreeRegister: 0,
          lastSevenRegister: 0,
          lastThirtyRegister: 0,
          avarageReadingtime: 0,
          secondReading: secondToDate(0)
        }
        if (data && Array.isArray(data)) {
          const findIndex = data.findIndex(item => item.day === day)
          if (findIndex > -1) {
            const item = data[findIndex]
            obj = {
              day,
              registerNumber: item.registerNumber,
              lastThreeRegister: item.lastThreeRegister,
              lastSevenRegister: item.lastSevenRegister,
              lastThirtyRegister: item.lastThirtyRegister,
              avarageReadingtime: item.avarageReadingtime,
              secondReading: secondToDate(item.avarageReadingtime)
            }
          }
        }
        list.push(obj)
      }
      const endDayNum = list[list.length - 1].registerNumber
      const day = []
      const memberRegister = []
      const readingtime = []
      list.forEach(item => {
        day.push(item.day)
        memberRegister.push(item.registerNumber)
        readingtime.push(item.avarageReadingtime)
      })
      this.day = day
      this.memberRegister = memberRegister
      this.readingtime = readingtime
      this.registerTitle = `{a|当天  }{b|${endDayNum}}`
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
