<template>
  <div :class="{ yspz_module_box: true, yspz_module_s_box: editType !== 'guide' }">
    <p>推广平台 (至少设置1个推广平台的版本)</p>
    <el-tabs type="border-card">
      <el-tab-pane v-for="item in itemArr" :key="item.id">
        <span slot="label">
          <div class="checkbox_label_box">
            <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
            <span class="mask_span"></span>
          </div>
        </span>
        <PlatFormSet :ref="`platFormSet${item.id}`" :item="item" @changePlatFormStatus="changePlatFormStatus"></PlatFormSet>
      </el-tab-pane>
    </el-tabs>
    <div style="float: right; margin-bottom: 10px; margin-top: 20px" size="large">
      <el-button v-if="editType === 'guide'" @click="prev">上一步</el-button>
      <el-button type="primary" @click="onSubmit">{{ editType === 'guide' ? '下一步' : '保存' }}</el-button>
    </div>
  </div>
</template>

<script>
import PlatFormSet from './PlatFormSet'
import { checkEditionFeach, saveEditionFeach } from '@/api/app'
import { listPlatform } from '@/api/platform'

export default {
  name: 'VersionSet',
  components: {
    PlatFormSet
  },
  props: {
    editForm: {
      type: Object,
      default: () => {}
    },
    editType: {
      type: String,
      default: ''
    },
    platformList: {
      type: Array,
      default: () => []
    },
    tapType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      itemArr: [],
      versionQueryEd: false //判断版本有没有请求过
    }
  },
  watch: {
    'editForm.id'(val) {
      this.getPlatformList()
    },
    tapType(val) {
      if (val === 'four' && !this.versionQueryEd) {
        this.versionQueryEd = true
        this.getPlatformList()
      }
    }
  },
  created() {},
  mounted() {
    // this.getPlatformList()
  },
  methods: {
    async onSubmit() {
      const submitArr = this.itemArr.filter((item) => item.checked)
      if (submitArr.length === 0) {
        this.$message.error('至少设置1个推广平台版本')
        return
      }
      const dataArr = []
      let check = true
      for (let i = 0; i < submitArr.length; i++) {
        if (!this.$refs[`platFormSet${submitArr[i].id}`][0].validateForm()) {
          check = false
          break
        } else {
          const item = submitArr[i]
          const obj = {
            platformId: item.id,
            versionNumber: item.versionNumber,
            versionName: item.versionName,
            versionNameOver: item.versionNameOver || '',
            upLink: item.upLink || '',
            forceUpdate: item.forceUpdate || 2,
            updateDetails: item.updateDetails || '',
            checkUpdate: item.checkUpdate || 2,
            debug: item.debug || 2,
            statusOver: item.statusOver || 1,
            ocpcStatus: item.ocpcStatus || 2,
            investAccount: item.investAccount || "",
          }
          dataArr.push(obj)
        }
      }

      if (!check) {
        this.$nextTick(() => {
          document.querySelector('.el-form-item__error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
        return
      }
      const formd = {
        id: this.editForm.id,
        editionDetails: dataArr
      }
      const api = this.editType === 'template' ? saveEditionFeach : ''
      if (api) {
        const res = await api(formd)
        if (res.code === 200) {
          this.$message.success('设置成功')
        }
      } else {
        const form = {
          editionDetails: dataArr,
          type: 2
        }
        this.$emit('next', form)
        this.$emit('platVersionSelect', submitArr)
      }
    },
    changePlatFormStatus(row) {
      this.itemArr.some((i) => {
        if (i.id === row.id) {
          i = row
        }
        return i.id === row.id
      })
    },
    async getPlatformList() {
      if (this.itemArr && !this.itemArr.length) {
        const { data } = await listPlatform({ pageIndex: 1, pageSize: 9999, idOrder: 'asc' })
        const arr = data.list.map((item) => {
          return {
            id: item.id,
            name: item.name,
            versionNumber: undefined,
            versionName: undefined,
            versionNameOver: undefined,
            upLink: undefined,
            forceUpdate: 2,
            updateDetails: undefined,
            checked: false,
            checkUpdate: 2,
            debug: 2,
            ocpcStatus: 2,
            statusOver: 1,
            investAccount: item.investAccount || "",
          }
        })
        this.itemArr = arr
      } else {
        this.itemArr = this.itemArr.map((item) => {
          return {
            id: item.id,
            name: item.name,
            versionNumber: undefined,
            versionName: undefined,
            versionNameOver: undefined,
            upLink: undefined,
            forceUpdate: 2,
            checkUpdate: 2,
            debug: 2,
            updateDetails: undefined,
            checked: false,
            ocpcStatus: 2,
            statusOver: 1,
            investAccount: item.investAccount || "",
          }
        })
      }
      this.getVersion()
    },
    async getVersion() {
      if (!this.editForm.id) return
      if (this.itemArr.length === 0) return
      const api = this.editType === 'template' ? checkEditionFeach : ''
      if (api) {
        const { data } = await api(this.editForm.id)
        if (!data.editionDetails) return
        data.editionDetails.forEach((item) => {
          const key = this.itemArr.findIndex((k) => k.id === item.platformId)
          if (key !== -1) {
            const obj = {
              versionNumber: item.versionNumber,
              versionName: item.versionName,
              upLink: item.upLink || '',
              forceUpdate: item.forceUpdate || 2,
              checkUpdate: item.checkUpdate || 2,
              debug: item.debug || 2,
              updateDetails: item.updateDetails || '',
              versionNameOver: item.versionNameOver || '',
              checked: true,
              statusOver: item.statusOver || 1,
              ocpcStatus: item.ocpcStatus || 2,
              investAccount: item.investAccount || "",
            }
            this.itemArr[key] = Object.assign(this.itemArr[key], obj)
          }
        })
      } else {
        if (!this.editForm.configEdition) return
        this.editForm.configEdition.forEach((item) => {
          const key = this.itemArr.findIndex((k) => k.id === item.platformId)
          if (key !== -1) {
            const obj = {
              versionNumber: item.versionNumber,
              versionName: item.versionName,
              upLink: item.upLink || '',
              forceUpdate: item.forceUpdate || 2,
              checkUpdate: item.checkUpdate || 2,
              debug: item.debug || 2,
              updateDetails: item.updateDetails || '',
              versionNameOver: item.versionNameOver || '',
              checked: true,
              ocpcStatus: item.ocpcStatus || 2,
              statusOver: item.statusOver || 1,
              investAccount: item.investAccount || "",
            }
            this.itemArr[key] = Object.assign(this.itemArr[key], obj)
          }
        })
      }
    },
    prev() {
      this.$emit('prev', 1)
    }
  }
}
</script>

<style lang="scss">
.checkbox_label_box {
  position: relative;
  .mask_span {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 6;
  }
  .el-checkbox__input {
    position: relative;
    z-index: 8;
  }
}
.yspz_module_box.yspz_module_s_box {
  .el-tabs__item.is-active {
    background: rgb(179, 216, 255) !important;
  }
}
</style>
