<template>
  <el-dialog id="chapter_list" :visible.sync="open" width="70%" :close-on-click-modal="false" :before-close="cancelChapterMain">
    <el-form ref="chapterQueryForm" :model="queryParams" :inline="true" label-width="70px">
      <el-form-item label="章节id" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入章节id" clearable size="small" />
      </el-form-item>
      <el-form-item label="章节名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入章节名称" clearable size="small" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择">
          <el-option v-for="dict in statusTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="空章节" prop="empty">
        <el-select v-model="queryParams.empty" clearable placeholder="请选择">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleChapterQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetChapterQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" v-permisaction="['admin:cartoonChapter:add']" icon="el-icon-plus" size="mini" @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          v-permisaction="['admin:cartoonChapter:editSort']"
          icon="el-icon-edit"
          size="mini"
          :disabled="Chaptersingle"
          @click="handleUpdatesort"
          >修改排序</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          v-permisaction="['admin:cartoonChapter:remove']"
          icon="el-icon-delete"
          size="mini"
          :disabled="Chaptermultiple"
          @click="handleChapterDelete"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          v-permisaction="['admin:cartoonChapter:addToError']"
          size="mini"
          :disabled="Chaptermultiple"
          @click="addNovelchapterErr"
          >添加到纠错</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" v-permisaction="['admin:cartoonChapter:successSort']" size="mini" @click="addToChapterSortBtn"
          >一键排序</el-button
        >
      </el-col>
    </el-row>
    <el-table ref="dragTable" v-loading="loading" height="650" row-key="id" :data="list" @selection-change="handleSelectionChapterChange">
      <el-table-column type="selection" width="30px" align="center" />
      <el-table-column label="章节id" align="center" prop="id" :show-overflow-tooltip="true" />
      <el-table-column label="章节名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="采集规则名称" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleId | arrFilter(['id', 'name'], ruleList) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="50" align="center" prop="status" :formatter="showState">
        <template slot-scope="scope">
          <span>{{ showState(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传状态" width="100" align="center" prop="status" :formatter="showUploadState">
        <template slot-scope="scope">
          <span>{{ showUploadState(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="章节排序" align="center" prop="chapterSort" :show-overflow-tooltip="true" />
      <el-table-column label="排序" align="center" prop="sort" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createdAt">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permisaction="['admin:cartoonChapter:checkContent']"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="viewChapterContent(scope.row)"
            >查看内容</el-button
          >
          <el-button
            v-permisaction="['admin:cartoonChapter:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleChapterUpdate(scope.row)"
            >修改</el-button
          >
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="chaptertotal > 0"
      small
      :total="chaptertotal"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <editChapterDemo
      :cartoonId="formData.id"
      :chapterId="chapterData.chapterId"
      :open.sync="chapterData.open"
      :isEdit="chapterData.isEedit"
      @success="successUpload"
    ></editChapterDemo>
    <el-dialog title="预览" :visible.sync="pageCartoonOpen" width="70%" :append-to-body="true">
      <div class="preview_img_box">
        <ul>
          <li v-for="(item, index) in prevImgArr" :key="index">
            <img :src="item.url" alt="" />
          </li>
        </ul>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { chapterList, uploadChapterImg, delChapter, editSortChapter, addNovelCartoonErr, chapterInfo } from '@/api/cartoon'
import UploadObs from '@/components/UploadObs'
import editChapterDemo from './editChapter'
import { mapState } from 'vuex'
import Sortable from 'sortablejs'

export default {
  components: {
    UploadObs,
    editChapterDemo
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    },
    ruleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      queryParams: {},
      loading: false,
      list: [],
      newList: [],
      chaptertotal: 0,
      Chaptersingle: true,
      chapterForm: {
        name: '',
        status: 1,
        sort: 0
      },
      editImage: [],
      newEditImage: [],
      statusTypeOptions: [
        { dictValue: 1, dictLabel: '显示' },
        { dictValue: 2, dictLabel: '不显示' }
      ],
      statusUploadOptions: [
        { dictValue: 0, dictLabel: '——' },
        { dictValue: 1, dictLabel: '待上传' },
        { dictValue: 2, dictLabel: '上传中' },
        { dictValue: 3, dictLabel: '上传成功' },
        { dictValue: 4, dictLabel: '上传失败' }
      ],
      rules: {
        name: [{ required: true, message: '章节名不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        sort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }
        ]
      },
      Chaptermultiple: true,
      ids: [],
      pageCartoonOpen: false,
      chapterData: {
        open: false,
        isEedit: false,
        loading: false,
        chapterId: 0
      },
      ecrptArrImg: [], //需要上传的列表
      isUploaded: false,
      prevImgArr: []
    }
  },
  computed: {
    chapterTitle() {
      return this.chapterData.isEedit ? '修改章节' : '新增章节'
    },
    retryVisible() {
      let arr = this.newEditImage.filter((i) => i.chapterId === this.chapterData.chapterId)
      let isRetry = 0
      arr.forEach((k) => {
        if (k.status === 4 && k.raw) {
          isRetry++
        }
      })
      return isRetry !== 0 ? true : false
    },
    ...mapState('user', {
      dataDesKey: 'dataDesKey'
    })
  },
  watch: {
    open(val) {
      if (val) {
        this.reset()
        if (this.type === 'cartoonerr') {
          this.queryParams.id = this.formData.chapterId
        }
        this.getList()
      }
    }
  },
  created() {},
  methods: {
    getList() {
      this.loading = true
      chapterList(this.queryParams)
        .then((response) => {
          this.list = response.data.list
          this.chaptertotal = response.data.count
          this.$nextTick(() => {
            this.setSort()
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleChapterQuery() {
      this.getList()
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('#chapter_list .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: (evt) => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
          this.Chaptersingle = false
        }
      })
    },
    resetChapterQuery() {
      this.reset()
      this.getList()
    },
    reset() {
      this.queryParams = {
        pageIndex: 1,
        pageSize: 10,
        cartoonId: this.formData.id,
        status: undefined,
        name: undefined,
        id: undefined,
        empty: undefined
      }
    },
    resetChapter() {
      this.chapterForm = {
        name: '',
        status: 1,
        sort: 0
      }
      this.resetForm('form')
    },
    // 查看章节内容
    async viewChapterContent(row) {
      this.prevImgArr = []
      this.pageCartoonOpen = true
      const { data } = await chapterInfo(this.formData.id, row.id)
      if (data.pictures) {
        const arr = data.pictures.split('|')
        let arrPic = []
        for (let i in arr) {
          if (this.pageCartoonOpen) {
            let res = await this.cryptoCartoon.decrypt(arr[i], 'chapter')
            arrPic.push({ url: res })
            this.prevImgArr = arrPic
          }
        }
      } else {
        this.prevImgArr = []
      }
    },
    cancelChapterMain() {
      this.$emit('update:open', false)
    },
    cancelChapter() {
      this.resetChapter()
      // this.editImage = []
      // this.newEditImage = []
      this.chapterData = {
        open: false,
        isEedit: false,
        loading: false,
        chapterId: 0
      }
    },
    handleChapterUpdate(row) {
      this.chapterData.open = true
      this.chapterData.isEedit = true
      this.chapterData.loading = true
      this.chapterData.chapterId = row.id
      // this.getChapterInfo()
    },
    async uploadImgFun() {
      const reg = /^(http|https):\/\/\S*/
      for (let i = 0; i < this.newImage.length; i++) {
        if (!reg.test(this.newImage[i].url)) {
          const paramsObj = {
            cartoonId: this.formData.id,
            chapterId: this.chapterData.chapterId,
            picture: this.newImage[i].url
          }
          try {
            const { data } = await uploadChapterImg(paramsObj)
            const obj = {
              name: this.newImage[i].name,
              url: data
            }
            this.newImage.splice(i, 1, obj)
          } catch {
            continue
          }
        }
      }
    },
    showState(row) {
      return this.selectDictLabel(this.statusTypeOptions, row.status)
    },
    showUploadState(row) {
      return this.selectDictLabel(this.statusUploadOptions, row.uploadStatus)
    },
    handleUpdatesort() {
      var ids = []
      var chapterSortArr = []
      var maxindex = 0
      for (var i = 0; i < this.list.length; i++) {
        ids[i] = this.list[i].id
        chapterSortArr[i] = this.list[i].chapterSort
        if (maxindex < this.list[i]['sort']) {
          maxindex = this.list[i]['sort']
        }
      }
      var postdata = []
      for (i = 0; i < ids.length; i++) {
        postdata[i] = { id: ids[i], chapterSort: chapterSortArr[i], sort: maxindex, cartoonId: this.formData.id }
        maxindex--
      }
      editSortChapter(postdata).then(() => {
        this.msgSuccess('提交成功，排序正在修改中请稍后查看结果')
        this.Chaptersingle = true
      })
    },
    handleChapterDelete() {
      var _t = this
      const ids = this.ids.join(',')
      this.$confirm(`是否确认删除选中的${ids}数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delChapter({ cartoonId: _t.formData.id, ids: _t.ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    addNovelchapterErr() {
      // 添加纠错
      const Ids = this.ids.join(',')
      this.$confirm('是否将id为"' + Ids + '"的数据加入纠错?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addNovelCartoonErr({ cartoonId: this.formData.id, ids: this.ids }).then(() => {
          this.msgSuccess('添加成功')
          this.getList()
        })
      })
    },
    handleSelectionChapterChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.Chaptermultiple = !selection.length
    },
    handleAdd() {
      // this.editImage = []
      // this.newEditImage = []
      this.chapterData.open = true
      this.chapterData.isEedit = false
      this.chapterData.chapterId = 0
    },
    successUpload() {
      this.getList()
    },
    addToChapterSortBtn() {
      this.$confirm('确定要重新排序吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          let { data } = await chapterList({ pageSize: 99999, pageIndex: 1, cartoonId: this.formData.id })
          let numMax = data.count
          let arr = data.list.map((i) => {
            let obj = {
              id: i.id,
              chapterSort: i.chapterSort,
              sort: numMax,
              cartoonId: this.formData.id
            }
            numMax--
            return obj
          })
          await editSortChapter(arr)
          this.msgSuccess('提交成功，排序正在修改中请稍后查看结果')
          this.loading = false
        } catch {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.preview_img_box {
  width: 100%;
  padding-bottom: 20px;
  height: 70vh;
  overflow-y: scroll;
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      img {
        width: 100%;
        display: block;
      }
    }
  }
}
</style>
