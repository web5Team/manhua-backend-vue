<template>
  <div>
    <el-form ref="formData" :inline="true" :model="formData" :rules="rulesPer" size="small">
      <el-form-item label="id" prop="id">
        <el-input
          v-model.number="formData.id"
          placeholder="请输入"
          clearable
          size="small"
          @blur="inputNumBlur('id')"
          @clear="inputNumBlur('id')"
          @keyup.enter.native="handleQuery"
        />
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
    <div style="margin-top: 15px">
      <el-button type="primary" size="mini" icon="el-icon-plus" v-permisaction="['admin:cartoonCar:add']" @click="add">新增</el-button>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-edit"
        v-permisaction="['admin:cartoonCar:edit']"
        :disabled="ids.length != 1"
        @click="edit"
        >修改</el-button
      >
      <el-button
        type="danger"
        size="mini"
        v-permisaction="['admin:cartoonCar:remove']"
        icon="el-icon-delete"
        :disabled="ids.length == 0"
        @click="deleteData"
        >删除</el-button
      >
    </div>

    <el-divider />

    <el-table
      ref="table"
      v-loading="loading"
      row-key="id"
      :data="bannerListTabel"
      border
      @selection-change="handleSelectionChange"
      @select-all="selectAll"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
      <el-table-column label="标题" fixed align="center" prop="name" />
      <el-table-column label="图片" align="center" width="130">
        <template slot-scope="scope">
          <img v-if="scope.row.path" class="banner_img" :src="scope.row.path" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="跳转位置" align="center" width="200" prop="jumpUrl" />
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
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="formData.pageIndex" :limit.sync="formData.pageSize" @pagination="getList" />
    <el-dialog
      ref="dialog"
      :title="title"
      :visible="open"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      destroy-on-close
      width="550px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="maskLoading">
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="标题" />
        </el-form-item>
        <el-form-item label="图片地址" prop="pictureUrl">
          <UploadImg size-type="MB" :size="5" :limit-img-num="1" :get-file-list="editImage" @change="imgChange" :before-remove-fun="beforeRemove"></UploadImg>
        </el-form-item>
        <el-form-item label="跳转地址" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="跳转地址" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio v-for="item in sexOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusSelect" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="sava">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listTemBanner, deleteTemBanner, addTemBanner, editTemBanner, temBannerDetail } from '@/api/moduleSet'
import UploadImg from '@/components/UploadImg'
import { uploadOBSFun} from '@/utils/uploadObs'

export default {
  name: 'CarouselMap',
  components: {
    UploadImg
  },
  props: {
    editForm: {
      type: Object,
      default: () => ({})
    },
    tabType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        templateId: undefined,
        columnId: undefined,
        id: undefined,
        status: undefined,
        pageIndex: 1,
        pageSize: 10
      },
      bannerListTabel: [],
      ids: [],
      loading: false,
      total: 0,
      statusSelect: [
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' }
      ],
      sexOptions: [
        { value: 1, label: '男' },
        { value: 2, label: '女' }
      ],
      open: false,
      isEdit: false,
      isAllSelect: false,
      selectArr: [],
      selecData: [],
      rulesPer: {
        id: [{ type: 'number', message: '请输入数字' }]
      },

      jumpOptions: [
        {
          value: 1,
          label: '漫画详情'
        },
        {
          value: 2,
          label: 'HTTP网页'
        }
      ],
      form: {
        templateId: undefined,
        name: '',
        columnId: '',
        gender: 1,
        pictureUrl: '',
        jumpUrl: '',
        status: 1
      },
      rules: {
        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
      },
      editImage: [],
      loadingInstance: null,
      maskLoading: false,
      isRequested: false
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑轮播图' : '新增轮播图'
    },
    api() {
      return this.isEdit ? editTemBanner : addTemBanner
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.resat()
      } else {
        this.form.templateId = this.editForm.id
        this.form.columnId = this.formData.columnId
        if (this.isEdit) {
          this.getEdit()
        }
      }
    },
    tabType(val) {
      if (val === 'third' && !this.isRequested) {
        this.isRequested = true
        if (this.editForm.id) {
          this.formData.templateId = this.editForm.id
          this.getList()
        }
      }
    }
  },
  created() {
    // if (this.editForm.id) {
    //   this.formData.templateId = this.editForm.id
    // }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    inputNumBlur(str) {
      if (this.formData[str] === '') {
        this.formData[str] = undefined
      }
    },
    handleQuery() {
      this.$refs.formData.validate(async(valid) => {
        if (valid) {
          this.formData.pageIndex = 1
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getList() {
      this.$refs.formData.validate(async(valid) => {
        if (valid) {
          this.loading = true
          try {
            const { data } = await listTemBanner(this.formData)
            if (data.list && data.list.length) {
              this.bannerListTabel = JSON.parse(JSON.stringify(data.list))
            } else {
              this.bannerListTabel = []
            }
            this.total = data.count
            this.loading = false
            let num = 0
            for(let item of data.list) {
              if(item.pictureUrl) {
                let path = await this.cryptoCartoon.decrypt(item.pictureUrl)
                item.path = path
                this.$set(this.bannerListTabel, num, item)
              }
              num++
            }
          } finally {
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset(name) {
      this.resetForm(name)
      this.handleQuery()
    },
    add(row) {
      if (row.id) {
        this.form.pid = row.id
      }
      this.isEdit = false
      this.open = true
    },
    edit(row) {
      this.form.id = row.id || this.ids[0]
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
        deleteTemBanner({ ids: Ids }).then((res) => {
          this.$message.success(res.msg)
          this.getList()
        })
      })
    },
    handleSelectionChange(selection) {
      let ids = []
      selection.forEach((item) => {
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
    // upStatus(row, status) {
    //   const statusName = status === 1 ? '启用' : '禁用'
    //   const ids = typeof row === 'string' ? row : String(row.id)
    //   this.$confirm(`是否修改id:${ids}的状态为${statusName}?`, '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     changeBannerStatusFeach({ ids, status: status, templateId: this.formData.templateId }).then(() => {
    //       this.$message.success('更新成功')
    //       this.getList()
    //     })
    //   })
    // },
    success() {
      this.getList()
      this.open = false
    },
    selectAll(selection) {
      const isSelect = selection.some((el) => {
        const tableDataIds = this.bannerListTabel.map((j) => j.id)
        return tableDataIds.includes(el.id)
      })
      if (isSelect) {
        selection.map((el) => {
          if (el.children) {
            el.children.map((j) => {
              this.toggleSelection(j, true)
            })
          }
        })
      } else {
        this.bannerListTabel.map((el) => {
          if (el.children) {
            el.children.map((j) => {
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
    // changeStatues(item) {
    //   const Ids = this.ids.join(',')
    //   this.upStatus(Ids, item.value)
    // },
    handleClose() {
      this.open = false
    },
    beforeRemove(url) {
      this.form.pictureUrl = ''
    },
    sava() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          // if (this.form.picturImages && /^https?:\/\/.+/.test(this.form.picturImages)) {
          //   delete this.form.picturImages
          // }
          this.maskLoading = true
          for(let item of this.editImage) {
            if (item.raw) {
              let data = await this.cryptoCartoon.encrypt(item.raw)
              let str = data.name.slice(0, 2)
              let path = await uploadOBSFun(data, 'static/banner/' + str + '/' + data.name)
              item.urlRoute = this.replaceDomainUrl(path)
              let pictures = this.editImage.map(i => i.urlRoute)
              this.form.pictureUrl = pictures.join('|')
            }
          }
          this.form.pictureUrl = this.replaceDomainUrl(this.form.pictureUrl)
          // const dialogPanel = this.$refs.dialog.$refs.dialog // dialog面板的dom节点
          // this.loadingInstance = this.$loading({
          //   target: dialogPanel
          // })
          const paramsObj = JSON.parse(JSON.stringify(this.form))
          paramsObj.jumpUrl = JSON.stringify({ type: 'detail', content: this.form.jumpUrl })
          this.api(paramsObj)
            .then((res) => {
              const msg = this.isEdit ? '修改成功' : '新增成功'
              if (res.code === 200) {
                this.$message.success(msg)
                this.success()
              }
            })
            .finally(() => {
              // this.loadingInstance.close()
              this.maskLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resat() {
      this.form = {
        templateId: this.editForm.id,
        name: '',
        columnId: '',
        gender: 1,
        pictureUrl: '',
        jumpUrl: '',
        status: 1
      }
      this.editImage = []
      this.$refs['form'].clearValidate()
    },
    imgChange(img) {
      if (!img || !img.length) {
        return
      }
      this.editImage = img
    },
    async getEdit() {
      const dialogPanel = this.$refs.dialog ? this.$refs.dialog.$refs.dialog : '' // dialog面板的dom节点
      if (dialogPanel) {
        this.loadingInstance = this.$loading({
          target: dialogPanel
        })
      }
      try {
        const { data } = await temBannerDetail(this.form.id, { id: this.form.id, templateId: this.formData.templateId })
        if (data.jumpUrl) {
          data.jumpUrl = JSON.parse(data.jumpUrl).content
        }
        this.form = data
        if (this.form.pictureUrl) {
          let url = await this.cryptoCartoon.decrypt(this.form.pictureUrl)
          this.editImage = [{ url, urlRoute: this.form.pictureUrl }]
        } else {
          this.editImage = []
        }
      } finally {
        if (dialogPanel) {
          this.loadingInstance.close()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.banner_img {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
}
</style>
