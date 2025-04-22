<template>
  <div>
    <el-row :gutter="10" class="mb10">
      <el-col :sm="24" :md="8">
        <el-card v-if="info.cpu" class="box-card">
          <div slot="header" class="clearfix">
            <span>CPU使用率</span>
          </div>
          <div class="monitor">
            <div class="monitor-header">
              <el-progress :color="$store.state.settings.theme" type="circle" :percentage="info.cpu.Percent" />
            </div>
            <div class="monitor-footer">
              <Cell label="CPU主频" :value="info.cpu.cpuInfo[0].modelName.split('@ ')[1]" border />
              <Cell label="核心数" :value="`${info.cpu.cpuNum}`" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-card v-if="info.mem" class="box-card">
          <div slot="header" class="clearfix">
            <span>内存使用率</span>
          </div>
          <div class="monitor">
            <div class="monitor-header">
              <el-progress :color="$store.state.settings.theme" type="circle" :percentage="info.mem.usage" />
            </div>
            <div class="monitor-footer">
              <Cell label="总内存" :value="info.mem.total + 'G'" border />
              <Cell label="已用内存" :value="info.mem.used + 'G'" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-card v-if="info.disk" class="box-card">
          <div slot="header" class="clearfix">
            <span>磁盘信息</span>
          </div>
          <div class="monitor">
            <div class="monitor-header">
              <el-progress :color="$store.state.settings.theme" type="circle" :percentage="info.diskrange" />
            </div>
            <div class="monitor-footer">
              <Cell label="储存空间" :value="info.disk.total + 'G'" border />
              <Cell label="已用储存" :value="info.disk.used + 'G'" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card v-if="info.os" class="box-card">
      <div slot="header" class="clearfix">
        <span>go运行环境</span>
      </div>
      <div class="monitor">
        <Cell label="GO 版本" :value="info.os.version" border />
        <Cell label="Goroutine" :value="`${info.os.numGoroutine}`" border />
        <Cell label="项目地址" :value="info.os.projectDir" />
      </div>
    </el-card>

    <el-card v-if="info.os" class="box-card" style="margin-top:10px">
      <div slot="header" class="clearfix">
        <span>服务器信息</span>
      </div>
      <div class="monitor">
        <Cell label="操作系统" :value="info.os.goOs" border />
        <Cell label="服务器IP" :value="info.os.ip" border />
        <Cell label="系统架构" :value="info.os.arch" border />
        <Cell label="CPU" :value="info.cpu.cpuInfo[0].modelName" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Cell from '@/components/Cell/index'
import { getServer } from '@/api/system'
import { checkPermissionV2 } from '@/utils/permission'

export default {
  name: 'Monitor',
  components: {
    Cell
  },
  data() {
    return {
      info: {}
    }
  },
  created() {
    if (checkPermissionV2(['monitor:server:home'])) {
      this.getServerInfo()
    }
  },
  methods: {
    getServerInfo() {
      getServer().then(ret => {
        if (ret.code === 200) {
          const used = ret.disk.used || ret.disk.free
          ret.diskrange = parseFloat(((used / ret.disk.total) * 100).toFixed(2))
          this.info = ret
          this.info.mem.usage = Number(this.info.mem.usage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor {
  .monitor-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.el-card__body {
  padding: 20px 20px 0 20px !important;
}
</style>
