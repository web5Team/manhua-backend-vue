export default {
  data() {
    var checkReadAdPage = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入阅读页显示广告的间隔页数'))
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 5 || value > 1000) {
          callback(new Error('请输入范围5-1000的数字'))
        } else {
          callback()
        }
      }
    }
    var checkInstallAfterAd = (rule, value, callback) => {
      if (!value && value !== 0) return callback(new Error('请输入新用户安装后显示广告'))
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 0 || value > 1000) {
          callback(new Error('请输入范围0-1000的数字'))
        } else {
          callback()
        }
      }
    }
    var checkReadFullAdInterval = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入阅读页弹出全屏广告间隔时间'))
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 5 || value > 10000) {
          callback(new Error('请输入范围5-10000的数字'))
        } else {
          callback()
        }
      }
    }
    var checkReadInterceptInterval = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入阅读页弹出广告拦截时间间隔'))
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 1 || value > 10000) {
          callback(new Error('请输入范围1-10000的数字'))
        } else {
          callback()
        }
      }
    }
    return {
      backupForm: {
        adSwitch: false,
        readAdPage: null,
        installAfterAd: null,
        readFullAdInterval: null,
        readInterceptInterval: null,
        android: {
          csjAdAppid: '', // 穿山甲广告APPID
          ylhAdAppid: '', // 优量汇广告APPID
          tdAdAppid: '', // 淘豆广告APPID
          tdAdAppKey: '', // 淘豆广告Key
          bookDetailBannerAd: {
            // 详细页面中间banner
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          backTofrontAd: {
            // 从后台唤醒到前台的全屏
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          bookShelfAd: {
            // 书架页九宫格
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          startFullScreenAd: {
            // APP启动全屏广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          readPageCurlPageAd: {
            // 阅读页页面插入广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          downLoadAd: {
            // 书籍点击下载弹出全屏广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          readPageBottomAd: {
            // 阅读页底部banner广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          readInterceptAd: {
            // 阅读页弹出广告拦截
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          }
        },
        ios: {
          csjAdAppid: '', // 穿山甲广告APPID
          ylhAdAppid: '', // 优量汇广告APPID
          tdAdAppid: '', // 淘豆广告APPID
          tdAdAppKey: '', // 淘豆广告Key
          bookDetailBannerAd: {
            // 详细页面中间banner
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          backTofrontAd: {
            // 从后台唤醒到前台的全屏
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          bookShelfAd: {
            // 书架页九宫格
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          startFullScreenAd: {
            // APP启动全屏广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          readPageCurlPageAd: {
            // 阅读页页面插入广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          downLoadAd: {
            // 书籍点击下载弹出全屏广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          readPageBottomAd: {
            // 阅读页底部banner广告
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          },
          readInterceptAd: {
            // 阅读页弹出广告拦截
            csjStatus: false,
            csjAdvId: '',
            ylhStatus: false,
            ylhAdvId: '',
            tdStatus: false,
            tdAdAdvId: ''
          }
        }
      },
      rules: {
        readAdPage: [{ required: true, validator: checkReadAdPage, trigger: 'blur' }],
        installAfterAd: [{ required: true, validator: checkInstallAfterAd, trigger: 'blur' }],
        readFullAdInterval: [{ required: true, validator: checkReadFullAdInterval, trigger: 'blur' }],
        readInterceptInterval: [{ required: true, validator: checkReadInterceptInterval, trigger: 'blur' }]
      }
    }
  },
  created() {},
  beforeDestroy() {},
  methods: {}
}
