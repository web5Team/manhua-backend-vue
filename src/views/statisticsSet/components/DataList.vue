<template>
  <div>
    <el-table v-loading="loading" :data="dataList" border>
      <el-table-column
        v-for="item in column"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column v-if="haveOperation" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleBtnClick('add', scope.row)">新增明细</el-button>
          <el-button type="primary" size="mini" @click="handleBtnClick('active', scope.row)">活跃明细</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="haveOperationYq" label="操作" align="center">
        <template v-if="scope.row.day !== today" slot-scope="scope">
          <el-button type="primary" size="mini" @click="btnClickCZ('shareCount', scope.row)">邀请人详情</el-button>
          <el-button type="primary" size="mini" @click="btnClickCZ('inviteCount', scope.row)">被邀请人详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :auto-scroll="false"
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
export default {
  name: 'DataList',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    },
    column: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    haveOperation: {
      type: Boolean,
      default: false
    },
    haveOperationYq: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      dataList: [],
      today: ''
    }
  },
  watch: {
    list(val) {
      this.total = val.length
      this.pageIndex = 1
      this.getList()
    }
  },
  created() {
    const date = new Date()
    this.today = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`
  },
  mounted() {},
  methods: {
    getList() {
      this.dataList = this.list.filter((item, index) =>
        index < this.pageIndex * this.pageSize && index >= this.pageSize * (this.pageIndex - 1)
      )
    },
    handleBtnClick(str, row) {
      const obj = { ...row, str: str }
      this.$emit('handleBtnClick', obj)
    },
    btnClickCZ(str, row) {
      const obj = {
        day: row.day,
        str: str
      }
      this.$emit('btnClickCZ', obj)
    }
  }
}
</script>

<style lang="scss" scoped></style>
