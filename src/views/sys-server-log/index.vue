<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="70px">
      <el-row>
        <el-col :span="8" />
        <el-col :span="8">
          <el-form-item label="选择日期" prop="status">
            <el-date-picker
              v-model="date"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" icon="el-icon-bottom" size="mini" style="margin-bottom: 10px;" @click="dowload">下载</el-button>
    </el-form>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark" style="background: #000;color: #fff;overflow-x:scroll"><pre>{{ centent }}</pre></div></el-col>
    </el-row>
  </div>
</template>

<script>
import { getServerLog } from '@/api/sys-server-log'

export default {
  name: 'Config',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      // 弹出层标题
      queryParams: {
        date: undefined
      },
      pickerOptions: '',
      date: undefined,
      centent: ''
      // 表单参数
    }
  },
  created() {
    this.date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0') + '-' + new Date().getDate().toString().padStart(2, '0')
    this.loading = true
    this.getData()
  },
  methods: {
    resetQuery() {
      this.date = undefined
    },
    getData() {
      getServerLog(this.date).then(
        (response) => {
          this.centent = response.data
          this.loading = false
        }
      )
    },
    dowload() {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.centent))
      element.setAttribute('download', this.date + '.log')
      element.style.display = 'none'
      element.click()
    },
    handleQuery() {
      var d = new Date(this.date)
      this.date = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0')
      this.getData()
    }
  }
}
</script>
