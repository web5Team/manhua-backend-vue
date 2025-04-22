<template>
  <el-select v-model="idsArr" multiple placeholder="请选择" @change="changeSelect">
    <el-checkbox v-model="checked" class="allCheck" @change="selectAll">全选</el-checkbox>
    <el-option v-for="dict in selectArr" :key="dict[value]" :label="dict[label]" :value="dict[value]" />
  </el-select>
</template>

<script>
export default {
  name: 'MultipleSelect',
  model: {
    prop: 'ids',
    event: 'change'
  },
  props: {
    selectArr: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: 'name'
    },
    value: {
      type: String,
      default: 'id'
    },
    ids: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      idsArr: [],
      checked: false
    }
  },
  computed: {},
  watch: {
    ids(val) {
      this.updateIds(val)
    }
  },
  mounted() {
    if (this.ids) {
      this.updateIds(this.ids)
    }
  },
  methods: {
    changeSelect(val) {
      this.checked = val.length === this.selectArr.length
      const ids = val.sort((a, b) => a - b).join(',')
      this.$emit('change', ids)
    },
    selectAll(val) {
      if (val) {
        // 全选
        if (this.idsArr.length !== this.selectArr.length) {
          this.idsArr = this.selectArr.map(item => {
            return item[this.value]
          })
        }
      } else {
        this.idsArr = []
      }
      this.changeSelect(this.idsArr)
    },
    updateIds(val) {
      this.idsArr = val ? val.split(',').map(item => Number(item)) : []
      this.checked = this.idsArr.length === this.selectArr.length
    }
  }
}
</script>

<style lang="scss" scoped>
.allCheck {
  text-align: right;
  width: 100%;
  padding-right: 10px;
}
</style>
