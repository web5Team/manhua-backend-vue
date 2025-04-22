<template>
    <div>
        <el-select v-model="appId" placeholder="点击选择" :clearable="isClearable" :disabled="isDisabled" size="small" @change="handleSelect">
          <el-option v-for="dict in appNameOptions" :key="dict.id" :label="dict.id + '-' + dict.appName" :value="dict.id" />
        </el-select>
    </div>
</template>

<script>
import { listApp } from '@/api/app'

export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: true
    },
    isSelFirst: {
      type: Boolean,
      default: false
    },
    selectVal: {
      type: [String, Number],
      default: undefined
    },
    isAllName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appNameOptions: [],
      appId: undefined
    }
  },
  watch: {
    selectVal(val) {
      this.appId = val
      const obj = this.appNameOptions.filter(i => i.id === val)
      if (obj && obj.length) {
        this.$emit('selectAppName', obj[0].appName)
      }
    }
  },
  created() {
    this.getAppnameList()
    this.appId = this.selectVal
  },
  methods: {
    async getAppnameList() {
      const { data } = await listApp({ pageIndex: 1, pageSize: 9999, sort: 'id', order: 'ascending' })
      if (this.isAllName) { // 加个全部的名称
        const obj = {
          id: 0,
          appName: '全部'
        }
        this.appNameOptions = [obj, ...data.list]
      } else {
        this.appNameOptions = data.list
      }
      const id = this.appNameOptions.length ? this.appNameOptions[0].id : ''
      if (this.isSelFirst) {
        this.$emit('update:selectVal', id)
      }
      // this.$emit('selectAppId', id)
    },
    handleSelect(val) {
      this.$emit('update:selectVal', val)
    }
  }
}
</script>
