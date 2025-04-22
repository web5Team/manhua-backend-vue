
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="id" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="queryParams.nickname" placeholder="请输入昵称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <!-- <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="queryParams.email" placeholder="请输入电子邮箱" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item> -->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="queryParams.gender" placeholder="请选择" clearable size="small">
              <el-option
                v-for="dict in genderOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="登录ip" prop="loginip">
            <el-input v-model="queryParams.loginip" placeholder="请输入登录ip" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" prop="appId">
            <appNameCon :select-val.sync="queryParams.appId"></appNameCon>
          </el-form-item>
          <el-form-item label="设备号" prop="device">
            <el-input v-model="queryParams.device" placeholder="请输入设备号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="头像状态" prop="avatarStatus">
            <el-select v-model="queryParams.avatarStatus" placeholder="请选择" clearable size="small">
              <el-option
                v-for="dict in avatarOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
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
              v-permisaction="['admin:member:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:member:edit']"
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
              v-permisaction="['admin:member:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-dropdown v-permisaction="['admin:member:avatarBtn']" style="margin-left: 10px;" @command="changeAvatarStatues">
              <el-button type="primary" size="mini" :disabled="multiple">
                头像审核
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in avatarOptions" :key="item.dictValue" :command="item">{{ item.dictLabel }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>

        <el-table v-loading="loading" border :data="memberList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" align="center" prop="id" sortable="custom" fixed :show-overflow-tooltip="true" />
          <el-table-column label="用户名" align="center" prop="username" :show-overflow-tooltip="true" width="120" />
          <el-table-column label="昵称" align="center" prop="nickname" :show-overflow-tooltip="true" width="120" />
          <!-- <el-table-column label="电子邮箱" align="center" prop="email" :show-overflow-tooltip="true" width="160" /> -->
          <el-table-column label="手机号" align="center" prop="mobile" :show-overflow-tooltip="true" width="120" />
          <el-table-column label="头像" align="center">
            <template slot-scope="scope">
              <img v-show="scope.row.avatarUrl" class="img_table" :src="scope.row.avatarUrl" />
            </template>
          </el-table-column>
          <el-table-column label="待审核头像" align="center" width="90">
            <template slot-scope="scope">
              <img v-show="scope.row.avatarTmpUrl" class="img_table" :src="scope.row.avatarTmpUrl" />
            </template>
          </el-table-column>
          <el-table-column label="头像状态" align="center" :formatter="avatarFormat" width="100">
            <template slot-scope="scope">
              {{ avatarFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" :formatter="genderFormat" width="100">
            <template slot-scope="scope">
              {{ genderFormat(scope.row ) }}
            </template>
          </el-table-column>
          <el-table-column label="登录时间" align="center" prop="email" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.logintime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="登录ip" align="center" prop="loginip" :show-overflow-tooltip="true" />
          <el-table-column label="登录类型" align="center" prop="platform" :show-overflow-tooltip="true" />
          <el-table-column label="设备号" align="center" prop="device" :show-overflow-tooltip="true" width="180" />
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" width="100">
            <template slot-scope="scope">
              {{ statusFormat(scope.row) }}
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
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:member:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:member:remove']"
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
        <el-dialog :title="title" :visible.sync="open" width="60%">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-loading="maskLoading">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="form.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <!-- <el-form-item label="电子邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入电子邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="form.password" placeholder="登录密码" type="password" @blur="checkPassword" />
                </el-form-item>
                <el-form-item label="重复密码" prop="repeatPassword">
                  <el-input v-model="form.repeatPassword" placeholder="重复密码" type="password" @blur="checkPassword" />
                </el-form-item> -->
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="form.mobile" placeholder="手机号" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="form.gender" placeholder="点击选择">
                    <el-option label="未知" :value="0" />
                    <el-option v-for="dict in genderOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="头像">
                  <UploadImg size-type="MB" :size="5" :limit-img-num="1" :get-file-list="editImage" @change="imgChange"></UploadImg>
                </el-form-item>
                <el-form-item label="应用名称" prop="appId">
                  <appNameCon :select-val.sync="form.appId"></appNameCon>
                </el-form-item>
                <el-form-item label="上次登录时间" prop="logintime">
                  <el-date-picker v-model="form.logintime" disabled type="datetime" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- <FileChoose ref="fileChoose" :dialog-form-visible="fileOpen" @confirm="getImgList" @close="fileClose" /> -->
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addMember, delMember, getMember, listMember, updateMember, examineUserAvatarFeach } from '@/api/member'
import appNameCon from '@/components/AppNameCON'
import UploadImg from '@/components/UploadImg'
import { uploadOBSFun} from '@/utils/uploadObs'

export default {
  name: 'Member',
  components: {
    appNameCon,
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
      // 是否为必填
      isRequired: true,
      // 是否显示弹出层
      open: false,
      isEdit: false,
      fileOpen: false,
      fileIndex: undefined,
      // 类型数据字典
      typeOptions: [],
      memberList: [],
      statusOptions: [],
      genderOptions: [{ dictValue: 1, dictLabel: '男生' }, { dictValue: 2, dictLabel: '女生' }],
      avatarOptions: [{ dictValue: 1, dictLabel: '已审核' }, { dictValue: 2, dictLabel: '未审核' }, { dictValue: 3, dictLabel: '审核不通过' }],
      // 关系表类型
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        email: undefined,
        status: undefined,
        id: undefined,
        nickname: undefined,
        mobile: undefined,
        gender: undefined,
        loginip: undefined,
        device: undefined,
        avatarStatus: undefined,
        idOrder: 'desc'
      },
      // 表单参数
      form: {
      },
      editImage: [],
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键id不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '登录密码不能为空', trigger: 'blur' }],
        repeatPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }],
        appId: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      maskLoading: false
    }
  },
  watch: {
    isRequired(val) {
      this.$set(this.rules.password[0], 'required', val)
      this.$set(this.rules.repeatPassword[0], 'required', val)
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_common_status').then(response => {
      this.statusOptions = response.data
      for (var i = 0; i < this.statusOptions.length; i++) {
        this.statusOptions[i].dictValue = parseInt(this.statusOptions[i].dictValue)
      }
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listMember(this.addDateRange(this.queryParams, this.dateRange)).then(async response => {
        this.memberList = JSON.parse(JSON.stringify(response.data.list))
        this.total = response.data.count
        this.loading = false
        let num = 0
        for(let item of response.data.list) {
          if (item.avatar) {
            let url = await this.cryptoCartoon.decrypt(item.avatar)
            item.avatarUrl = url
            this.$set(this.memberList, num, item)
          }
          if (item.avatarTmp) {
            let urls = await this.cryptoCartoon.decrypt(item.avatarTmp)
            item.avatarTmpUrl = urls
            this.$set(this.memberList, num, item)
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
        username: undefined,
        password: undefined,
        repeatPassword: undefined,
        email: undefined,
        status: 1,
        avatar: undefined,
        gender: 1,
        mobile: undefined,
        nickname: undefined,
        createdTime: undefined,
        logintime: undefined,
        appId: undefined,
        updatedTime: undefined
      }
      this.editImage = []
      this.resetForm('form')
    },
    // 验证两次输入密码
    checkPassword() {
      if (typeof this.form.password !== 'undefined') {
        if (this.form.password.length < 6 || this.form.password.length > 20) {
          this.$message({
            message: '请输入6-20位登录密码',
            type: 'error'
          })
          return false
        }
      }

      if (typeof this.form.repeatPassword !== 'undefined') {
        if (this.form.repeatPassword.length < 6 || this.form.repeatPassword.length > 20) {
          this.$message({
            message: '请输入6-20位重复密码',
            type: 'error'
          })
          return false
        }
      }

      if (this.form.password !== this.form.repeatPassword) {
        this.$message({
          message: '两次输入密码不一致',
          type: 'error'
        })
        return false
      }
      return true
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    imgChange(img) {
      if (!img.length) {
        return
      }
      this.editImage = img
    },
    fileClose: function() {
      this.fileOpen = false
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    genderFormat(row) {
      return this.selectDictLabel(this.genderOptions, row.gender)
    },
    avatarFormat(row) {
      return this.selectDictLabel(this.avatarOptions, row.avatarStatus)
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
      this.title = '添加会员管理'
      this.isEdit = false
      this.isRequired = true
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
      getMember(id).then(async response => {
        if (response.data.avatar) {
          let url = await this.cryptoCartoon.decrypt(response.data.avatar)
          this.editImage = [{ url, urlRoute: response.data.avatar }]
        } else {
          this.editImage = []
        }
        const data = response.data
        data.password = ''
        data.repeatPassword = ''
        this.form = data
        this.open = true
        this.title = '修改会员管理'
        this.isEdit = true
        this.isRequired = false
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.maskLoading = true
          for(let item of this.editImage) {
            if (item.raw) {
              let data = await this.cryptoCartoon.encrypt(item.raw)
              let str = data.name.slice(0, 2)
              let path = await uploadOBSFun(data, 'static/avatar/' + str + '/' + data.name)
              item.urlRoute = this.replaceDomainUrl(path)
              let pictures = this.editImage.map(i => i.urlRoute)
              this.form.avatar = pictures.join('|')
            }
          }
          this.form.avatar = this.replaceDomainUrl(this.form.avatar)
          if (this.form.id !== undefined) {
            updateMember(this.form).then(response => {
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
            if (!this.checkPassword()) {
              return
            }
            addMember(this.form).then(response => {
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
    changeAvatarStatues(item) {
      const ids = this.ids.join(',')
      this.upStatus(ids, item.dictValue)
    },
    upStatus(row, status) {
      const statusObj = this.avatarOptions.filter(i => i.dictValue === status)
      const devicesArr = []
      const appIdsArr = []
      this.memberList.forEach(i => {
        this.ids.forEach(k => {
          if (i.id === k) {
            devicesArr.push(i.device)
            appIdsArr.push(i.appId)
          }
        })
      })
      const ids = typeof row === 'string' ? row : String(row.id)
      this.$confirm(`是否修改id:${ids}的状态为${statusObj[0].dictLabel}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        examineUserAvatarFeach({ ids: this.ids, avatarStatus: status, devices: devicesArr.join(','), appIds: appIdsArr.join(',') }).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
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
        return delMember({ ids: Ids })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.img_table {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
  object-fit: cover;
}
</style>
