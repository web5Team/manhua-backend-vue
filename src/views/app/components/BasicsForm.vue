<template>
  <div class="root">
    <el-form ref="basicsForm" :model="form" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="form.appName" />
          </el-form-item>
          <el-form-item label="安卓打包名" prop="androidPkgName">
            <el-input v-model="form.androidPkgName" />
          </el-form-item>
          <el-form-item label="包名" prop="pkgName">
            <el-input v-model="form.pkgName" />
          </el-form-item>
          <el-form-item label="apk签名" prop="apkSign">
            <el-input v-model="form.apkSign" />
          </el-form-item>
          <el-form-item label="API域名" prop="apiDomain">
            <el-input v-model="form.apiDomain" />
          </el-form-item>
          <el-form-item label="静态文件域名" prop="staticDomain">
            <el-input v-model="form.staticDomain" />
          </el-form-item>
          <el-form-item label="自研p2p信令地址" prop="signalingUrl">
            <el-input v-model="form.signalingUrl" />
          </el-form-item>
          <el-form-item label="图片域名" prop="imageDomain">
            <el-input v-model="form.imageDomain" />
          </el-form-item>
          <el-form-item label="封面图域名" prop="coverDomain">
            <el-input v-model="form.coverDomain" />
          </el-form-item>
          <el-form-item label="缓存域名" prop="cacheDomain">
            <el-input v-model="form.cacheDomain" />
          </el-form-item>
          <el-form-item label="苹果备注" prop="iosAlias">
            <el-input v-model="form.iosAlias" />
          </el-form-item>
          <el-form-item label="安卓备注" prop="androidAlias">
            <el-input v-model="form.androidAlias" />
          </el-form-item>
          <el-form-item label="安卓垃圾代码开关" prop="junkCode">
            <el-radio-group v-model="form.junkCode">
              <el-radio :label="1">打开</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="垃圾代码包名" prop="junkCodePackageName">
            <el-input v-model="form.junkCodePackageName" :disabled="form.junkCode === 2" class="basicInput" />
          </el-form-item>
          <el-form-item label="垃圾代码包数量" prop="junkCodePackageCount">
            <el-input
              v-model="form.junkCodePackageCount"
              class="basicInput"
              :disabled="form.junkCode === 2"
              @input="form.junkCodePackageCount = Number(form.junkCodePackageCount.replace(/[^\d]/g, ''))"
            />
          </el-form-item>
          <el-form-item label="垃圾代码类数量" prop="junkCodeResCount">
            <el-input
              v-model="form.junkCodeResCount"
              class="basicInput"
              :disabled="form.junkCode === 2"
              @input="form.junkCodeResCount = Number(form.junkCodeResCount.replace(/[^\d]/g, ''))"
            />
          </el-form-item>
          <el-form-item label="资源前缀" prop="junkCodeResPrefix">
            <el-input v-model="form.junkCodeResPrefix" :disabled="form.junkCode === 2" class="basicInput" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分享链接" prop="shareDownUrl">
            <el-input v-model="form.shareDownUrl" type="textarea" :rows="8" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="应用图标" prop="appIcon">
            <UploadImg
              v-model="form.appIcon"
              :show-img="false"
              :is-edit-img="isEditImg"
              :is-up-data.sync="isUpDataImg"
              :img-width="80"
              :img-height="80"
            />
          </el-form-item>
          <el-form-item label="应用启动图" prop="launcher">
            <UploadImg
              v-model="form.launcher"
              but-txt="选择文件"
              download="/static/launcher/launcher.zip"
              :is-edit-img="isEditLauncher"
              :show-img="false"
              :is-up-data.sync="isUpDataLauncher"
              accept=""
              :img-width="80"
              :img-height="80"
            />
          </el-form-item>
          <el-form-item label="服务器项目路径" prop="serverAppPath">
            <el-input v-model="form.serverAppPath" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="分支" prop="branch">
            <el-input v-model="form.branch" />
          </el-form-item>
          <el-form-item label="模板选择" prop="templateId">
            <el-select v-model="form.templateId" placeholder="请选择">
              <el-option v-for="item in templateOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="float: right" size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-dialog title="确定保存配置?" top="25vh !important" :visible.sync="open" width="40%" append-to-body center :close-on-click-modal="false">
      <el-form ref="configNameForm" :model="configNameForm" :rules="configNameRules" label-width="80px">
        <el-form-item label="配置模板" prop="configName">
          <el-input v-model="configNameForm.configName" @change="form.configName = configNameForm.configName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sava">确定</el-button>
        <el-button @click="open = false">取消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { addApp, updateApp } from '@/api/app'
import { templateListFeach } from '@/api/moduleSet'
import UploadImg from '@/components/UploadImg/appIconZip'

export default {
  name: 'BasicsForm',
  components: {
    UploadImg
  },
  props: {
    isEdit: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: false },
    editForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checkJunkCodePackageCount = (rule, value, callback) => {
      if (this.form.junkCode === 1) {
        if (!value) return callback(new Error('请输入垃圾代码包数量'))
      }
      return callback()
    }
    var checkJunkCodePackageName = (rule, value, callback) => {
      if (this.form.junkCode === 1) {
        if (!value) return callback(new Error('请输入垃圾代码包名'))
      }
      return callback()
    }
    var checkJunkCodeResCount = (rule, value, callback) => {
      if (this.form.junkCode === 1) {
        if (!value) return callback(new Error('请输入垃圾代码类数量'))
      }
      return callback()
    }
    var checkJunkCodeResPrefix = (rule, value, callback) => {
      if (this.form.junkCode === 1) {
        if (!value) return callback(new Error('请输入资源前缀'))
      }
      return callback()
    }
    return {
      form: {
        androidAlias: '',
        apiDomain: '',
        signalingUrl: '',
        apkSign: '',
        appName: '',
        cacheDomain: '',
        iosAlias: '',
        pkgName: '',
        staticDomain: '',
        imageDomain: '',
        coverDomain: '',
        shareDownUrl: '',
        junkCode: 1,
        junkCodePackageCount: 20,
        junkCodePackageName: 'com.novel.pack',
        junkCodeResCount: 50,
        junkCodeResPrefix: 'novel_',
        appIcon: '',
        launcher: '',
        serverAppPath: '',
        branch: '',
        androidPkgName: '',
        templateId: undefined
      },
      rules: {
        appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        pkgName: [{ required: true, message: '请输入包名', trigger: 'blur' }],
        serverAppPath: [{ required: true, message: '请输入服务器项目路径', trigger: 'blur' }],
        branch: [{ required: true, message: '请输入分支', trigger: 'blur' }],
        templateId: [{ required: true, message: '请选择', trigger: 'blur' }],
        junkCode: [{ required: true, message: '请选择安卓垃圾代码开关', trigger: 'blur' }],
        junkCodePackageCount: [{ required: true, validator: checkJunkCodePackageCount, trigger: 'blur' }],
        junkCodePackageName: [{ required: true, validator: checkJunkCodePackageName, trigger: 'blur' }],
        junkCodeResCount: [{ required: true, validator: checkJunkCodeResCount, trigger: 'blur' }],
        junkCodeResPrefix: [{ required: true, validator: checkJunkCodeResPrefix, trigger: 'blur' }],
        launcher: [{ required: true, message: '请选择应用启动图', trigger: 'blur' }],
        appIcon: [{ required: true, message: '请输入应用图标', trigger: 'blur' }],
        androidPkgName: [{ required: true, message: '请输入安卓打包名', trigger: 'blur' }]
      },
      nameOptions: [],
      open: false,
      configNameForm: {
        configName: ''
      },
      configNameRules: {
        configName: [{ required: true, message: '请输入配置模板', trigger: 'blur' }]
      },
      isUpDataImg: false,
      isUpDataLauncher: false,
      isEditImg: false,
      isEditLauncher: false,
      templateOptions: []
    }
  },
  watch: {
    isOpen(val) {
      if (!val) {
        this.isEditImg = false
        this.isEditLauncher = false
        return
      }
      this.reset()
      if (this.isEdit) {
        this.form = this.editForm
        this.isEditImg = true
        if (this.editForm.launcher) {
          this.isEditLauncher = true
        }
        if (!this.editForm.bookshelfType) {
          this.$set(this.form, 'bookshelfType', 1)
        }
        if (!this.editForm.commentSwitch) {
          this.$set(this.form, 'commentSwitch', 1)
        }
      }
    }
  },
  mounted() {
    // this.getConfigNameList()
    this.templateList()
    this.reset()
    if (this.isEdit) {
      this.form = this.editForm
      this.isEditImg = true
      if (this.editForm.launcher) {
        this.isEditLauncher = true
      }
      if (!this.editForm.bookshelfType) {
        this.$set(this.form, 'bookshelfType', 1)
      }
      if (!this.editForm.commentSwitch) {
        this.$set(this.form, 'commentSwitch', 1)
      }
    }
    window.mock = {
      mockAddData: this.test
    }
  },
  methods: {
    async templateList() {
      const { data } = await templateListFeach({ pageIndex: 1, pageSize: 9999, idOrder: 'descending' })
      const arr = data.list
      // arr.unshift({ id: -1, name: '不选择模板' })
      this.templateOptions = arr
    },
    // async getConfigNameList() {
    //   const { data } = await getAppTempNameList()
    //   this.nameOptions = data
    // },
    onSubmit() {
      this.$refs['basicsForm'].validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            // this.open = true
            this.sava()
          } else {
            // if (this.$store.state.user.userId !== Number(this.editForm.createBy)) {
            //   this.$message.error('不能修改非创建人的模板配置')
            //   return
            // }
            delete this.form.configEdition
            delete this.form.adSwitch
            delete this.form.thirdPartyConfig
            this.$emit('loading', true)
            updateApp(this.form)
              .then((res) => {
                const { data } = res
                if (data) {
                  this.form = data
                  this.msgSuccess('修改成功')
                  this.$emit('success', { data, type: 'edit' })
                }
              })
              .finally(() => {
                this.$emit('loading', false)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset() {
      // this.resetForm('configNameForm')
      this.resetForm('basicsForm')
      this.form = {
        androidAlias: '',
        apiDomain: '',
        signalingUrl: '',
        apkSign: '',
        appName: '',
        cacheDomain: '',
        iosAlias: '',
        pkgName: '',
        staticDomain: '',
        imageDomain: '',
        shareDownUrl: '',
        junkCode: 1,
        junkCodePackageCount: 20,
        junkCodePackageName: 'com.novel.pack',
        junkCodeResCount: 50,
        junkCodeResPrefix: 'novel_',
        appIcon: '',
        launcher: '',
        serverAppPath: '',
        branch: '',
        androidPkgName: '',
        templateId: undefined
      }
      this.isUpDataImg = true
      this.isUpDataLauncher = true
      this.form.id = undefined
    },
    sava() {
      // this.$refs['configNameForm'].validate(valid => {
      //   if (valid) {
      this.$emit('loading', true)
      const obj = JSON.parse(JSON.stringify(this.form))
      obj.versionName = '1.0.1'
      obj.versionNumber = '1'
      obj.platformId = 1
      addApp(obj)
        .then((res) => {
          // const data = res.data
          // if (data) {
          //   this.form.id = data.id
          //   this.open = false
          this.msgSuccess('新增成功')
          this.$emit('success')
          // this.$emit('success', { data, type: 'add' })
          // }
        })
        .finally(() => {
          this.$emit('loading', false)
        })
      //   }
      // })
    },
    test() {
      this.form = {
        configName: '测试配置',
        appName: '爱趣小说',
        pkgName: 'com.junyue.novel',
        apiDomain: 'http://package-api.gdjunyuekj.com',
        staticDomain: 'http://package-statics.gdjunyuekj.com',
        cacheDomain: 'http://package-statics.gdjunyuekj.com',
        bookshelfType: 1,
        commentSwitch: 1,
        shareDownUrl: 'http://package-api.gdjunyuekj.com/website/sharingDownload.html',
        appTempId: 6,
        junkCode: 1,
        junkCodePackageCount: 20,
        junkCodePackageName: 'com.novel.pack',
        junkCodeResCount: 50,
        junkCodeResPrefix: 'novel_',
        iosAlias: '',
        androidAlias: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  overflow: hidden;
}
.basicInput {
  max-width: 195px;
}
.basicsTitle {
  text-align: center;
  font-size: 18px;
  line-height: 1;
  color: #303133;
  margin-bottom: 20px;
}
</style>
