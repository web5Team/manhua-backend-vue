<template>
  <el-table v-loading="loading" border :data="list" @selection-change="handleSelectionChange" @sort-change="sortChange">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
    <el-table-column label="漫画名称" fixed align="center" width="160" prop="name" :show-overflow-tooltip="true" />
    <el-table-column label="作者" align="center" width="130" prop="author" />
    <el-table-column label="别名" align="center" width="130" prop="aliasName" />
    <el-table-column label="分类" align="center" width="100" prop="categoryName" />
    <el-table-column label="漫画拼音" align="center" width="100" prop="pinyin" />
    <el-table-column label="主角" align="center" width="100" prop="protagonist" />
    <el-table-column label="状态" align="center" width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.isEnd | arrFilter(['value', 'label'], cartoonOptions) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="热度" align="center" width="100" prop="heat" sortable="custom" />
    <el-table-column label="评分" align="center" width="100" prop="score" sortable="custom" />
    <el-table-column label="昨日浏览量" align="center" width="130" prop="yesterday" sortable="custom" />
    <el-table-column label="前7天浏览量" align="center" width="130" prop="lastWeek" sortable="custom" />
    <el-table-column label="前30天浏览量" align="center" width="135" prop="lastMonth" sortable="custom" />
    <el-table-column label="状态" align="center" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        <span>{{ scope.row.status | arrFilter(['value', 'label'], statusSelect) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" prop="createdAt" :show-overflow-tooltip="true" width="180" sortable="custom">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.createdAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="更新时间" align="center" prop="updatedAt" :show-overflow-tooltip="true" width="180" sortable="custom">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.updatedAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="showOperation" fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="150">
      <template slot-scope="scope">
        <slot :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { checkPermissionV2 } from '@/utils/permission'

export default {
  name: 'DataList',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    categoryList: {
      type: Array,
      default: () => []
    },
    recommendList: {
      type: Array,
      default: () => []
    },
    showOperation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusSelect: [{ value: 1, label: '启用' }, { value: 2, label: '禁用' }],
      cartoonOptions: [{ value: 1, label: '已完结' }, { value: 2, label: '未完结' }]
    }
  },
  computed: {
    checkPermission() {
      return checkPermissionV2(['system:rule:list'])
    }
  },
  created() {

  },
  mounted() {},
  methods: {
    handleSelectionChange(selection) {
      this.$emit('selectionChange', selection)
    },
    sortChange(data) {
      this.$emit('sortChange', data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
