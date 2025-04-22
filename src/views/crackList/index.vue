<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="formData" :inline="true" :model="formData" size="small">
          <el-form-item label="id" prop="id">
            <el-input
              v-model.number="formData.id"
              placeholder="请输入id"
              clearable
              size="small"
              @input="() => enterNumber(formData.id, formData, 'id')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备号" prop="device">
            <el-input v-model="formData.device" placeholder="请输入设备号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="应用id" prop="appId">
            <el-input
              v-model.number="formData.appId"
              placeholder="请输入应用id"
              clearable
              size="small"
              @input="() => enterNumber(formData.appId, formData, 'appId')"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="使用时长" prop="appTime">
            <div class="item_label_box">
              <el-select v-model="formData.appTimeType" clearable placeholder="选择" size="small">
                <el-option v-for="dict in scoreOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
              <el-input
                v-model.number="formData.appTime"
                placeholder="请输入使用时长"
                clearable
                size="small"
                @input="() => enterNumber(formData.appTime, formData, 'appTime')"
                @keyup.enter.native="handleQuery"
              />
            </div>
          </el-form-item>
          <el-form-item label="触发次数" prop="determineNum">
            <div class="item_label_box">
              <el-select v-model="formData.determineNumType" clearable placeholder="选择" size="small">
                <el-option v-for="dict in scoreOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
              <el-input
                v-model.number="formData.determineNum"
                placeholder="请输入触发次数"
                clearable
                size="small"
                @input="() => enterNumber(formData.determineNum, formData, 'determineNum')"
                @keyup.enter.native="handleQuery"
              />
            </div>
          </el-form-item>
          <el-form-item label="观看广告次数" prop="adNum">
            <div class="item_label_box">
              <el-select v-model="formData.adNumType" clearable placeholder="选择" size="small">
                <el-option v-for="dict in scoreOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
              <el-input
                v-model.number="formData.adNum"
                placeholder="请输入观看广告次数"
                clearable
                size="small"
                @input="() => enterNumber(formData.adNum, formData, 'adNum')"
                @keyup.enter.native="handleQuery"
              />
            </div>
          </el-form-item>
          <el-form-item label="app版本" prop="versionName">
            <el-input v-model="formData.versionName" placeholder="请输入app版本" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="锁定状态" prop="state">
            <el-select v-model="formData.state" clearable placeholder="点击选择" size="small">
              <el-option v-for="dict in statusSelect" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" size="mini" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset('formData')">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: 15px">
          <el-button
            v-permisaction="['crackList:btn:remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="!ids.length"
            @click="deleteData"
            >删除</el-button
          >
          <el-dropdown v-permisaction="['crackList:status:change']" style="margin-left: 10px" @command="changeStatues">
            <el-button type="primary" size="mini" :disabled="!ids.length">
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
          @selection-change="handleSelectionChange"
          @select-all="selectAll"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="id" fixed sortable="custom" width="80" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="设备号" align="center" prop="device" :show-overflow-tooltip="true" />
          <el-table-column label="应用id" align="center" width="130" prop="appId" />
          <el-table-column label="App版本" align="center" width="120" prop="versionName" :show-overflow-tooltip="true" />
          <el-table-column label="使用时长" align="center" width="120" prop="appTime" sortable="custom" :show-overflow-tooltip="true" />
          <el-table-column label="看广告次数" align="center" width="130" prop="adNum" sortable="custom" />
          <el-table-column label="触发次数" align="center" width="130" prop="determineNum" sortable="custom" />
          <el-table-column label="锁定状态" align="center" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.state | arrFilter(['value', 'label'], statusSelect) }}</span>
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
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="formData.pageIndex"
          :limit.sync="formData.pageSize"
          @pagination="getList"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { getCarackListFeach, changeCarackStatusFeach, delCarackFeach } from '@/api/crackList'

export default {
  name: 'CrackList',
  components: {},
  data() {
    return {
      formData: {
        id: undefined,
        device: '',
        appId: undefined,
        determineNumType: '',
        determineNum: undefined,
        adNumType: '',
        adNum: undefined,
        versionName: '',
        appTimeType: '',
        appTime: undefined,
        state: undefined,
        pageIndex: 1,
        pageSize: 10,
        sort: 'id',
        order: 'descending'
      },
      listTabel: [],
      ids: [],
      loading: false,
      total: 0,
      statusSelect: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '锁定'
        }
      ],
      scoreOptions: [
        {
          value: '=',
          label: '='
        },
        {
          value: '!=',
          label: '!='
        },
        {
          value: '>',
          label: '>'
        },
        {
          value: '<',
          label: '<'
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
        }
      ],
      selecData: []
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    handleQuery() {
      this.formData.pageIndex = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      try {
        const { data } = await getCarackListFeach(this.formData)
        if (data.list && data.list.length) {
          this.listTabel = data.list
        } else {
          this.listTabel = []
        }
        this.total = data.count
      } finally {
        this.loading = false
      }
    },
    changeStatues(item) {
      const Ids = this.ids.join(',')
      this.upStatus(Ids, item.value)
    },
    reset(name) {
      this.formData.determineNumType = ''
      this.formData.adNumType = ''
      this.formData.appTimeType = ''
      this.resetForm(name)
      this.handleQuery()
    },
    deleteData() {
      this.$confirm(`是否确认删除 ${this.ids} 数据项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCarackFeach(this.ids.join(',')).then((res) => {
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
    sortChange(data) {
      this.formData.sort = data.prop
      this.formData.order = data.order || 'descending'
      this.getList()
    },
    selectAll(selection) {
      const isSelect = selection.some((el) => {
        const tableDataIds = this.listTabel.map((j) => j.Id)
        return tableDataIds.includes(el.Id)
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
        this.listTabel.map((el) => {
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
    upStatus(row, status) {
      const statusObj = this.statusSelect.filter((i) => i.value === status)
      const ids = typeof row === 'string' ? row : String(row.id)
      this.$confirm(`是否修改id:${ids}的状态为${statusObj[0].label}?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          ids: ids,
          state: status
        }
        changeCarackStatusFeach(params).then(() => {
          this.$message.success('更新成功')
          this.getList()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item_label_box {
  display: inline-flex;
  .el-select {
    width: 80px;
    margin-right: 5px;
  }
  .el-input {
    width: 199px;
  }
}
.user_img_icon {
  width: 60px;
  height: 60px;
  display: block;
}
.del_mess_tip_box {
  .tip_txt {
    line-height: 30px;
    padding-bottom: 10px;
  }
}
.disable_mess_tip_box {
  .tip_txt {
    line-height: 30px;
    padding-bottom: 10px;
  }
}
</style>
