<template>
  <el-dialog
    class="el_dialog"
    destroy-on-close
    :style="{ height }"
    :title="title"
    :width="width"
    :height="height"
    v-if="show"
    :visible="show"
    @close="close"
    v-bind="$attrs"
    v-on="$listeners">
    <div class="content">
      <el-form ref="form" :model="cartoonParams" :inline="true" label-width="68px">
        <el-form-item label="漫画名称" prop="name">
          <el-input v-model="cartoonParams.name" placeholder="请输入漫画名" clearable size="small" @keyup.enter.native="query" />
        </el-form-item>
        <el-form-item label="采集规则" prop="ruleId">
          <el-select v-model="cartoonParams.ruleId" clearable placeholder="请选择">
            <el-option v-for="dict in ruleList" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query">查询</el-button>
          <el-button type="primary" size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table_view">
        <el-table
          class="cartoon_table"
          v-loading="cartoonLoading"
          border
          height="250"
          :data="cartoonList"
          highlight-current-row
          @current-change="currentChange"
          @sort-change="handleSortChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column width="55" align="center">
            <template #default="{ row }">
              <el-radio v-model="radio" :label="row.sourceId"></el-radio>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" width="150" label="源站漫画id" align="center" prop="sourceId" :show-overflow-tooltip="true" />
          <el-table-column label="漫画名" width="180" align="center" prop="name" />
          <el-table-column label="作者" width="180" align="center" prop="author" />
          <!-- <el-table-column width="120" label="漫画别名" align="center" prop="aliasName" />
          <el-table-column width="120" label="作者" align="center" prop="author" />
          <el-table-column width="120" label="作者别名" align="center" prop="aliasAuthor" /> -->
        </el-table>
        <pagination
          v-show="cartoonPageOptions.total > 0"
          :total="cartoonPageOptions.total"
          :page.sync="cartoonPageOptions.pageIndex"
          :limit.sync="cartoonPageOptions.pageSize"
          @pagination="getOriginCartoonList"
        />
      </div>
      <div class="table_view">
        <el-table
          class="chapter_table"
          v-loading="chapterLoading"
          border
          :data="chapterList"
          @selection-change="handleChapterSelectionChange"
          @sort-change="handleSortChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column type="index" width="55" align="center" label="序号" />
          <el-table-column label="章节id" align="center" prop="chapterId" :show-overflow-tooltip="true" />
          <el-table-column label="章节名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="采集规则名称" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.ruleId | arrFilter(['id', 'name'], ruleList) }}</span>
            </template>
          </el-table-column> -->
        </el-table>
        <pagination
          v-show="chapterPageOptions.total > 0"
          :total="chapterPageOptions.total"
          :page.sync="chapterPageOptions.pageIndex"
          :limit.sync="chapterPageOptions.pageSize"
          @pagination="getOriginChapterList"
        />
      </div>
      <el-row style="text-align: right">
        <el-button type="primary" plain size="mini" @click="close">取消</el-button>
        <el-button type="primary" size="mini" @click="submit">确定</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { getOriginCartoonList, getOriginChapterList, batchAddCartoon, } from "@/api/cartoon";
export default {
  props: {
    show: Boolean,
    title: String,
    width: {
      type: String,
      default: "60%",
    },
    height: {
      type: String,
      default: "80vh",
    },
    ruleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      radio: "",
      dateRange: [],
      cartoonLoading: false,
      cartoonList: [],
      cartoonParams: {
        name: '',
        ruleId: '',
      },
      cartoonPageOptions: {
        pageIndex: 1,
        pageSize: 10000,
        total: 0,
      },
      chapterLoading: false,
      chapterList: [],
      chapterParams: {
        sourceId: '',
        ruleId: '',
      },
      chapterPageOptions: {
        pageIndex: 1,
        pageSize: 10000,
        total: 0,
      },
    }
  },
  methods: {
    close() {
      this.$emit("update:show", false);
      this.$emit("close");
    },
    reset() {
      this.resetForm('form');
      this.query();
    },
    query() {
      console.log("query", this.formData);
      this.cartoonPageOptions.pageIndex = 1;
      this.cartoonList = [];
      this.chapterList = [];
      this.$refs.form.validate(valid => {
        !!valid && this.getOriginCartoonList();
      });
    },
    getOriginCartoonList() {
      this.cartoonLoading = true;
      const pageOption = JSON.parse(JSON.stringify(this.cartoonPageOptions));
      delete pageOption.total;
      getOriginCartoonList(this.addDateRange({
        ...this.cartoonParams,
        ...pageOption,
      }, this.dateRange)).then(res => {
        this.cartoonList = res?.data?.list || [];
        this.cartoonPageOptions.total = res?.data?.count || 0;
        this.cartoonLoading = false;
      }).catch(e => this.cartoonLoading = false);
    },
    getOriginChapterList() {
      this.chapterLoading = true;
      const pageOption = JSON.parse(JSON.stringify(this.cartoonPageOptions));
      delete pageOption.total;
      getOriginChapterList({
        ...this.chapterParams,
        ruleId: this.cartoonParams.ruleId,
        ...pageOption,
      }).then(res => {
        this.chapterList = res?.data?.list || [];
        this.chapterPageOptions.total = res?.data?.count || 0;
        this.chapterLoading = false
      }).catch(e => this.chapterLoading = false);
    },
    currentChange(v = {}) {
      console.log("currentChange", v);
      this.radio = v.sourceId || "";
      this.chapterParams.sourceId = v.sourceId || "";
      this.chapterParams.sourceId && this.getOriginChapterList();
    },
    handleCartoonSelectionChange(v = []) {
      console.log("handleCartoonSelectionChange", v);
      const ids = v.map(item => item.sourceId);
      if (!ids.length) {
        this.chapterList = [];
        return ;
      }
      this.chapterParams.sourceId = ids[0];
      this.getOriginChapterList();
    },
    handleChapterSelectionChange() {
      console.log("handleChapterSelectionChange");
    },
    handleSortChange() {
      console.log("handleSortChange");
    },
    submit() {
      console.log("submit");
      batchAddCartoon({
        sourceId: String(this.chapterParams.sourceId || ""),
        ruleId: this.cartoonParams.ruleId || "",
      }).then(res => {
        console.log("batchAddCartoon", res);
        this.msgSuccess(res.msg  || "");
      }).catch(console.log);
    },
  },
  mounted() {
    window.vm = this;
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0px 20px 20px 20px;
}
.table_view {
  height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  .cartoon_table, .chapter_table{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    ::v-deep .el-table__body-wrapper {
      flex: 1;
      height: 100%;
      overflow: auto;
    }
  }
}
::v-deep .el-radio__original {
  display: none !important; /* 隐藏原生 radio 输入，但仍然允许交互 */
}
::v-deep.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none !important;
}
::v-deep .el-radio > .el-radio__label {
  display: none !important;
}
</style>