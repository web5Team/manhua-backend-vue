<template>
  <div class="platFormCard">
    <el-card shadow="hover" class="box-card">
      <!-- <p class="title">
        <el-checkbox v-model="item.checked"></el-checkbox>
        <span>{{ item.name }}</span>
      </p> -->
      <el-form ref="platForm" :model="item" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input
                v-model="item.versionNumber"
                :disabled="!item.checked"
                class="basicInput"
                @input="item.versionNumber = item.versionNumber.replace(/[^\d]/g, '')"
              />
            </el-form-item>
            <el-form-item label="版本名" prop="versionName">
              <el-input
                v-model="item.versionName"
                :disabled="!item.checked"
                class="basicInput"
                @input="item.versionName = item.versionName.replace(/[^\d.]/g, '')"
              />
            </el-form-item>
            <el-form-item label="更新url" prop="upLink">
              <el-input v-model="item.upLink" :disabled="!item.checked" class="basicInput" />
            </el-form-item>
            <el-form-item label="投流账户名称" prop="investAccount">
              <el-input v-model="item.investAccount" :disabled="!item.checked" class="basicInput" />
            </el-form-item>
            <el-form-item label="过审版本名" prop="versionNameOver">
              <el-input v-model="item.versionNameOver" :disabled="!item.checked" class="basicInput" />
            </el-form-item>
            <el-form-item label="过审权限设置" prop="statusOver">
              <el-radio-group v-model="item.statusOver" :disabled="!item.checked">
                <el-radio :label="1">拒绝继续使用</el-radio>
                <el-radio :label="2">拒绝关闭应用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="item.checked" @change="selectPlatFormNow">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否强制更新" prop="forceUpdate">
              <el-radio-group v-model="item.forceUpdate" :disabled="!item.checked">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否检查更新" prop="checkUpdate">
              <el-radio-group v-model="item.checkUpdate" :disabled="!item.checked">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="上报百度ocpc" prop="ocpcStatus">
              <el-radio-group v-model="item.ocpcStatus" :disabled="!item.checked">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="debug调试模式" prop="debug">
              <el-radio-group v-model="item.debug" :disabled="!item.checked">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="更新内容" prop="updateDetails">
              <el-input v-model="item.updateDetails" :disabled="!item.checked" type="textarea" class="basicInput" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PlatFormSet',
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        versionNumber: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        versionName: [{ required: true, message: '请输入版本名', trigger: 'blur' }],
        versionNameOver: [{ required: true, message: '请输入版本名', trigger: 'blur' }]
      },
      checked: false
    }
  },
  watch: {
    'item.checked'(val) {
      if (!val) {
        this.$refs['platForm'].clearValidate()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    validateForm() {
      let isValid = false
      this.$refs['platForm'].validate((valid) => {
        isValid = valid
      })
      return isValid
    },
    selectPlatFormNow() {
      this.$emit('changePlatFormStatus', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.platFormCard {
  margin-bottom: 10px;
}
.title {
  margin: 0 0 5px;
  span {
    margin-left: 10px;
  }
}
.basicInput {
  max-width: 195px;
}
</style>
