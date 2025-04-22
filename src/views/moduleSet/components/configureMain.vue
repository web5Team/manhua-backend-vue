<template>
  <el-dialog title="编辑模板" :visible.sync="open" :before-close="handleClose" width="70%" :close-on-click-modal="false">
    <div v-if="open" v-loading="loading" class="tab">
      <el-tabs v-model="tab" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="栏目管理" name="first" v-if="firstTabShow">
          <Columncofig :edit-form="editForm" :tab-type="tab"></Columncofig>
        </el-tab-pane>
        <el-tab-pane label="栏目设置" name="second" v-if="secondTabShow">
          <Column :edit-form="editForm" :tab-type="tab" />
        </el-tab-pane>
        <el-tab-pane label="轮播图设置" name="third" v-if="thirdTabShow">
          <Carousel :edit-form="editForm" :tab-type="tab" />
        </el-tab-pane>
        <el-tab-pane label="漫画推荐设置" :disabled="!editForm.id" name="six" v-if="fourthTabShow">
          <RecommendCartoon :edit-form="editForm" :tab-type="tab" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import Carousel from './Carousel'
import Column from './Column'
import Columncofig from './columncofig'
import RecommendCartoon from './RecommendCartoon'
import { mapGetters } from 'vuex'

export default {
  name: 'ConfigureMain',
  components: {
    Carousel,
    Column,
    Columncofig,
    RecommendCartoon
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tab: 'first',
      editForm: {},
      isOpen: false,
      loading: false
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑应用' : '新增应用'
    },
    firstTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:moduleSetCofig:column' || i === '*:*:*')
      return arr.length ? true : false
    },
    secondTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:moduleSetCofig:columnSet' || i === '*:*:*')
      return arr.length ? true : false
    },
    thirdTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:moduleSetCofig:carousel' || i === '*:*:*')
      return arr.length ? true : false
    },
    fourthTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:moduleSetCofig:recom' || i === '*:*:*')
      return arr.length ? true : false
    },
    ...mapGetters({
      permisaction: "permisaction"
    })
  },
  watch: {
    open(val) {
      if (!val) return
      this.loading = false
      this.tab = 'first'
      this.editForm = this.form
    }
  },

  methods: {
    // TODO 新增/编辑
    handleClose() {
      if (this.loading) {
        this.$message.warning('接口请求中,请勿关闭')
        return
      }
      this.$emit('update:open', false)
    },
    handleClick(tab) {
      this.tab = tab.name
    }
  }
}
</script>

<style lang="scss" scope>
.root {
  overflow: hidden;
}
.tab .el-tabs--border-card {
  box-shadow: 0 0;
}
</style>
