
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="请选择状态" size="small" @change="handleQuery">
              <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="queryParams.gender" clearable placeholder="请选择性别" size="small" @change="handleQuery">
              <el-option v-for="dict in genderSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:tag:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:tag:edit']"
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
              v-permisaction="['admin:tag:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          border
          :data="tagList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" fixed align="center" prop="id" sortable="custom" width="80" :show-overflow-tooltip="true" />
          <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="排序" align="center" prop="sort" :show-overflow-tooltip="true" />
          <el-table-column label="性别" align="center" prop="gender" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.gender | arrFilter(['value', 'label'], genderSelect) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题图" align="center" prop="titleUrl" width="100">
            <template slot-scope="scope">
              <img v-show="scope.row.titleUrl" class="table_img" :src="scope.row.titleUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="封面图" align="center" prop="coverUrl" width="100">
            <template slot-scope="scope">
              <img v-show="scope.row.coverUrl" class="table_img" :src="scope.row.coverUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['value', 'label'], statusSelect) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdAt" :show-overflow-tooltip="true" width="180" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" prop="updatedAt" :show-overflow-tooltip="true" width="180" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:tag:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:tag:remove']"
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
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="maskLoading">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="名称" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="99" />
              <div class="tips">数值越大位置越靠前，最大99，最小0</div>
            </el-form-item>
            <el-form-item label="标题图" prop="titlePicture">
              <UploadImg size-type="MB" :size="5" :limit-img-num="1" :get-file-list="editImage" @change="imgChange" :before-remove-fun="beforeRemove"></UploadImg>
            </el-form-item>
            <el-form-item label="封面图" prop="coverPicture">
              <UploadImg size-type="MB" :size="5" :limit-img-num="1" :get-file-list="editImages" @change="imgChanges" :before-remove-fun="beforeRemoves"></UploadImg>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="item in statusSelect" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="item in genderSelect" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addTag, delTag, listTag, updateTag } from '@/api/tag'
import UploadImg from '@/components/UploadImg'
import { uploadOBSFun} from '@/utils/uploadObs'

export default {
  name: 'Tag',
  components: {
    UploadImg
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
      tagList: [],
      editImage: [],
      editImages: [],
      // 关系表类型
      statusSelect: [
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' }
      ],
      genderSelect: [
        { value: 1, label: '男生' },
        { value: 2, label: '女生' },
        { value: 3, label: '不区分' }
      ],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        gender: undefined,
        idOrder: 'desc'
      },
      // 表单参数
      form: {
        status: 1,
        gender: 1,
        name: '',
        sort: 0,
        titlePicture: '',
        coverPicture: ''
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ]
      },
      maskLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listTag(this.addDateRange(this.queryParams, this.dateRange)).then(async response => {
        this.tagList = JSON.parse(JSON.stringify(response.data.list))
        this.total = response.data.count
        this.loading = false
        let num = 0
        for(let item of response.data.list) {
          if (item.titlePicture) {
            let path = await this.cryptoCartoon.decrypt(item.titlePicture)
            item.titleUrl = path
            this.$set(this.tagList, num, item)
          }
          if (item.coverPicture) {
            let paths = await this.cryptoCartoon.decrypt(item.coverPicture)
            item.coverUrl = paths
            this.$set(this.tagList, num, item)
          }
          num++
        }
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
        name: undefined,
        sort: 0,
        status: 1,
        gender: 1,
        titlePicture: undefined,
        coverPicture: undefined
      }
      this.editImage = []
      this.editImages = []
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
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
      this.title = '添加标签'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    beforeRemove(url) {
      this.form.titlePicture = ''
    },
    beforeRemoves(url) {
      this.editImages = []
      this.form.coverPicture = ''
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids[0]
      const dataArr = this.tagList.filter(i => i.id === id)
      if (dataArr.length) {
        const data = dataArr[0]
        if (data.titlePicture) {
          let url = await this.cryptoCartoon.decrypt(data.titlePicture)
          this.editImage = [{ url, urlRoute: data.titlePicture }]
        } else {
          this.editImage = []
        }
        if (data.coverPicture) {
          let url = await this.cryptoCartoon.decrypt(data.coverPicture)
          this.editImages = [{ url, urlRoute: data.coverPicture }]
        } else {
          this.editImages = []
        }
        this.form = { ...data }
        this.open = true
        this.title = '修改标签'
        this.isEdit = true
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.maskLoading = true
          for(let item of this.editImage) {
            if (item.raw) {
              let data = await this.cryptoCartoon.encrypt(item.raw)
              let path = await uploadOBSFun(data, 'static/tag/' + data.name)
              item.urlRoute = this.replaceDomainUrl(path)
              let picture = this.editImage.map(i => i.urlRoute)
              this.form.titlePicture = picture.join('|')
            }
          }
          this.form.titlePicture = this.replaceDomainUrl(this.form.titlePicture)

          for(let items of this.editImages) {
            if (items.raw) {
              let data = await this.cryptoCartoon.encrypt(items.raw)
              let path = await uploadOBSFun(data, 'static/tag/' + data.name)
              items.urlRoute = this.replaceDomainUrl(path)
              let pictures = this.editImages.map(i => i.urlRoute)
              this.form.coverPicture = pictures.join('|')
            }
          }
          this.form.coverPicture = this.replaceDomainUrl(this.form.coverPicture)

          delete this.form.titleUrl
          delete this.form.coverUrl
          if (this.form.id !== undefined) {
            updateTag(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }).finally(() => {
              this.maskLoading = false
            })
          } else {
            addTag(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }).finally(() => {
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
      }).then(function() {
        return delTag({ ids: Ids })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 排序回调函数 */
    handleSortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      Object.keys(this.queryParams).forEach(i => {
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
    imgChange(img) {
      if (!img.length) {
        return
      }
      this.editImage = img
    },
    imgChanges(img) {
      if (!img.length) {
        return
      }
      this.editImages = img
    }
  }
}
</script>

<style lang="scss" scoped>
.table_img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}
</style>
