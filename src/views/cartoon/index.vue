
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="漫画名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入漫画名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="漫画id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入漫画id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="queryParams.author" placeholder="请输入作者" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="漫画别名" prop="aliasName">
            <el-input
              v-model="queryParams.aliasName"
              placeholder="请输入漫画别名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="主角" prop="protagonist">
            <el-input v-model="queryParams.protagonist" placeholder="主角" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="作者别名" prop="aliasAuthor">
            <el-input v-model="queryParams.aliasAuthor" placeholder="作者别名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updatedAt">
            <el-date-picker
              v-model="queryParams.updatedAt"
              value-format="yyyy-MM-dd HH:mm:SS"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="创建时间" prop="createdAt">
            <el-date-picker
              v-model="queryParams.createdAt"
              value-format="yyyy-MM-dd HH:mm:SS"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="queryParams.categoryId" clearable placeholder="请选择">
              <el-option v-for="dict in categoryTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="采集规则名称" prop="ruleId" label-width="100px">
            <el-select v-model="queryParams.ruleId" clearable placeholder="请选择">
              <el-option v-for="dict in ruleList" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="漫画状态" prop="isEnd">
            <el-select v-model="queryParams.isEnd" clearable placeholder="请选择">
              <el-option v-for="dict in statusCartoonOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="请选择">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="采集状态" prop="sStatus">
            <el-select v-model="queryParams.sStatus" clearable placeholder="请选择">
              <el-option v-for="dict in collectionOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="推荐状态" prop="recommend">
            <el-select v-model="queryParams.recommend" clearable placeholder="请选择">
              <el-option v-for="dict in recommendCartoonOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="areaId">
            <el-select v-model="queryParams.areaId" clearable placeholder="请选择">
              <el-option v-for="area in areaOptions" :key="area.id" :label="area.name" :value="area.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="标签" prop="tagIds">
            <MultipleSelect v-model="queryParams.tagIds" :select-arr="tagList"></MultipleSelect>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:cartoon:add']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
              >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:cartoon:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:cartoon:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:cartoon:error']" type="primary" size="mini" :disabled="!ids.length" @click="handleError"
              >添加到纠错
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:cartoon:addUpload']"
              type="primary"
              size="mini"
              :disabled="!ids.length"
              @click="handleAddUpload"
              >加入更新列表
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="mini" v-permisaction="['admin']" @click="handleBatchAdd"
              >批量新增漫画
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button :disabled="!ids.length" type="primary" size="mini" v-permisaction="['admin']" @click="handleBatchShow">批量显示</el-button>
          </el-col>
        </el-row>

        <el-table class="el_table" ref="elTable" v-loading="loading" border :data="cartoonList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column sortable="custom" width="90" fixed label="id" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column fixed label="漫画名" width="180" align="center" prop="name" />
          <el-table-column width="120" label="漫画封面" align="center" prop="pictureBase64">
            <template slot-scope="scope">
              <el-image 
                style="width: 100%; height: 100%"
                fit="contain"
                lazy
                :src="scope.row.pictureBase64"
                :preview-src-list="[scope.row.pictureBase64]">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column width="120" label="漫画别名" align="center" prop="aliasName" />
          <el-table-column width="120" label="作者" align="center" prop="author" />
          <el-table-column width="120" label="作者别名" align="center" prop="aliasAuthor" />
          <el-table-column width="120" label="分类" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.categoryId | arrFilter(['value', 'label'], categoryTypeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" label="标签" align="center" prop="tagNames" :show-overflow-tooltip="true" />
          <el-table-column sortable="custom" label="评分" align="center" prop="score" :show-overflow-tooltip="true" />
          <el-table-column sortable="custom" width="120" label="总浏览量" align="center" prop="view" :show-overflow-tooltip="true" />
          <el-table-column width="120" label="主角" align="center" prop="protagonist" />
          <el-table-column width="120" label="源站id" align="center" prop="sourceCartoonId" />
          <el-table-column width="120" label="采集规则名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.ruleId | arrFilter(['id', 'name'], ruleList) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="漫画状态" align="center" :formatter="cartoonState">
            <template slot-scope="scope">
              <span>{{ cartoonState(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采集状态" align="center" prop="sStatus" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.sStatus | arrFilter(['value', 'label'], collectionOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" label="热度" align="center" prop="heat" :show-overflow-tooltip="true" />
          <el-table-column width="120" label="书名拼音" align="center" prop="pinyin" />
          <el-table-column sortable="custom" width="120" label="总章节数" align="center" prop="chapterNum" :show-overflow-tooltip="true" />
          <el-table-column
            sortable="custom"
            width="120"
            label="空白章节数"
            align="center"
            prop="chapterCountErr"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="状态" align="center" prop="status" :formatter="showBookState">
            <template slot-scope="scope">
              <span>{{ showBookState(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="推荐" align="center" prop="recommend" :formatter="showBookRecommend">
            <template slot-scope="scope">
              <span>{{ showBookRecommend(scope.row) }}</span>
            </template>
          </el-table-column>

          <el-table-column sortable="custom" label="创建时间" align="center" prop="createdAt" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" label="更新时间" align="center" prop="updatedAt" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding flex-columns">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:cartoon:chapter']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleChapter(scope.row)"
                >章节
              </el-button>
              <el-button
                v-permisaction="['admin:cartoon:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改
              </el-button>
              <el-button
                v-permisaction="['admin:cartoon:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="60%">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="maskLoading">
            <el-row>
              <el-col :span="12">
                <el-form-item label="漫画名" prop="name">
                  <el-input v-model="form.name" placeholder="书名" />
                </el-form-item>
                <el-form-item label="别名" prop="aliasName">
                  <el-input v-model="form.aliasName" placeholder="别名" />
                </el-form-item>
                <el-form-item label="分类" prop="categoryId">
                  <el-select v-model="form.categoryId" clearable placeholder="请选择分类" size="small">
                    <el-option v-for="dict in categoryTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="地区" prop="areaId">
                  <el-select v-model="form.areaId" clearable placeholder="请选择地区" size="small">
                    <el-option v-for="dict in areaOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                  <el-input v-model="form.author" placeholder="作者" />
                </el-form-item>
                <el-form-item label="作者别名" prop="aliasAuthor">
                  <el-input v-model="form.aliasAuthor" placeholder="作者别名" />
                </el-form-item>
                <el-form-item label="主角" prop="protagonist">
                  <el-input v-model="form.protagonist" placeholder="主角" />
                </el-form-item>
                <el-form-item label="评分" prop="score">
                  <el-input-number
                    v-model.number="form.score"
                    style="width: 100%"
                    class="input_jd_box"
                    :precision="1"
                    :controls="false"
                    :min="0"
                    :max="10"
                    placeholder="评分 1-10分 保留一个小数点"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="热度" prop="heat">
                  <el-input v-model.number="form.heat" placeholder="热度(增加通过前端搜索页统计)" />
                </el-form-item>
                <el-form-item label="标签" prop="collectionNum">
                  <MultipleSelect :select-arr="tagList" v-model="form.tagIds"></MultipleSelect>
                  <el-button style="margin-left: 10px" type="primary" size="mini" @click="handleOpenTag">选择</el-button>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" clearable placeholder="请选择状态" size="small">
                    <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="漫画状态" prop="isEnd">
                  <el-select v-model="form.isEnd" clearable placeholder="请选择漫画状态" size="small">
                    <el-option v-for="dict in statusCartoonOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
                <el-form-item label="封面图" prop="picture">
                  <UploadImg
                    size-type="MB"
                    :size="5"
                    :limit-img-num="1"
                    :get-file-list="editImage"
                    @change="imgChange"
                    :before-remove-fun="beforeRemove"
                  ></UploadImg>
                </el-form-item>
                <el-form-item label="海报图" prop="posterPic">
                  <UploadImg
                    size-type="MB"
                    :size="5"
                    :limit-img-num="1"
                    :get-file-list="editImages"
                    @change="imgChanges"
                    :before-remove-fun="beforeRemoves"
                  ></UploadImg>
                </el-form-item>
                <el-form-item label="简介" prop="introduce">
                  <el-input v-model="form.introduce" type="textarea" :rows="6" resize="none" placeholder="简介" />
                </el-form-item>
                <el-form-item label="是否推荐" prop="recommend">
                  <el-select v-model="form.recommend" clearable placeholder="请选择推荐状态" size="small">
                    <el-option v-for="dict in recommendCartoonOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <SelTagDemo :open.sync="openTag" :tag-arr="tagList" v-model="form.tagIds"></SelTagDemo>
        <ChapterList :open.sync="openChapter" :form-data="formChapter" :ruleList="ruleList"></ChapterList>
        <batch-dialog 
          ref="batchDialog"
          title="批量新增漫画"
          v-if="showBatch"
          :show.sync="showBatch"
          :ruleList="ruleList"/>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addCartoon,
  delCartoon,
  getCartoon,
  listCartoon,
  updateCartoon,
  listCategory,
  addErrorCartoon,
  addUploadCartoon,
  ruleNameList,
  updateStatus,
} from '@/api/cartoon'
import { listTag } from '@/api/tag'
import { mapState } from 'vuex'
import UploadImg from '@/components/UploadImg'
import MultipleSelect from '@/components/MultipleSelect'
import ChapterList from './components/chapterList'
import { uploadOBSFun } from '@/utils/uploadObs'
import SelTagDemo from './components/selTag.vue'
import batchDialog from "./components/batchDialog.vue";

export default {
  name: 'Cartoon',
  components: {
    UploadImg,
    MultipleSelect,
    ChapterList,
    SelTagDemo,
    batchDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      fileOpen: false,
      fileIndex: undefined,
      // 类型数据字典
      typeOptions: [],
      cartoonList: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: '',
        author: '',
        status: undefined,
        recommend: undefined,
        isEnd: undefined,
        id: undefined,
        aliasName: '',
        aliasAuthor: '',
        protagonist: '',
        ruleId: undefined,
        sStatus: undefined,
        categoryId: undefined,
        tagIds: [],
        updatedAt: '',
        createdAt: '',
        idOrder: 'desc',
        areaId: "",
      },
      tagList: [],
      // 表单参数
      form: {},
      editImage: [],
      editImages: [],
      statusOptions: [
        {
          dictValue: 1,
          dictLabel: '显示'
        },
        {
          dictValue: 2,
          dictLabel: '不显示'
        }
      ],
      statusCartoonOptions: [
        {
          dictValue: 1,
          dictLabel: '已完结'
        },
        {
          dictValue: 2,
          dictLabel: '连载中'
        }
      ],
      recommendCartoonOptions: [
        {
          dictValue: 1,
          dictLabel: '推荐'
        },
        {
          dictValue: 2,
          dictLabel: '不推荐'
        }
      ],
      collectionOptions: [
        {
          value: 1,
          label: '待采集'
        },
        {
          value: 2,
          label: '采集中'
        }
      ],
      categoryTypeOptions: [],
      // 表单校验
      rules: {
        name: [{ required: true, message: '书名不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        isEnd: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      ruleList: [],
      categoryList: [],
      openChapter: false,
      formChapter: {},
      areaOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      maskLoading: false,
      openTag: false,
      showBatch: false,
    }
  },
  computed: {
    ...mapState('user', {
      dataDesKey: 'dataDesKey'
    }),
  },
  created() {
    window.vm = this;
    this.getAreaList()
    this.getList()
    this.getTagList()
    this.getCategoryList()
    this.getRuleNameList()
  },
  methods: {
    handleBatchShow() {
      updateStatus({ ids: this.ids.join() }).then(() => {
        this.msgSuccess(`批量显示处理成功`);
        this.getList();
      }).catch(() => {
        this.msgError("操作失败，请重试");
      });
    },
    async getRuleNameList() {
      const { data } = await ruleNameList({ pageSize: 9999, pageIndex: 1 })
      this.ruleList = data.list
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      const params = this.$XEUtils.clone(this.queryParams, true);
      if (params.areaId === 0) {
        params.areaId = -1;
      }
      if (params.areaId === "") {
        params.areaId = 0;
      }
      listCartoon(this.addDateRange(params, this.dateRange)).then(async (response) => {
        const list = response?.data?.list || [];
        await list.forEach(async item => this.$set(item, "pictureBase64", await this.cryptoCartoon.decrypt(item.picture)));
        this.cartoonList = list;
        this.total = response.data.count;
        this.loading = false;
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: '',
        aliasName: '',
        author: '',
        aliasAuthor: '',
        categoryId: undefined,
        areaId: 0,
        protagonist: undefined,
        score: undefined,
        heat: undefined,
        isEnd: undefined,
        picture: undefined,
        posterPic: undefined,
        introduce: undefined,
        tagIds: undefined,
        status: 1,
        recommend: 2,
      }
      this.editImage = []
      this.editImages = []
      this.resetForm('form')
    },
    getImgList: function () {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function () {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加漫画'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 修改章节操作
    handleChapter(row) {
      this.formChapter = { id: row.id, sort: row.chapterNum }
      this.openChapter = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getCartoon(id).then(async (response) => {
        if (response.data.picture) {
          let url = await this.cryptoCartoon.decrypt(response.data.picture)
          this.editImage = [{ url, urlRoute: response.data.picture }]
        } else {
          this.editImage = []
        }

        if (response.data.posterPic) {
          let url = await this.cryptoCartoon.decrypt(response.data.posterPic)
          this.editImages = [{ url, urlRoute: response.data.posterPic }]
        } else {
          this.editImages = []
        }
        this.form = response.data
        this.open = true
        this.title = '修改漫画'
        this.isEdit = true
      })
    },
    beforeRemove(url) {
      this.form.picture = ''
    },
    beforeRemoves(url) {
      this.form.posterPic = ''
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.maskLoading = true
          for (let item of this.editImage) {
            if (item.raw) {
              let data = await this.cryptoCartoon.encrypt(item.raw)
              let path
              if (this.isEdit) {
                path = await uploadOBSFun(data, `${Math.ceil(this.form.id / 2000)}/${this.form.id}/cover/${data.name}`)
              } else {
                path = await uploadOBSFun(data, 'static/cover/' + data.name)
              }
              let newPath = path === '' ? this.dataDesKey.obs.domain + '/' + 'static/nopicture.webp' : path
              item.urlRoute = this.replaceDomainUrl(newPath)
              let pictures = this.editImage.map((i) => i.urlRoute)
              this.form.picture = pictures.join('|')
            }
          }
          this.form.picture = this.replaceDomainUrl(this.form.picture)

          for (let item of this.editImages) {
            if (item.raw) {
              let data = await this.cryptoCartoon.encrypt(item.raw)
              let path
              if (this.isEdit) {
                path = await uploadOBSFun(data, `${Math.ceil(this.form.id / 2000)}/${this.form.id}/cover/${data.name}`)
              } else {
                path = await uploadOBSFun(data, 'static/cover/' + data.name)
              }
              let newPath = path === '' ? this.dataDesKey.obs.domain + '/' + 'static/nopicture.webp' : path
              item.urlRoute = this.replaceDomainUrl(newPath)
              let pictures = this.editImages.map((i) => i.urlRoute)
              this.form.posterPic = pictures.join('|')
            }
          }
          this.form.posterPic = this.replaceDomainUrl(this.form.posterPic)
          if (this.form.id !== undefined) {
            updateCartoon(this.form)
              .then((response) => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
              .finally(() => {
                this.maskLoading = false
              })
          } else {
            addCartoon(this.form)
              .then((response) => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
              .finally(() => {
                this.maskLoading = false
              })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delCartoon({ ids: Ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    handleError() {
      var Ids = this.ids
      this.$confirm('是否确认添加编号为"' + Ids + '"的到纠错?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return addErrorCartoon({ ids: Ids.join(',') })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('添加成功')
        })
    },
    handleAddUpload() {
      var Ids = this.ids
      this.$confirm('是否确认添加编号为"' + Ids + '"的到更新列表?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return addUploadCartoon({ ids: Ids.join(',') })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('添加成功')
        })
    },

    handleBatchAdd() {
      console.log("handleBatchAdd");
      this.showBatch = !this.showBatch;
    },
    /** 排序回调函数 */
    handleSortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      Object.keys(this.queryParams).forEach((i) => {
        if (/[a-zA-Z]*Order$/.test(i)) {
          this.queryParams[i] = undefined
        }
      })
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    async imgChange(img) {
      if (!img.length) {
        return
      }
      this.editImage = img
    },
    async imgChanges(img) {
      if (!img.length) {
        return
      }
      this.editImages = img
    },
    getTagList() {
      listTag({ pageIndex: 1, pageSize: 99999, status: 1 }).then((response) => {
        if (response.data.list.length) {
          this.tagList = response.data.list
        } else {
          this.tagList = []
        }
        this.tagList = response.data.list
      })
    },
    showBookState(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    showBookRecommend(row) {
      return this.selectDictLabel(this.recommendCartoonOptions, row.recommend)
    },
    cartoonState(row) {
      return this.selectDictLabel(this.statusCartoonOptions, row.isEnd)
    },
    getCategoryList() {
      var info = { pageIndex: 1, pageSize: 1000 }
      var _t = this
      _t.categoryTypeOptions = []
      listCategory(info).then((response) => {
        var clist = []
        for (var i in response.data.list) {
          let genderStr = response.data.list[i].gender === 1 ? '男' : '女'
          _t.categoryTypeOptions.push({
            value: response.data.list[i].id,
            label: response.data.list[i].name + ' (' + genderStr + ')',
            status: response.data.list[i].status
          })
          clist[response.data.list[i].id] = response.data.list[i].name
        }
        this.categoryList = clist
      })
    },
    async getAreaList() {
      const { data } = await this.getConfigKey('sys_cartoon_area')
      if (data.configValue) {
        this.areaOptions = JSON.parse(data.configValue)
      }
    },
    handleOpenTag() {
      this.openTag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.input_jd_box.el-input-number {
  .el-input__inner {
    text-align: left;
  }
}
::v-deep .el-table__row {
  td > .cell {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .flex-columns > .cell {
    flex-direction: column;
    button {
      margin-left: 0px;
    }
  }
}
</style>
