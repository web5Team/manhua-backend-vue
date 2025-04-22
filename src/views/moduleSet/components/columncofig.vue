<template>
  <div>
    <el-form ref="formData" :inline="true" :rules="rules" :model="formData" size="small">
      <el-form-item label="id" prop="id">
        <el-input v-model.number="formData.id" placeholder="只能输入数字类型" clearable size="small" @blur="inputNumBlur" @clear="inputNumBlur" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="栏目名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入栏目名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" clearable placeholder="点击选择" size="small">
          <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top:15px">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add" v-permisaction="['admin:cartoonCol:add']">新增</el-button>
      <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="ids.length != 1" @click="edit" v-permisaction="['admin:cartoonCol:edit']">修改</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="ids.length == 0" @click="deleteData" v-permisaction="['admin:cartoonCol:remove']">删除</el-button>
      <el-dropdown style="margin-left: 10px;" @command="changeStatues" v-permisaction="['admin:cartoonCol:change']">
        <el-button type="primary" size="mini" :disabled="ids.length == 0">
          修改状态
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in statusSelect" :key="item.value" :command="item">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-divider />

    <el-table
      ref="table"
      v-loading="loading"
      row-key="id"
      :data="listTabel"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      @select="select"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="id" fixed sortable="custom" align="center" prop="id" :show-overflow-tooltip="true" />
      <el-table-column label="栏目名称" width="200" align="center" prop="name" />
      <el-table-column label="排序" align="center" sortable="custom" width="100" prop="sort" />
      <el-table-column label="是否推荐" align="center" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.isRecommend | arrFilter(['value', 'label'], recommendOptions) }}</span>
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
      <el-table-column label="操作" fixed="right" align="center" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)" v-permisaction="['admin:cartoonCol:edit']">修改</el-button>
          <el-button size="mini" type="text" @click="deleteData(scope.row)" v-permisaction="['admin:cartoonCol:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="formData.pageIndex" :limit.sync="formData.pageSize" @pagination="getList" />
    <el-dialog
      ref="dialog"
      :title="title"
      :visible.sync="open"
      :before-close="handleClose"
      :close-on-click-modal="false"
      destroy-on-close
      :append-to-body="true"
      width="550px"
    >
      <el-form ref="form" :model="form" :rules="secRules" size="small" label-width="90px">
          <el-form-item label="栏目名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入栏目名称" clearable size="small" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="99" />
            <div class="tips">数值越大位置越靠前，最大99，最小0</div>
          </el-form-item>
          <el-form-item label="是否推荐" prop="isRecommend">
            <el-radio-group v-model="form.isRecommend">
              <el-radio v-for="item in recommendOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="item in statusSelect" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="secSava">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { templateColumnListFeach, modifyTemplateColumnStatusFeach, delTemplateColumnFeach, addTemplateColumnFeach, editTemplateColumnFeach, templateColumnInfoFeach } from '@/api/moduleSet'

export default {
  name: 'ColumnList',
  components: {

  },
  props: {
    editForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        templateId: undefined,
        id: undefined,
        name: '',
        status: undefined,
        pageIndex: 1,
        pageSize: 10
      },
      rules: {
        id: [{ type: 'number', message: '请输入数字' }]
      },
      listTabel: [],
      ids: [],
      pidList: [],
      loading: false,
      total: 0,
      statusSelect: [{ value: 1, label: '启用' }, { value: 2, label: '禁用' }],
      recommendOptions: [{ value: 1, label: '是' }, { value: 2, label: '否' }],
      open: false,
      isEdit: false,
      isAllSelect: false,
      selectArr: [],
      selecData: [],
      pidSelect: [],
      pidSelectSec: [],
      form: {
        isRecommend: 2,
        templateId: undefined,
        name: '',
        sort: 0,
        status: 1
      },
      secRules: {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        isRecommend: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑栏目' : '新增栏目'
    },
    api() {
      return this.isEdit ? editTemplateColumnFeach : addTemplateColumnFeach
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.secResat()
      } else {
        if (this.isEdit) {
          this.getEdit()
        }
      }
    }
  },
  created() {
    this.formData.templateId = this.editForm.id
    this.form.templateId = this.editForm.id
    this.getList()
  },
  mounted() {
  },
  methods: {
    handleQuery() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.formData.pageIndex = 1
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    inputNumBlur() {
      if (this.formData.id === '') {
        this.formData.id = undefined
      }
    },
    async getList() {
      this.loading = true
      try {
        const { data } = await templateColumnListFeach(this.formData)
        this.listTabel = data.list
        this.total = data.count
      } finally {
        this.loading = false
      }
    },
    reset(name) {
      this.resetForm(name)
      this.handleQuery()
    },
    add(row) {
      this.isEdit = false
      this.open = true
    },
    edit(row) {
      if (row.id) {
        this.form = { id: row.id }
      } else {
        this.form = { id: this.ids[0] }
      }
      this.isEdit = true
      this.open = true
    },
    deleteData(row) {
      const Ids = row.id ? [row.id] : this.ids
      this.$confirm(`是否确认删除 ${Ids.join(',')} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const paramsObj = {
          templateId: this.formData.templateId,
          ids: Ids
        }
        delTemplateColumnFeach(paramsObj).then(res => {
          this.$message.success(res.msg)
          this.getList()
        })
      })
    },
    handleSelectionChange(selection) {
      let ids = []
      selection.forEach(item => {
        ids = ids.concat(item.id)
      })
      this.ids = ids
      this.selecData = selection
    },
    sortChange(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.formData[this.order] = undefined
      }
      if (order === 'descending') {
        this.formData[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.formData[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.formData[prop + 'Order'] = undefined
      }
      this.getList()
    },
    upStatus(row, status) {
      const objArr = this.statusSelect.filter(i => i.value === status)
      this.$confirm(`是否修改id:${row.join(',')}的状态为${objArr[0].label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyTemplateColumnStatusFeach({ ids: row, status }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    },
    success() {
      this.open = false
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    select(selection, row) {},
    selectAll(selection) {
      const isSelect = selection.some(el => {
        const tableDataIds = this.listTabel.map(j => j.Id)
        return tableDataIds.includes(el.Id)
      })
      if (isSelect) {
        selection.map(el => {
          if (el.children) {
            el.children.map(j => {
              this.toggleSelection(j, true)
            })
          }
        })
      } else {
        this.listTabel.map(el => {
          if (el.children) {
            el.children.map(j => {
              this.toggleSelection(j, false)
            })
          }
        })
      }
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.toggleRowSelection(row, select)
        })
      }
    },
    cancelAll() {
      this.$refs.table.clearSelection()
    },
    changeStatues(item) {
      const Ids = this.ids
      this.upStatus(Ids, item.value)
    },
    async selectClassifiVideoF(item) {
      await this.pidSelect.some(i => {
        if (i.id === item) {
          this.pidSelectSec = i.children
        }
        return i.id === item
      })
      this.handleQuery()
    },
    clearClassifiVideoF() {
      this.pidSelectSec = []
    },
    selectClassifiVideoS(item) {
      this.handleQuery()
    },
    handleClose() {
      this.open = false
    },
    secSava() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
          this.loadingInstance = this.$loading({
            target: dialogPanel
          })
          this.api(this.form)
            .then(res => {
              const msg = this.isEdit ? '修改成功' : '新增成功'
              if (res.code === 200) {
                this.$message.success(msg)
                this.open = false
                this.getList()
              }
            })
            .finally(() => {
              this.loadingInstance.close()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    secResat() {
      this.form = {
        isRecommend: 2,
        templateId: this.editForm.id,
        name: '',
        sort: 0,
        status: 1
      }
      this.$refs['form'].clearValidate()
    },
    async getEdit() {
      const dialogPanel = this.$refs.dialog ? this.$refs.dialog.$refs.dialog : '' // dialog面板的dom节点
      if (dialogPanel) {
        this.loadingInstance = this.$loading({
          target: dialogPanel
        })
      }
      try {
        const { data } = await templateColumnInfoFeach(this.form.id)
        this.form = data
      } finally {
        if (dialogPanel) {
          this.loadingInstance.close()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
