<template>
  <div class="root">
    <el-form ref="basicsForm" :model="form" :rules="rules" label-width="170px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="talkingdata统计app id" prop="thirdPartyConfig.talkingdataAppId">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-select v-model="talkingItem.platformId" placeholder="点击选择">
                  <el-option v-for="dict in platFormSelect" :key="dict.id" :label="dict.name" :value="dict.id" />
                </el-select>
              </el-col>
              <el-col :span="11">
                <el-input v-model="talkingItem.talkingdataAppId" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="友盟统计id" prop="thirdPartyConfig.youmengAppId">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-select v-model="youmengItem.platformId" placeholder="点击选择">
                  <el-option v-for="dict in platFormSelect" :key="dict.id" :label="dict.name" :value="dict.id" />
                </el-select>
              </el-col>
              <el-col :span="11">
                <el-input v-model="youmengItem.youmengAppId" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="安卓极光推送app key" prop="thirdPartyConfig.jiguangAppKey">
            <el-input v-model="form.thirdPartyConfig.jiguangAppKey" />
          </el-form-item>
          <el-form-item label="安卓极光推送secret" prop="thirdPartyConfig.jiguangSecret">
            <el-input v-model="form.thirdPartyConfig.jiguangSecret" />
          </el-form-item>
          <el-form-item label="ios极光推送app key" prop="thirdPartyConfig.iosJiguangAppKey">
            <el-input v-model="form.thirdPartyConfig.iosJiguangAppKey" />
          </el-form-item>
          <el-form-item label="ios极光推送secret" prop="thirdPartyConfig.iosJiguangSecret">
            <el-input v-model="form.thirdPartyConfig.iosJiguangSecret" />
          </el-form-item>
          <!-- <el-form-item label="安卓OCPC id" prop="thirdPartyConfig.androidOcpcId">
            <el-input v-model="form.thirdPartyConfig.androidOcpcId" type="textarea" :rows="3" />
          </el-form-item> -->
          <el-form-item label="安卓OCPC密钥" prop="thirdPartyConfig.androidOcpcKey">
            <!-- <el-input v-model="form.thirdPartyConfig.androidOcpcKey" type="textarea" :rows="3" /> -->
            <RowTextarea id="androidOpckey" v-model="form.thirdPartyConfig.androidOcpcKey"></RowTextarea>
          </el-form-item>
          <!-- <el-form-item label="苹果OCPC id" prop="thirdPartyConfig.iosOcpcId">
            <el-input v-model="form.thirdPartyConfig.iosOcpcId" type="textarea" :rows="3" />
          </el-form-item> -->
          <el-form-item label="苹果OCPC 密钥" prop="thirdPartyConfig.iosOcpcKey">
            <!-- <el-input v-model="form.thirdPartyConfig.iosOcpcKey" type="textarea" :rows="3" /> -->
            <RowTextarea id="iosOpckey" v-model="form.thirdPartyConfig.iosOcpcKey"></RowTextarea>
          </el-form-item>
          <el-form-item label="安卓搜狗OCPC密钥" prop="thirdPartyConfig.androidSougouOcpcKey">
            <RowTextarea id="androidSGOpckey" v-model="form.thirdPartyConfig.androidSougouOcpcKey"></RowTextarea>
          </el-form-item>
          <el-form-item label="苹果搜狗OCPC 密钥" prop="thirdPartyConfig.iosSougouOcpcKey">
            <RowTextarea id="iosSGOpckey" v-model="form.thirdPartyConfig.iosSougouOcpcKey"></RowTextarea>
          </el-form-item>
          <el-form-item label="P2P key" prop="thirdPartyConfig.p2ptoken">
            <el-input v-model="form.thirdPartyConfig.p2ptoken" />
          </el-form-item>
          <el-form-item label="安卓P2P开关" prop="thirdPartyConfig.p2pswitch">
            <el-radio-group v-model="form.thirdPartyConfig.p2pswitch">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="苹果P2P开关" prop="thirdPartyConfig.p2pswitchios">
            <el-radio-group v-model="form.thirdPartyConfig.p2pswitchios">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="苹果分享开关" prop="thirdPartyConfig.iosShareSwitch">
            <el-radio-group v-model="form.thirdPartyConfig.iosShareSwitch">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-card header="阿里云短信平台" shadow="never">
            <el-form-item label="阿里短信访问密钥ID" prop="thirdPartyConfig.aliDuanxinId">
              <el-input v-model="form.thirdPartyConfig.aliDuanxinId" />
            </el-form-item>
            <el-form-item label="阿里短信访问密钥" prop="thirdPartyConfig.aliDuanxinKey">
              <el-input v-model="form.thirdPartyConfig.aliDuanxinKey" />
            </el-form-item>
            <el-form-item label="阿里短信签名" prop="thirdPartyConfig.aliDuanxinSign">
              <el-input v-model="form.thirdPartyConfig.aliDuanxinSign" />
            </el-form-item>
            <el-form-item label="阿里短信验证码模板ID" prop="thirdPartyConfig.aliDuanxinTemid">
              <el-input v-model="form.thirdPartyConfig.aliDuanxinTemid" />
            </el-form-item>
          </el-card>
          <el-card header="阿里云一键登录" shadow="never">
            <el-form-item label="节点名region id" prop="thirdPartyConfig.aliRegionIdName">
              <el-input v-model="form.thirdPartyConfig.aliRegionIdName" />
            </el-form-item>
            <el-form-item label="accesskey id" prop="thirdPartyConfig.aliAccessKeyId">
              <el-input v-model="form.thirdPartyConfig.aliAccessKeyId" />
            </el-form-item>
            <el-form-item label="accesskey secret" prop="thirdPartyConfig.aliAccessKeySecret">
              <el-input v-model="form.thirdPartyConfig.aliAccessKeySecret" />
            </el-form-item>
            <el-form-item label="ios一键登录私钥" prop="thirdPartyConfig.aKeyLoginIosSecret">
              <el-input v-model="form.thirdPartyConfig.aKeyLoginIosSecret" />
            </el-form-item>
            <el-form-item label="安卓一键登录私钥" prop="thirdPartyConfig.aKeyLoginAndroidSecret">
              <el-input v-model="form.thirdPartyConfig.aKeyLoginAndroidSecret" />
            </el-form-item>
          </el-card>
          <el-card header="微信分享" shadow="never">
            <el-form-item label="苹果app id" prop="thirdPartyConfig.iosWeChatShareAppId">
              <el-input v-model="form.thirdPartyConfig.iosWeChatShareAppId" />
            </el-form-item>
            <el-form-item label="苹果appsecret" prop="thirdPartyConfig.iosWeChatShareSecret">
              <el-input v-model="form.thirdPartyConfig.iosWeChatShareSecret" />
            </el-form-item>
            <el-form-item label="安卓app id" prop="thirdPartyConfig.androidWeChatShareAppId">
              <el-input v-model="form.thirdPartyConfig.androidWeChatShareAppId" />
            </el-form-item>
            <el-form-item label="安卓appsecret" prop="thirdPartyConfig.androidWeChatShareSecret">
              <el-input v-model="form.thirdPartyConfig.androidWeChatShareSecret" />
            </el-form-item>
            <el-form-item label="苹果回调链接" prop="thirdPartyConfig.iosShareUniversalLinks">
              <el-input v-model="form.thirdPartyConfig.iosShareUniversalLinks" />
            </el-form-item>
          </el-card>
          <el-card header="QQ分享" shadow="never">
            <el-form-item label="苹果app id" prop="thirdPartyConfig.iosQQShareAppId">
              <el-input v-model="form.thirdPartyConfig.iosQQShareAppId" />
            </el-form-item>
            <el-form-item label="苹果app key" prop="thirdPartyConfig.iosQQShareAppKey">
              <el-input v-model="form.thirdPartyConfig.iosQQShareAppKey" />
            </el-form-item>
            <el-form-item label="安卓app id" prop="thirdPartyConfig.androidQQShareAppId">
              <el-input v-model="form.thirdPartyConfig.androidQQShareAppId" />
            </el-form-item>
            <el-form-item label="安卓app key" prop="thirdPartyConfig.androidQQShareAppKey">
              <el-input v-model="form.thirdPartyConfig.androidQQShareAppKey" />
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>
      <el-form-item style="margin-top: 10px; float: right" size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveThirdSetthingFeach } from '@/api/app'
import { listPlatform } from '@/api/platform'
import RowTextarea from './rowTextarea.vue'

export default {
  name: 'BasicsForm',
  components: {
    RowTextarea
  },
  props: {
    isOpen: { type: Boolean, default: false },
    editForm: {
      type: Object,
      default: () => {}
    },
    sourceType: {
      type: String,
      default: ''
    },
    tapType: {
      type: String,
      default: ''
    }
  },
  data() {
    var checkALi = (rule, value, callback) => {
      if (this.isCheck) {
        return callback()
      } else {
        if (!value) return callback(new Error(rule.message))
        callback()
      }
    }
    const checkTalkingAppId = (rule, value, callback) => {
      let isOne = false
      this.selectIdConfig.talkingdataAppId.forEach(i => {
        if (i.talkingdataAppId) {
          isOne = true
        }
      })
      if (isOne) {
        callback()
      } else {
        callback(new Error('请最少填写一个talkingdata统计appid'))
      }
    }
    const checkYoumengAppIdAppId = (rule, value, callback) => {
      let isOne = false
      this.selectIdConfig.youmengAppId.forEach(i => {
        if (i.youmengAppId) {
          isOne = true
        }
      })
      if (isOne) {
        callback()
      } else {
        callback(new Error('请最少填写一个友盟统计appid'))
      }
    }
    return {
      form: {
        id: undefined,
        thirdPartyConfig: {
          aliDuanxinId: '',
          aliDuanxinKey: '',
          jiguangAppKey: '',
          aliDuanxinSign: '',
          aliDuanxinTemid: '',
          talkingdataAppId: '',
          youmengAppId: '',
          jiguangSecret: '',
          aliRegionIdName: '',
          aliAccessKeyId: '',
          aliAccessKeySecret: '',
          aKeyLoginIosSecret: '',
          aKeyLoginAndroidSecret: '',
          iosWeChatShareAppId: '',
          iosWeChatShareSecret: '',
          androidWeChatShareAppId: '',
          androidWeChatShareSecret: '',
          iosShareUniversalLinks: '',
          iosQQShareAppId: '',
          iosQQShareAppKey: '',
          androidQQShareAppId: '',
          androidQQShareAppKey: '',
          androidOcpcId: '',
          androidOcpcKey: '',
          androidSougouOcpcKey: '',
          iosOcpcId: '',
          iosOcpcKey: '',
          iosSougouOcpcKey: '',
          iosJiguangAppKey: '',
          iosJiguangSecret: '',
          p2ptoken: '',
          p2pswitch: '2',
          p2pswitchios: '2',
          iosShareSwitch: '1'
        }
      },
      rules: {
        'thirdPartyConfig.talkingdataAppId': [{ required: true, validator: checkTalkingAppId, trigger: 'blur' }],
        'thirdPartyConfig.youmengAppId': [{ required: true, validator: checkYoumengAppIdAppId, trigger: 'blur' }],
        'thirdPartyConfig.aliDuanxinId': [{ required: true, validator: checkALi, message: '请输入阿里短信访问密钥ID', trigger: 'blur' }],
        'thirdPartyConfig.aliDuanxinKey': [{ required: true, validator: checkALi, message: '请输入阿里短信访问密钥', trigger: 'blur' }],
        'thirdPartyConfig.aliDuanxinSign': [{ required: true, validator: checkALi, message: '请输入阿里短信签名', trigger: 'blur' }],
        'thirdPartyConfig.aliDuanxinTemid': [
          { required: true, validator: checkALi, message: '请输入阿里短信验证码模板ID', trigger: 'blur' }
        ],
        // 'thirdPartyConfig.jiguangAppKey': [{ required: true, message: '请输入安卓极光推送app key', trigger: 'blur' }],
        // 'thirdPartyConfig.jiguangSecret': [{ required: true, message: '请输入安卓极光推送secret', trigger: 'blur' }],
        'thirdPartyConfig.aliRegionIdName': [{ required: true, validator: checkALi, message: '请输入节点名region id', trigger: 'blur' }],
        'thirdPartyConfig.aliAccessKeyId': [{ required: true, validator: checkALi, message: '请输入accesskey id"', trigger: 'blur' }],
        'thirdPartyConfig.aliAccessKeySecret': [
          { required: true, validator: checkALi, message: '请输入accesskey secret', trigger: 'blur' }
        ],
        'thirdPartyConfig.aKeyLoginIosSecret': [{ required: true, validator: checkALi, message: '请输入ios一键登录私钥', trigger: 'blur' }],
        'thirdPartyConfig.aKeyLoginAndroidSecret': [
          { required: true, validator: checkALi, message: '请输入安卓一键登录私钥', trigger: 'blur' }
        ],
        'thirdPartyConfig.iosWeChatShareAppId': [{ required: true, message: '请输入苹果app id"', trigger: 'blur' }],
        'thirdPartyConfig.androidWeChatShareAppId': [{ required: true, message: '请输入安卓app id"', trigger: 'blur' }],
        'thirdPartyConfig.iosShareUniversalLinks': [{ required: true, message: '请输入苹果回调链接"', trigger: 'blur' }],
        'thirdPartyConfig.iosQQShareAppId': [{ required: true, message: '请输入苹果app id"', trigger: 'blur' }],
        'thirdPartyConfig.androidQQShareAppId': [{ required: true, message: '请输入安卓app id"', trigger: 'blur' }]
      },
      nameOptions: [],
      isUpDataImg: false,
      isUpDataLauncher: false,
      isEditImg: false,
      isEditLauncher: false,
      platFormSelect: [],
      selectIdConfig: {
        talkingdataAppId: [],
        youmengAppId: [],
      },
      talkingItem: {
        platformId: undefined,
        talkingdataAppId: ''
      },
      youmengItem: {
        platformId: "",
        youmengAppId: "",
      },
      talkingObjData: '',
      youmengData: {},
      thirdPartyQueryEd: false //判断第三方有没有请求过
    }
  },
  computed: {
    // 是否校验,当阿里云短信平台或者阿里云一键登录其中一个填满后,其他可以不填
    isCheck() {
      const data = this.form.thirdPartyConfig
      return !!(
        (data.aliDuanxinId && data.aliDuanxinKey && data.aliDuanxinSign && data.aliDuanxinTemid) ||
        (data.aliRegionIdName && data.aliAccessKeyId && data.aliAccessKeySecret && data.aKeyLoginIosSecret && data.aKeyLoginAndroidSecret)
      )
    }
  },
  watch: {
    isOpen(val) {
      // if (!val) {
      //   // this.reset()
      //   return
      // }
      if (val) {
        this.creatData()
      }
    },
    'editForm.id'(val) {
      this.creatData()
    },
    'talkingItem.platformId'() {
      const obj = this.selectIdConfig.talkingdataAppId.filter(i => i.id === Number(this.talkingItem.platformId))
      if (obj.length) {
        this.talkingItem.talkingdataAppId = obj[0].talkingdataAppId
      } else {
        this.talkingItem.talkingdataAppId = ''
      }
    },
    'talkingItem.talkingdataAppId'(val) {
      this.selectIdConfig.talkingdataAppId.forEach((i, oi) => {
        if (i.id === Number(this.talkingItem.platformId)) {
          i.talkingdataAppId = val
          this.$set(this.selectIdConfig.talkingdataAppId, oi, i)
        }
      })
    },
    "youmengItem.platformId"() {
      const obj = this.selectIdConfig.youmengAppId.filter(i => i.id === Number(this.youmengItem.platformId));
      if (obj.length) {
        this.youmengItem.youmengAppId = obj[0].youmengAppId;
      } else {
        this.youmengItem.youmengAppId = '';
      }
    },
    'youmengItem.youmengAppId'(val) {
      this.selectIdConfig.youmengAppId.forEach((i, oi) => {
        if (i.id === Number(this.youmengItem.platformId)) {
          i.youmengAppId = val
          this.$set(this.selectIdConfig.youmengAppId, oi, i)
        }
      })
    },
    tapType(val) {
      if (val === 'five' && !this.thirdPartyQueryEd) {
        this.thirdPartyQueryEd = true
        this.getPlatformList()
      }
    }
  },
  mounted() {
    this.creatData()
    window.thirdPartyConfigMock = {
      thirdPartyConfigData: this.test
    }
    // this.getPlatformList()
  },
  methods: {
    async getPlatformList() {
      console.log("getPlatformList", 1234125412);
      const setData = (data, key, list) => {
        const map = {
          "talkingdataAppId": "talkingItem",
          "youmengAppId": "youmengItem"
        };
        const arr = JSON.parse(JSON.stringify(list));
        const ids = Object.keys(data);
        ids.forEach(i => {
          arr.forEach(k => {
            if (k.id === Number(i)) {
              k[key] = data[i];
            }
          });
        });
        this.selectIdConfig[key] = arr;
        if (this.selectIdConfig[key].length) {
          this[map[key]].platformId = this.selectIdConfig[key][0].id;
        }
      };
      const { data } = await listPlatform({ pageIndex: 1, pageSize: 9999, idOrder: 'asc' })
      this.platFormSelect = data.list
      setData(this.talkingObjData, "talkingdataAppId", data.list || []);
      setData(this.youmengData, "youmengAppId", data.list || []);
    },
    creatData() {
      this.reset()
      if (this.editForm.id) {
        const { thirdPartyConfig, id } = this.editForm
        this.form.id = id
        Object.assign(this.form.thirdPartyConfig, thirdPartyConfig)
        this.talkingObjData = this.form.thirdPartyConfig.talkingdataAppId ? JSON.parse(this.form.thirdPartyConfig.talkingdataAppId) : "";
        this.youmengData = this.form.thirdPartyConfig.youmengAppId ? JSON.parse(this.form.thirdPartyConfig.youmengAppId) : "";
      }
    },
    setAppId() {
      const keys = ["talkingdataAppId", "youmengAppId"];
      keys.forEach(key => {
        let data = {};
        this.selectIdConfig[key].forEach(item => {
          item[key] && (data[item.id] = item[key]);
        });
        this.form.thirdPartyConfig[key] = !!Object.keys(data).length ? JSON.stringify(data) : "";
      });
    },
    onSubmit() {
      this.setAppId();
      this.$refs['basicsForm'].validate(valid => {
        if (valid) {
          const submitUrlFun = saveThirdSetthingFeach
          console.log(this.form)
          submitUrlFun(this.form).then(res => {
            this.msgSuccess('修改成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset() {
      this.resetForm('basicsForm')
      this.form = {
        id: undefined,
        thirdPartyConfig: {
          aliDuanxinId: '',
          aliDuanxinKey: '',
          jiguangAppKey: '',
          aliDuanxinSign: '',
          aliDuanxinTemid: '',
          talkingdataAppId: '',
          jiguangSecret: '',
          aliRegionIdName: '',
          aliAccessKeyId: '',
          aliAccessKeySecret: '',
          aKeyLoginIosSecret: '',
          aKeyLoginAndroidSecret: '',
          iosWeChatShareAppId: '',
          iosWeChatShareSecret: '',
          androidWeChatShareAppId: '',
          androidWeChatShareSecret: '',
          iosShareUniversalLinks: '',
          iosQQShareAppId: '',
          iosQQShareAppKey: '',
          androidQQShareAppId: '',
          androidQQShareAppKey: '',
          androidOcpcId: '',
          androidOcpcKey: '',
          androidSougouOcpcKey: '',
          iosOcpcId: '',
          iosOcpcKey: '',
          iosSougouOcpcKey: '',
          iosJiguangAppKey: '',
          iosJiguangSecret: '',
          p2ptoken: '',
          p2pswitch: '2',
          p2pswitchios: '2',
          iosShareSwitch: '1'
        }
      }
    },
    test() {
      this.form.thirdPartyConfig = {
        aliDuanxinId: 'LTAI4G7DUraJcDj4cGysEgGG',
        aliDuanxinKey: 'xZXyZiARxe34XTmZ5FbyF3pYyn9AcA',
        jiguangAppKey: '9a808d1fa00ec1ab6b9ac246',
        jiguangSecret: '9a808d1fa00ec1ab6b9ac246',
        aliDuanxinSign: '爱趣小说',
        aliDuanxinTemid: 'SMS_181852927',
        talkingdataAppId: 'ECEA499A97C04CEEA840BB8C7FB2C9C2',
        aliRegionIdName: 'cn-shenzhen',
        aliAccessKeyId: 'LTAI4GCJxg1toGTuwNP1S2sn',
        aliAccessKeySecret: '8tkrNI4WF7Lu7qwEGXWec5VR1ALVL8',
        aKeyLoginIosSecret:
          'ILtMVJP03KGbjcmFaf7VfvkY3CLgTb0YNbK82lDBiqg45M+ncdTthAiwrpNfj6aW9t1ZYc4yh5CNjHDlu8dJZl4OzbfbsB0OrWkEEdoBN/3GHbhnGDhMIKMF6xTmAH0x8ciwg0QeKgubbgVn7eo/9WXNnE4+u/scv+LyaGPn4nb/yoRudfWxaaKxdD5SohBIorISFz0CYnEV85BDXVbk/NIeWGXu4vyEmF7MVXSNLIjHCby4q1Qu1HskB/WuJeA1MwHm6o20zUg=',
        aKeyLoginAndroidSecret:
          'nNBHA2imO+FdJ49oLERQqDd2/PhdUVicmsgRHiFjGGKFR5YZl/ZlMCft/sV1r+NfknhkZ8RraVOsujn1Sg3AfAdeEWWFTlkXplAK5zZCBqYSJmnT0AUWo2Z6vtwYv4Dn3UTtI5L2WYbPipEBYmxh0jV4dD66YY4Z4JXTL/XPAttQlOtLN5/o9bFo2G2m5/63RPC4rKUk88+8sGjc6t605V9GM3WqP9polnFSznFrI9i+VZiFfWlL596TXJIZhj4ZlQjIQYzZXTYJX1DCxcsJF6cVVyiobTysPgl022rKMBqr9w03yVArkA=='
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.root {
  overflow: hidden;
}
.basicsTitle {
  text-align: center;
  font-size: 18px;
  line-height: 1;
  color: #303133;
  margin-bottom: 20px;
}
</style>
