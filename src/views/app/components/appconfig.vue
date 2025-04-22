<template>
  <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" width="70%" :close-on-click-modal="false">
    <div v-if="open" v-loading="loading" class="tab">
      <el-tabs v-model="tab" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="first" v-if="firstTabShow">
          <BasicsForm :is-open="open" :is-edit="isEdit" :edit-form="editForm" @success="successSava" @loading="getLoading" />
        </el-tab-pane>
        <el-tab-pane label="栏目设置" :disabled="!editForm.id" name="second" v-if="secondTabShow">
          <Column :edit-form="editForm" :tap-type="tab" />
        </el-tab-pane>
        <el-tab-pane label="轮播图设置" :disabled="!editForm.id" name="third" v-if="thirdTabShow">
          <Carousel :edit-form="editForm" :tap-type="tab" />
        </el-tab-pane>
        <el-tab-pane label="版本设置" :disabled="!editForm.id" name="four" v-if="fourthTabShow">
          <VersionSet :edit-form="editForm" edit-type="template" :tap-type="tab" />
        </el-tab-pane>
        <el-tab-pane label="第三方设置" :disabled="!editForm.id" name="five" v-if="fifthTabShow">
          <ThirdPartyConfig :is-open="open" :edit-form="editForm" source-type="deployModule" :tap-type="tab" />
        </el-tab-pane>
        <el-tab-pane label="漫画推荐设置" :disabled="!editForm.id" name="six" v-if="sixthTabShow">
          <RecommendCartoon :edit-form="editForm" :tap-type="tab" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import BasicsForm from './BasicsForm'
import VersionSet from './VersionSet'
import Carousel from './Carousel'
import Column from './Column'
import ThirdPartyConfig from './ThirdPartyConfig'
import RecommendCartoon from './RecommendCartoon'
import { mapGetters } from 'vuex'

export default {
  name: 'Appconfig',
  components: {
    BasicsForm,
    VersionSet,
    ThirdPartyConfig,
    Carousel,
    Column,
    RecommendCartoon
  },
  props: {
    open: { type: Boolean, default: false },
    isEdit: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {}
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
      let arr = this.permisaction.filter(i => i === 'admin:appConfig:basics' || i === '*:*:*')
      return arr.length ? true : false
    },
    secondTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:appConfig:column' || i === '*:*:*')
      return arr.length ? true : false
    },
    thirdTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:appConfig:carousel' || i === '*:*:*')
      return arr.length ? true : false
    },
    fourthTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:appConfig:version' || i === '*:*:*')
      return arr.length ? true : false
    },
    fifthTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:appConfig:thirdParty' || i === '*:*:*')
      return arr.length ? true : false
    },
    sixthTabShow() {
      let arr = this.permisaction.filter(i => i === 'admin:appConfig:reco' || i === '*:*:*')
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
      this.editForm = {}
      if (this.isEdit) {
        this.editForm = this.form
      }
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
    handleClick(tab) {},
    tip() {
      if (this.editForm.id) return
      this.$message({
        message: '你需要保存基础设置才能访问',
        type: 'warning'
      })
    },
    successSava(val) {
      // if (val.type === 'add') {
      //   this.editForm = val.data
      // }
      // this.$emit('success', val)
      this.$emit('success')
    },
    getLoading(val) {
      this.loading = val
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
