<template>
  <div :id="id" style="height:300px;width:100%">
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize.js'

export default {
  name: 'Chart',
  components: {},
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'id'
    },
    name: {
      type: String,
      default: ''
    },
    xAxis: {
      type: Array,
      default: () => []
    },
    seriesData: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    seriesData() {
      this.initChart()
    }
  },
  created() {},
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        legend: {
          data: ['line']
        },
        title: {
          text: this.title,
          textStyle: {
            rich: {
              a: {
                color: '#495060',
                fontSize: 12
              },
              b: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            }

          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '14%',
          left: '1%',
          right: '2%',
          bottom: '0%',
          containLabel: true
          // show: true,
          // borderWidth: '0'
          // backgroundColor: '#f3f3f3'
        },
        xAxis: {
          type: 'category',
          // splitNumber: 10,
          // boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F6F6F6'
            }
          },
          axisLabel: {
            interval: 'auto'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#8f9aa9'
            }
          },
          data: this.xAxis
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#000'
          //   }
          // },
          splitLine: { lineStyle: { color: '#F6F6F6' }},
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: this.name,
            type: 'line',
            stack: '总量',
            data: this.seriesData,
            areaStyle: {
              color: '#1295eb',
              opacity: 0.2
            },
            itemStyle: {
              color: '#1295eb'
            },
            smooth: true
          }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
