
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="queryParams.gender" clearable placeholder="请选择性别" size="small" @change="handleQuery">
              <el-option v-for="dict in genderOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
           <el-form-item label="权重" prop="weight">
            <el-input v-model="queryParams.weight" placeholder="请输入权重" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:category:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:category:edit']"
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
              v-permisaction="['admin:category:remove']"
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
          :data="categoryList"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" fixed align="center" prop="id" sortable="custom" width="80" :show-overflow-tooltip="true" />
          <el-table-column label="分类名" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="性别" align="center" prop="gender" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.gender | arrFilter(['value', 'label'], genderOptions) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="图片" align="center" prop="picture">
            <template slot-scope="scope">
              <img v-show="scope.row.picture" class="table_img" :src="scope.row.picture" alt="">
            </template>
          </el-table-column> -->
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status | arrFilter(['value', 'label'], statusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权重" align="center" prop="weight" sortable="custom" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:category:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:category:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
              <el-button
                v-permisaction="['admin:category:classTo']"
                size="mini"
                type="text"
                icon="el-icon-document-copy"
                @click="handleLabelRe(scope.row)"
              >分类关系
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
            <el-form-item label="权重" prop="weight">
              <el-input v-model="form.weight" placeholder="权重" />
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <UploadImg size-type="MB" :size="5"  :limit-img-num="1" :get-file-list="editImage" @change="imgChange" :before-remove-fun="beforeRemove"></UploadImg>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="item in genderOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="openJoin" width="500px" :close-on-click-modal="false">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="关联分类" prop="addtagname" style="width:80%;float: left;">
              <el-input v-model="addtagname" placeholder />
            </el-form-item>
            <el-button
              style="margin-left: 10px;margin-top: 5px;float: left;"
              type="primary"
              class="el-button el-button--success is-plain"
              size="mini"
              @click="addtag"
              >增加</el-button
            >
          </el-form>
          <div style="margin-top: 70px;width: 100%;">
            <el-tag
              v-for="(val, key) in category_tag"
              :key="key"
              :type="
                key % 5 == 0 && key == 0
                  ? ''
                  : key % 5 == 1
                  ? 'success'
                  : key % 5 == 2
                  ? 'info'
                  : key % 5 == 3
                  ? 'warning'
                  : key % 5 == 0 && key != 0
                  ? 'danger'
                  : ''
              "
              closable
              @close="deltag(val.id, key)"
              >{{ val.name }}</el-tag
            >
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="canceltag">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addCategory, delCategory, getCategory, listCategory, updateCategory, listCategoryMapp, addCategoryMapp, delCategoryMapp } from '@/api/category'
import UploadImg from '@/components/UploadImg'
import { uploadOBSFun} from '@/utils/uploadObs'

export default {
  name: 'Category',
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
      categoryList: [],
      editImage: [],
      // 关系表类型
      genderOptions: [
        { value: 1, label: '男生' },
        { value: 2, label: '女生' }
      ],
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '禁用' }
      ],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        weight: undefined,
        gender: undefined,
        name: undefined,
        idOrder: 'desc'
      },
      // 表单参数
      form: {
        gender: 1,
        name: undefined,
        picture: undefined,
        weight: undefined,
        status: 1
      },
      // 表单校验
      rules: {
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请填写权重', trigger: 'blur' }
        ]
      },
      openJoin: false,
      addtagcategory_id: undefined,
      addtagname: '',
      category_tag: [],
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
      listCategory(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.categoryList = response.data.list
        this.total = response.data.count
        this.loading = false
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
        gender: 1,
        name: undefined,
        pinyin: undefined,
        picture: undefined,
        keywords: undefined,
        description: undefined,
        weight: undefined,
        status: 1
      }
      this.editImage = []
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
      this.title = '添加分类'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
      row.id || this.ids
      getCategory(id).then(async response => {
        if (response.data.picture) {
          let url = await this.cryptoCartoon.decrypt(response.data.picture)
          this.editImage = [{ url, urlRoute: response.data.picture }]
        } else {
          this.editImage = []
        }
        this.form = response.data
        this.open = true
        this.title = '修改分类'
        this.isEdit = true
      })
    },
    beforeRemove(url) {
      this.form.picture = ''
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.maskLoading = true
          for(let item of this.editImage) {
            if (item.raw) {
              let data = await this.cryptoCartoon.encrypt(item.raw)
              let path = await uploadOBSFun(data, 'static/cate/' + data.name)
              item.urlRoute = this.replaceDomainUrl(path)
              let pictures = this.editImage.map(i => i.urlRoute)
              this.form.picture = pictures.join('|')
            }
          }
          this.form.picture = this.replaceDomainUrl(this.form.picture)
          this.form.weight = parseInt(this.form.weight)
          if (this.form.id !== undefined) {
            updateCategory(this.form).then(response => {
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
            addCategory(this.form).then(response => {
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
        return delCategory({ ids: Ids })
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
    handleLabelRe(row) {
      this.openJoin = true
      const Ids = row.id || this.ids
      const _t = this
      _t.addtagcategory_id = Ids
      _t.addtagname = ''
      listCategoryMapp(this.addDateRange({ pageIndex: 1, pageSize: 100, categoryId: Ids }, this.dateRange)).then(response => {
        _t.category_tag = response.data.list
      })
    },
    addtag() {
      if (this.addtagname === '') {
        this.$message.warning('请输入')
        return
      }
      const _t = this
      addCategoryMapp({ categoryId: this.addtagcategory_id, name: this.addtagname }).then(response => {
        this.msgSuccess('增加成功')
        listCategoryMapp({ pageIndex: 1, pageSize: 100, categoryId: _t.addtagcategory_id }).then(response => {
          _t.category_tag = response.data.list
        })
      })
    },
    deltag(id, key) {
      var _t = this
      delCategoryMapp({ ids: [id] }).then(response => {
        this.msgSuccess('删除成功')
        _t.category_tag.splice(key, 1)
      })
    },
    canceltag() {
      this.openJoin = false
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
