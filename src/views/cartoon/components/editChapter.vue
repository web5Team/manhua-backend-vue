<template>
    <el-dialog :title="chapterTitle" :visible.sync="open" width="60%" :close-on-click-modal="false" :append-to-body="true" :before-close="cancelChapter">
      <el-form ref="form" :model="chapterForm" :rules="rules" label-width="80px">
        <el-form-item label="章节名称" prop="name">
          <el-input v-model="chapterForm.name" placeholder="章节名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="chapterForm.status" clearable placeholder="请选择">
            <el-option v-for="dict in statusTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="chapterSort">
          <el-input v-model.number="chapterForm.chapterSort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="chapterForm.sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="错误图片" v-if="isErrorJC && errorImgList.length">
          <ul class="error_tigs_box">
            <li class="item_txt" v-for="(item, index) in errorImgList" :key="index">{{item}}</li>
          </ul>
        </el-form-item>
        <el-form-item label="章节内容" prop="content">
          <UploadObs ref="uploadImgF" :open.sync="open" :isDisable="!chapterIdPrivate || loading || isUploaded" typeIdStr="chapterId" :id="chapterIdPrivate" size-type="MB" :size="5" :autoUpload="false" :limit-img-num="999" :get-file-list="editImage" :before-remove-fun="beforeRemove" @change="imgChange"></UploadObs>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteOBS" :disabled="loading || isUploaded">全部删除</el-button>
        <el-button type="primary" @click="submitChapterForm" :disabled="loading">保存</el-button>
        <el-button type="primary" @click="submitOBS('first')" :disabled="!chapterIdPrivate || loading">上传华为云</el-button>
        <el-button type="primary" v-if="retryVisible" @click="submitOBSAgain" :disabled="!chapterIdPrivate || loading || isUploaded">重试</el-button>
      </div>
    </el-dialog>
</template>

<script>
import UploadObs from '@/components/UploadObs'
import { uploadOBSFun, deleteOBSFun} from '@/utils/uploadObs'
import { editChapter, chapterInfo, addChapter, uploadChapterStatus } from '@/api/cartoon'
import { mapState } from 'vuex'


export default {
    components: {
        UploadObs
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        chapterId: {
            type: Number,
            default: 0
        },
        cartoonId: {
            type: Number,
            default: 0
        },
        isErrorJC: {
          type: Boolean,
          default: false
        }
    },
    data() {
        return {
            editImage: [],
            newEditImage: [],
            chapterForm: {
              name: '',
              chapterSort: 0,
              status: 1,
              sort: 0
            },
            statusTypeOptions: [{ dictValue: 1, dictLabel: '显示' }, { dictValue: 2, dictLabel: '不显示' }],
            rules: {
              name: [{ required: true, message: '章节名不能为空', trigger: 'blur' }],
              status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
              sort: [{ required: true, message: '排序不能为空'},
                     { type: 'number', message: '排序必须为数字值'}],
            },
            loading: false,
            ecrptArrImg: [], //需要上传的列表
            isUploaded: false,
            errorImgList: [], //错误图片
            isEditPrivate: false, //是否编辑
            chapterIdPrivate: undefined
        }
    },
    watch: {
        open(val) {
            if (val) {
              this.isEditPrivate = this.isEdit
              this.chapterIdPrivate = this.chapterId
                if (this.isEdit) {
                    this.loading = true
                    this.getChapterInfo()
                } else {
                    this.editImage = [...this.newEditImage]
                    this.newEditImage = []
                }
            } else {
                this.reset()
            }
        }
    },
    computed: {
        chapterTitle() {
          return this.isEditPrivate ? '修改章节' : '新增章节'
        },
        retryVisible() {
          let arr = this.newEditImage.filter(i => i.chapterId === this.chapterIdPrivate)
          let isRetry = 0
          arr.forEach(k => {
            if (k.status === 4 && k.raw) {
              isRetry++
            }
          })
          return isRetry !== 0 ? true : false
        },
        ...mapState('user' ,{
          dataDesKey: 'dataDesKey'
        })
    },
    methods: {
        cancelChapter() {
            this.$emit('update:open', false)
        },
        reset() {
            this.loading = false
            this.chapterForm = {
              name: '',
              chapterSort: 0,
              status: 1,
              sort: 0
            }
            if (this.isErrorJC) {
              this.newEditImage = []
              this.editImage = []
            }
            this.errorImgList = []
            this.resetForm('form')
        },
        async setChapterImg(pictures, status) {
            try {
              await uploadChapterStatus({
                cartoonId: this.cartoonId,
                id: this.chapterIdPrivate,
                pictures,
                uploadStatus: status
              })
            } catch {
              return false
            }
        },
        async setChapterImgs(status) {
           let arr = this.ecrptArrImg.map(i => i.chapterId)
           let newArr = [...new Set(arr)]
           for(let k in newArr) {
             try {
               let pictures = []
               this.newEditImage.forEach(y => {
                 if (y.chapterId === newArr[k]) {
                   if (y.urlRoute === '') {
                     y.urlRoute = this.dataDesKey.obs.domain + '/' + 'static/nocpt.png'
                   } else {
                     pictures.push(this.replaceDomainUrl(y.urlRoute))
                   }
                 }
               })
               if (status === 3) {
                 let isError = pictures.indexOf( this.dataDesKey.obs.domain + '/' + 'static/nocpt.png')
                 status = isError === -1 ? 3 : 4
               }
               await uploadChapterStatus({
                 cartoonId: this.cartoonId,
                 id: newArr[k],
                 pictures: pictures.join('|'),
                 uploadStatus: status
               })
             } catch {
               return false
             }
           }
         },
        async beforeRemove(file) {
          try {
            let data = await deleteOBSFun(file.urlRoute)
            if (data === 'success') {
              let newArr = []
              this.newEditImage.forEach(i => {
                if (i.chapterId === this.chapterIdPrivate && i.urlRoute !== file.urlRoute) {
                  newArr.push(i.urlRoute)
                }
              })
              await this.setChapterImg(newArr.join('|'), 1)
              this.editImage = this.editImage.filter(i => i.urlRoute !== file.urlRoute)
            } else {
              return new throwErrer()
            }
          } catch {
            this.$message.error('请稍后再试')
            return false
          }
        },
        imgChange(arr) {
          let otherChapterImg = this.newEditImage.filter(i => i.chapterId !== this.chapterIdPrivate)
          this.newEditImage = [...otherChapterImg, ...arr]
          let errorImgL = []
          arr.forEach(y => {
            if (y.status === 4 && y.errTxt) errorImgL.push(y.errTxt)
          })
          this.errorImgList = errorImgL
        },
        async deleteOBS() {
          let newArr = this.newEditImage.filter(i => i.chapterId === this.chapterIdPrivate)
          if (!newArr.length || !this.chapterIdPrivate) {
            this.$message.warning('暂无图片')
            return
          }  
          this.$confirm('此操作将全部删除图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$message.success('开始删除')
            await this.autoGetImgHandle()
          })
        },
        async autoGetImgHandle() {
          //删除前分删除线上和本地
          let obsImgArr = []
          let localImgArr = []
          this.newEditImage.forEach(i => {
            if(i.chapterId === this.chapterIdPrivate) {
              if (i.status === 1) {
                localImgArr.push(i)
              } else {
                obsImgArr.push(i)
              }
            }
          })
          if (obsImgArr.length) {
            let errorDelUrl = []
            for(let k in obsImgArr) {
              let resData = await deleteOBSFun(obsImgArr[k].urlRoute)
              if (resData === 'error') {
                errorDelUrl.push(obsImgArr[k].urlRoute)
              }
            }
            await this.setChapterImg(errorDelUrl.join('|'), 1)
            this.editImage = this.editImage.filter(i => errorDelUrl.includes(i.urlRoute))
          }
          if (localImgArr.length) {
            await this.$refs.uploadImgF.delLocalFun(localImgArr)
          }
          this.$message.success('删除成功')
        },
        async submitChapterForm() {
          this.$refs.form.validate((valid) => {
            if (valid) {
                let paramsObj = this.chapterForm
                if (this.isEditPrivate) {
                  paramsObj.id = this.chapterIdPrivate
                }
                paramsObj.cartoonId = this.cartoonId
                paramsObj.sort = parseInt(paramsObj.sort)
                let api = this.isEditPrivate ? editChapter : addChapter
                api(paramsObj).then(res => {
                  if (!this.isEditPrivate) {
                    this.chapterIdPrivate = res.data.id
                    this.isEditPrivate = true
                  }
                  this.$message.success('保存成功')
                  this.$emit('success')
                })
            } else {
              return false;
            }
          });
        },
        async submitOBS(str) {
          let isUploadNum = 0
          this.newEditImage.forEach(i => {
            if (i.chapterId === this.chapterIdPrivate && i.status === 1) {
              i.needUpload = true
              isUploadNum++
            }
          })
          if (isUploadNum !== 0) {
            if (this.isUploaded && str === 'first') {
              this.$message.success('等待上传')
              return
            } else {
              if(str === 'first') {
                this.$message.success('开始上传')
              }
              this.isUploaded = true
            }
          } else {
            this.$message.warning('暂无新图片可上传')
            return
          }
          for(let i in this.newEditImage) {
            if (this.newEditImage[i].needUpload) {
              if (this.newEditImage[i].raw) {//未上传过的
                let data = await this.cryptoCartoon.encrypt(this.newEditImage[i].raw)
                let urlRoute = `${Math.ceil(Number(this.cartoonId)/2000)}/${this.cartoonId}/cpt/${this.chapterIdPrivate}/${data.name}`
                this.newEditImage[i].ecrptData = data
                this.newEditImage[i].urlRoute = urlRoute
              }
              this.ecrptArrImg.push(this.newEditImage[i])
              this.newEditImage[i].needUpload = false
            }
          }
          await this.setChapterImgs(2)//1待上传2上传中3上传成功4上传失败
          this.uploadQueueFun()
        },
        //上传队列
        async uploadQueueFun() {
          if (this.ecrptArrImg.length) {//有新图片
            await this.batchMoreUpload(this.ecrptArrImg)
          }
        },
        checkHaveUploadFile() {//判断有无可上传的
          let arr = this.newEditImage.filter(i => i.needUpload)
          return arr.length ? true : false
        },
        //并行上传
        async batchMoreUpload(arr) {
          let that = this
          let tokensRequest = {
            state: ['1', '2', '3', '4', '5', '6'],  // 默认令牌
            num: 0, //记录请求次数
            queue: [],   // 请求队列
            waitqueue: [],  //  等待队列
            // 获取令牌
            getToken: function() {
                return this.state.splice(0, 1)[0];
            },
            // 归还令牌
            backToken: function(token) {
                this.state.push(token);
            },
            // 请求队列
            pushQueue: function(args, type = "first") {
                type == "second" && (this.queue = []); // 每次push新请求的时候  队列清空
                for(var i = 0; i < args.length; i++) {
                    if( this.state.length > 0) {  // 看是否有令牌
                        var token = this.getToken();  // 取令牌
                        var obj = {
                            token,
                            request: args[i]
                        }
                        this.queue.push(obj);
                    } else {   // 否则推入等待队列
                        this.waitqueue.push(args[i])
                    }
                }
            },
            // 开始执行
            start: async function() {
                for(let item of this.queue) {
                    that.changeChapterImgStatusFun(item.request.urlRoute, item.request.urlRoute, 2)
                    uploadOBSFun(item.request.ecrptData, item.request.urlRoute, that.countUploadProgress(item.request)).then(async res => {
                      let path = res === '' ? that.dataDesKey.obs.domain + '/' + 'static/nocpt.png' : res
                      let status = res !== '' ? 3 : 4
                      if(res) {//处理上传好了的文件
                        that.newEditImage.some(i => {
                          if (i.urlRoute === item.request.urlRoute) {
                            i.raw = ''
                            i.isEncode = true
                          }
                          return i.urlRoute === item.request.urlRoute
                        })
                      }
                      that.changeChapterImgStatusFun(path, item.request.urlRoute, status)
                      this.backToken(item.token); // 令牌归还
                      if(this.waitqueue.length > 0) {
                          var wait = this.waitqueue.splice(0, 1);
                          this.pushQueue(wait, "second"); // 从等待队列进去的话 就是第二中的push情况了
                          this.start(); // 重新开始执行队列
                      }
                    }).catch(() => {
                        that.changeChapterImgStatusFun(item.request.urlRoute, item.request.urlRoute, 4)
                        this.backToken(item.token); // 令牌归还
                        if(this.waitqueue.length > 0) {
                            var wait = this.waitqueue.splice(0, 1);
                            this.pushQueue(wait, "second"); // 从等待队列进去的话 就是第二中的push情况了
                            this.start(); // 重新开始执行队列
                        }
                    }).finally(async () => {
                      this.num = this.num + 1
                      if(this.num === arr.length) {//最后一个请求
                          await that.setChapterImgs(3)
                          that.ecrptArrImg = []
                          if (that.checkHaveUploadFile()) {
                            that.isUploaded = false
                            that.submitOBS('second')
                          } else {
                            that.$message.success('上传完了')
                            that.$emit('success')
                            that.isUploaded = false
                          }
                      }
                    })
                }
            }
          }
          tokensRequest.pushQueue(arr)
          await tokensRequest.start()
        },
        changeChapterImgStatusFun(newPath, oldPath, status) {
          this.newEditImage.some(i => {
            if (i.urlRoute === oldPath) {
              i.status = status
              i.urlRoute = this.replaceDomainUrl(newPath)
            }
            return i.urlRoute === oldPath
          })
          let newArr  = this.newEditImage.filter(i => i.chapterId === this.chapterIdPrivate)
          this.editImage = newArr
        },
        countUploadProgress(data) {
          return (event) => {
            let progress = Math.ceil((event.loaded / event.total) * 100)
            this.newEditImage.some(i => {
              if (i.urlRoute === data.urlRoute) {
                i.progress = progress
              }
              return i.urlRoute === data.urlRoute
            })
            let newArr  = this.newEditImage.filter(i => i.chapterId === this.chapterIdPrivate)
            this.editImage = newArr
          }
        },
        async getChapterInfo() {
          const { data } = await chapterInfo(this.cartoonId, this.chapterIdPrivate)
          this.chapterForm = data
          if (data.pictures) {
            const arr = data.pictures.split('|')
            let arrPic = []
            let selfImgArr = this.newEditImage.filter(i => i.chapterId === this.chapterIdPrivate && i.raw)
            for(let i in arr) {
              if(this.open) {
                let status = arr[i].includes('/static/nocpt.png') ? 4 : 3
                let pageX = 0
                if (status === 4) {
                  pageX = Math.ceil(Number(i + 1) / 15)
                  pageX = pageX === 0 ? 1 : pageX
                }
                let arrStr = arr[i].split('.')
                arrPic.push({url: arr[i], urlRoute: arr[i], status, name: `${data.sort}_${i * 1 + 1}.${arrStr[arrStr.length - 1]}`, chapterId: this.chapterIdPrivate, sort: i * 1 + 1, color: status === 4 && this.isErrorJC, isEncode: false, errTxt: `第${pageX}页_${i * 1 + 1}.${arrStr[arrStr.length - 1]}`})
                this.editImage = arrPic
                if (Number(i) === arr.length - 1) {
                  this.editImage = [...this.editImage, ...selfImgArr]
                  this.loading = false
                }
              } else {//在没加载所有图片时候关闭时，要兼容本地未上传的图片
                if (Number(i) === arr.length - 1) {
                  this.editImage = [...this.editImage, ...selfImgArr]
                  this.loading = false
                }
              }
            }
          } else {
            let selfImgArr = this.newEditImage.filter(i => i.chapterId === this.chapterIdPrivate && i.raw)
            this.editImage = selfImgArr
            this.loading = false
          }
        },
        //重试按钮
        submitOBSAgain() {
          this.newEditImage.forEach(i => {
            if (i.chapterId === this.chapterIdPrivate && i.status === 4 && i.raw) {
              i.status = 1
            }
          })
          this.submitOBS('first')
        }
    }
}
</script>

<style lang="scss" scoped>
.error_tigs_box {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  min-height: 36px;
  align-items: center;
  .item_txt {
    line-height: 20px;
    margin-right: 15px;
    color: #f56c6c;
    padding: 8px 0;
    list-style: none;
  }
}
</style>