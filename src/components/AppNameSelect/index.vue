<template>
  <el-form-item :label-width="labelWidth" label="应用名称" prop="appId">
    <el-select v-model="appId" :disabled="disabled" :clearable="isAppClearable" placeholder="点击选择" @change="appIdChange">
      <el-option v-for="dict in appIdNameOptions" :key="dict.id" :label="dict.id + ' - ' + dict.appName" :value="dict.id" />
    </el-select>
  </el-form-item>
</template>

<script>
import { listApp } from '@/api/app'

export default {
  name: 'Index',
  props: {
    // 应用名称
    appIdSelect: {
      type: [String, Number],
      default: ''
    },
    labelWidth: {
      type: [String, Number],
      default: ''
    },
    isReset: {
      type: Boolean,
      default: false
    },
    isAppClearable: {
      type: Boolean,
      default: true
    },
    appArr: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appId: '',
      appIdNameOptions: [],
      isData: false
    }
  },
  computed: {},
  watch: {
    appIdSelect(val) {
      this.appId = val || undefined
    }
  },
  created() {
    if (this.appArr.length) {
      this.appIdNameOptions = this.appArr
    } else {
      this.getAppIdNameArr()
    }
    this.appId = this.appIdSelect || undefined
  },
  methods: {
    async getAppIdNameArr() {
      const { data } = await listApp({ pageIndex: 1, pageSize: 9999, sort: 'id', order: 'ascending' })
      this.appIdNameOptions = data.list
      this.$emit('appIdArr', data.list)
    },
    appIdChange(val) {
      this.$emit('update:appIdSelect', val)
    }
  }
}
</script>

<style lang="scss">
.root {
  overflow: hidden;
}
</style>
