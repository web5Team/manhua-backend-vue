<template>
    <el-dialog
      :visible.sync="dialogOpen"
      width="60%"
      :before-close="handleClose">
      <div class="dialog_titlebox">
          <span class="item_label">
              <span class="l_txt">日期：</span>
              <span class="r_txt">{{ dayStr }}</span>
          </span>
          <span class="item_label">
              <span class="l_txt">应用名称：</span>
              <span class="r_txt">{{ appName }}</span>
          </span>
      </div>
      <el-table v-loading="loading" :data="dialoglist" border>
      <el-table-column
        v-for="item in dialogColumn"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :auto-scroll="false"
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="getList"
    />
    </el-dialog>
</template>
<script>
export default {
  props: {
    dayStr: {
      type: String,
      default: ''
    },
    appName: {
      type: String,
      default: ''
    },
    appId: {
      type: Number,
      default: 0
    },
    platformId: {
      type: Number,
      default: 0
    },
    dialoglist: {
      type: Array,
      default: () => []
    },
    dialogColumn: {
      type: Array,
      default: () => []
    },
    dialogOpen: {
      type: Boolean,
      default: false
    },
    pageCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    dialogOpen(val) {
      if (val) {
        this.pageIndex = 1
        this.pageSize = 10
        this.total = this.pageCount
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogOpen', false)
    },
    getList() {
      const obj = {
        day: this.dayStr,
        appId: this.appId,
        platformId: this.platformId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.$emit('getMoreList', obj)
    }
  }
}
</script>

<style lang="scss">
.dialog_titlebox {
    margin-bottom: 20px;
    .item_label {
        margin-right: 30px;
    }
}
</style>

