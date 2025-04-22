import { formatJson } from '@/utils'
import { listPlatform } from '@/api/platform'

export default {
  data() {
    return {
      timeSelect: [
        { value: 1, label: '最近3天' },
        { value: 2, label: '最近7天' },
        { value: 3, label: '最近30天' },
        { value: 4, label: '自定义' }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: time => {
          const curDate = new Date().getTime()
          const three = 3600 * 1000 * 24 * 90
          const threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      },
      platFormSelect: []
    }
  },
  created() {
    // this.getPlatformList()
  },
  beforeDestroy() {
  },
  methods: {
    async getPlatformList() {
      const { data } = await listPlatform({ pageIndex: 1, pageSize: 9999, idOrder: 'asc' })
      this.platformsNameOptions = data.list
      if (!this.form.platformId) {
        const id = data.list.length ? data.list[0].id : undefined
        this.form.platformId = id
      }
      if (this.appOverviewNum || !this.isShowChannel) {
        if (this.getAppOverview) {
          this.getAppOverview()
        }
      }
      if (this.extensionAnalysisNum || !this.isShowChannel) {
        if (this.getExtensionHistory) {
          this.getExtensionHistory()
        }
      }
      if (this.toMemberStatisticsNum || !this.isShowChannel) {
        if (this.getMemberReadingHistory) {
          this.getMemberReadingHistory()
        }
      }
      if (this.getKeepanalysisList) {
        this.getKeepanalysisList()
      }
    },
    timeSelectChange(val) {
      const todayEnd = this.dayjs().format('YYYY-MM-DD')
      switch (val) {
        case 1:
          this.form.startTime = this.dayjs()
            .subtract(2, 'day')
            .format('YYYY-MM-DD')
          this.form.endTime = todayEnd
          break
        case 2:
          this.form.startTime = this.dayjs()
            .subtract(6, 'day')
            .format('YYYY-MM-DD')
          this.form.endTime = todayEnd
          break
        case 3:
          this.form.startTime = this.dayjs()
            .subtract(29, 'day')
            .format('YYYY-MM-DD')
          this.form.endTime = todayEnd
          break
        case 4:
          this.form.startTime = ''
          this.form.endTime = ''
          this.value1 = ''
          break
      }
    },
    downloadXsls(name) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.column.map(item => { return item.label })
        const filterVal = this.column.map(item => { return item.prop })
        const list = name !== '留存分析' ? this.list : this.list.filter(item => item.name !== '均值')
        const data = formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `${name}_${this.form.startTime}_${this.form.endTime}`,
          autoWidth: name !== '留存分析', // Optional
          bookType: 'xlsx' // Optional
        })
        this.downloadLoading = false
      }).catch(() => {
        this.$message.error('导出失败,请重试')
      })
    }
  }
}
