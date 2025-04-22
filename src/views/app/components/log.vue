<template>
  <div class="managerLog">
    <el-dialog title="日志" :visible.sync="open" :before-close="handleClose" width="60%" :close-on-click-modal="false">
      <div id="data-list-content" ref="container" class="log">
        <p>正在构建,请稍等</p>
        <p v-for="(item, index) in log" :key="index">{{ item }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkCreatStatusFeach } from '@/api/app'

export default {
  name: 'Log',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    },
    isOpenLog: {
      type: Boolean,
      default: false
    },
    logStatus: {
      type: [String, Number],
      default: 2
    }
  },
  data() {
    return {
      log: [],
      time: null,
      loading: false
    }
  },
  watch: {
    id(val) {
      if (val && !this.loading) {
        this.getLog()
      }
    },
    open(val) {
      if (val) {
        this.log = []
        this.time = null
        if (!this.loading) {
          this.getLog()
        }
      } else {
        clearInterval(this.time)
        this.log = []
      }
    }
  },
  mounted() {
    if (this.id && !this.loading) this.getLog()
  },
  methods: {
    handleClose() {
      this.loading = false
      clearInterval(this.time)
      this.$emit('update:open', false)
    },
    async getLog() {
      clearInterval(this.time)
      this.loading = true
      try {
        const { data } = await checkCreatStatusFeach(this.id)
        if (data.status === 4) {
          this.log = [`生成应用排队中,还剩余${data.logContent[0]}个应用`]
          this.time = setInterval(() => {
            this.getLog()
          }, 20000)
        } else {
          this.log = data.logContent
        }
        this.scrollToBottom()
        if (data.status === 1 || data.status === 0) {
          this.time = setInterval(() => {
            this.getLog()
          }, 20000)
        } else if (data.status === 2) {
          if (!this.isOpenLog || this.logStatus === 1) {
            this.$emit('updataList', 'success')
            this.$message.success('应用构建成功')
          }
          this.log.push('应用构建成功')
          clearInterval(this.time)
        } else if (data.status === 3) {
          if (!this.isOpenLog || this.logStatus === 1) {
            this.$emit('updataList', 'error')
            this.$message.error('应用构建失败')
          }
          this.log.push('应用构建失败')
          clearInterval(this.time)
        }
        this.loading = false
      } catch {
        clearInterval(this.time)
        this.time = setInterval(() => {
          this.getLog()
        }, 20000)
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const div = document.getElementById('data-list-content')
        div.scrollTo({ top: div.scrollHeight, behavior: 'smooth' })
      })
    }
  }
}
</script>

<style lang="scss" scope>
.managerLog {
  overflow: hidden;
  .log {
    margin: 10px 0;
    padding: 5px 10px;
    overflow: auto;
    height: 500px;
    background: #002728;
    color: #fff;

    p {
      font-weight: bold;
      line-height: 16px;
      font-size: 14px;
    }
  }
}
</style>
