<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
          <el-form-item label="规则名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入规则名称,按回车搜索"
              clearable
              size="small"
              style="width: 250px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="状态">
              <el-option v-for="dict in statuslOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:crawlerRule:add']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:crawlerRule:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:crawlerRule:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="crawlerruleList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" width="80" align="center" prop="id" sortable="custom" />
          <el-table-column label="采集规则名称" width="200" align="center" prop="name" />
          <el-table-column label="采集编码" align="center" prop="charset" />
          <el-table-column label="状态" align="center" prop="status" :formatter="showStatus" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:crawlerRule:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                v-permisaction="['admin:crawlerRule:edit']"
                size="mini"
                type="text"
                icon="el-icon-check"
                @click="handleTest(scope.row)"
                >测试规则</el-button
              >
              <el-button
                v-permisaction="['admin:crawlerRule:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
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
        <el-dialog :title="title" :visible.sync="open" width="1000px" :close-on-click-modal="false">
          <el-form ref="form" :model="form" :rules="rules" label-width="220px" label-position="left">
            <el-form-item label="采集规则名称" prop="name">
              <el-input v-model="form.name" style="width: 50%" placeholder="采集规则名称" />
            </el-form-item>
            <el-form-item label="采集编码">
              <el-select v-model="form.charset" clearable placeholder="请选择采集编码">
                <el-option v-for="item in charsetOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="chromedp节点地址" prop="chromedpNode" v-show="form.type === 1">
              <el-input v-model="form.chromedpNode" style="width: 50%" placeholder="chromedp节点地址" />
            </el-form-item>
            <el-form-item label="采集规则状态" prop="status">
              <el-radio-group v-model="form.status" placeholder="请选择">
                <el-radio v-for="dict in statusOptions" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="采集规则类型" prop="type">
              <el-radio-group v-model="form.type" placeholder="请选择" @change="handleCrawlerType">
                <el-radio v-for="dict in typeOptions" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane
                v-for="(value, key) in ruleHmtl"
                :key="ruleTypeVariable[key].value"
                :label="ruleTypeVariable[key].value"
                :name="key"
              >
                <div v-for="(val, ke) in value" :key="ke">
                  <div v-if="Array.isArray(val)">
                    <el-form-item :label="ruleTypeVariable[ke]" style="margin-left: -220px">
                      <div v-for="(v, k) in val" :key="k" style="margin-bottom: 5px">
                        <el-form-item
                          :label="v.title != '' && typeof v.title != 'undefined' ? v.title + '(' + v.field + ')' : v.field"
                          :prop="v.field"
                        >
                          <el-input v-model="ruleHmtl[key][ke][k].locator" style="width: 70%" :value="v.locator" placeholder />
                          <span>{{ v.comment != '' && typeof v.comment != 'undefined' ? '' + v.comment : '' }}</span>
                        </el-form-item>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <el-form-item
                      :label="
                        typeof ruleTypeVariable[key].p[ke] == 'string'
                          ? ruleTypeVariable[key].p[ke] + '(' + ke + ')'
                          : ruleTypeVariable[key].p[ke].value
                          ? ruleTypeVariable[key].p[ke].value + '(' + ke + ')'
                          : ke
                      "
                      style="margin-bottom: 5px"
                    >
                      <div v-if="ruleTypeVariable[key].p[ke].type == 'text'">
                        <el-input v-model="ruleHmtl[key][ke]" type="textarea" style="width: 70%" :value="val" placeholder />
                      </div>
                      <div v-if="ruleTypeVariable[key].p[ke].type != 'text'">
                        <el-input v-model="ruleHmtl[key][ke]" style="width: 70%" :value="val" placeholder />
                      </div>
                      <span>{{
                        typeof ruleTypeVariable[key].p[ke].comment == 'string' ? '' + ruleTypeVariable[key].p[ke].comment : ''
                      }}</span>
                    </el-form-item>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button type="success" @click="handleTest">测试规则</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 测试规则对话框 -->
        <el-dialog title="测试规则" :visible.sync="openTest" width="500px" :close-on-click-modal="false">
          <el-form ref="formTest" :model="formTest" :rules="testFormRule">
            <el-form-item label="源站漫画编号" prop="sourceCartoonId" label-width="120px">
              <el-input v-model.number="formTest.sourceCartoonId" autocomplete="off" placeholder="请输入源站漫画编号" />
            </el-form-item>
            <el-form-item label="源站章节编号" prop="chapterId" label-width="120px">
              <el-input v-model.number="formTest.chapterId" autocomplete="off" placeholder="请输入源站章节编号" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitTestForm">确 定</el-button>
            <el-button @click="cancelTestDialog">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listCrawlerRule, getCrawlerRule, delCrawlerRule, addCrawlerRule, updateCrawlerRule, testCrawlerRule } from '@/api/crawler-rule'

export default {
  name: 'CrawlerRule',
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
      statusOptions: [
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' }
      ],
      charsetOptions: [
        { value: 'UTF-8', label: 'UTF-8' },
        { value: 'GBK', label: 'GBK' },
        { value: 'GB2312', label: 'GB2312' }
      ],
      statuslOptions: [
        { value: undefined, label: '请选择' },
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' }
      ],
      typeOptions: [
        { value: 1, label: 'html' },
        { value: 2, label: 'json' }
      ],
      rulekeytov: {
        update_list: {
          value: '更新列表规则',
          p: {
            urls: { value: '更新列表地址', comment: '多个换行，一行一个', type: 'text' },
            container: '信息模块'
          }
        },
        cartoon_info: { value: '漫画信息规则', p: { url: '源站url' } },
        chapter_list: {
          value: '章节列表规则',
          p: { urls: '章节列表地址', container: '章节列表容器', is_reverse_order: { value: '章节是否倒序', comment: '0为否1为是' } }
        },
        chapter_content: {
          value: '章节内容规则',
          p: {
            container: '章节内容容器',
            picture: { value: '漫画图片' },
            content_page: '分页规则',
            content_page_url: '分页url'
          }
        }
      },
      rulekeytovJson: {
        update_list: { value: '更新列表规则', p: { urls: { value: '更新列表地址', comment: '多个换行，一行一个', type: 'text' } } },
        cartoon_info: { value: '漫画信息规则', p: { url: '源站url' } },
        chapter_list: { value: '章节列表规则', p: { url: '章节列表地址' } },
        chapter_content: { value: '章节内容规则', p: { url: '章节内容容器' } }
      },
      ruleTypeVariable: {},
      activeName: 'update_list',
      ruleHmtl: {},
      // 是否显示弹出层
      open: false,
      openTest: false,
      isEdit: false,
      crawlerruleList: [],
      // 测试规则id
      testRuleId: 0,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        idOrder: 'desc'
      },
      // 表单参数
      form: {},
      formTest: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键id不能为空', trigger: 'blur' }],
        rule: [{ required: true, message: '爬取规则不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '请选择采集状态', trigger: 'blur' }],
        type: [{ required: true, message: '请选择采集类型', trigger: 'blur' }]
      },
      testFormRule: {
        sourceChapterId: [{ required: true, message: '源站漫画编号不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listCrawlerRule(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
        this.crawlerruleList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    cancelTestDialog() {
      this.openTest = false
      this.resetTestForm()
    },
    // 表单重置
    reset() {
      this.form = {
        createdTime: undefined,
        id: undefined,
        name: undefined,
        type: 1,
        rule: undefined,
        status: undefined,
        chromedpNode: '',
        updatedTime: undefined
      }
      this.resetForm('form')
    },
    resetTestForm() {
      this.formTest = {
        sourceCartoonId: undefined,
        chapterId: undefined
      }
      this.resetForm('formTest')
    },
    htmlEscape(text) {
      text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      text = text.replace(/<[^<>]+>/g, '')
      alert(text.replace(/="/g, '"'))
      text = text.replace(/"/g, '\\"')
      return text
    },
    showStatus(row) {
      if (row.status === 1) {
        return '启用'
      } else if (row.status === 2) {
        return '禁用'
      } else {
        return '未知'
      }
    },
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
    handleCrawlerType(val) {
      this.setRuleMatch(val)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加采集规则'
      this.isEdit = false
      this.form.status = 1
      this.setRuleMatch(this.form.type)
    },
    setRuleMatch(num) {
      if (num === 1) {
        this.ruleHmtl = JSON.parse(
          '{"update_list": {"urls": "http://m.pfmh.net/manhua/update.html","container": "<li>[\\\\n \\\\n\\\\r \\\\t .*]+<div class=\\"order\\">\\\\d+</div>[\\\\n \\\\n\\\\r \\\\t .*]+<a .*[\\\\n \\\\r \\\\t .*]+</li>","columns": [{"field": "name","title": "漫画名","comment": "","locator": "<h3>(.*?)</h3>"}, {"field": "author","title": "作者","comment": "","locator": "<dl><dt>作　者：</dt><dd>(.*?)</dd></dl><dl>"}, {"field": "category","title": "所属分类","comment": "","locator": "<dl><dt>类　别：</dt><dd><a href=\\".*?\\">(.*?)</a></dd></dl>"}, {"field": "cartoon_id","title": "漫画编号","comment": "","locator": "<a href=\\"/manhua/(\\\\d+)/index.html\\">"}, {"field": "intro_url","title": "书籍详情页","comment": "","locator": "<a href=\\"(.*)\\"><div class=\\"thumb\\""}, {"field": "chapter_url","title": "章节列表页","comment": "","locator": "<a href=\\"(.*)\\"><div class=\\"thumb\\""}]},"cartoon_info": {"url": "http://m.pfmh.net/manhua/${cartoonId}/index.html","columns": [{"field": "name","title": "漫画名","comment": "","locator": "<div class=\\"main-bar bar-bg1\\">[\\\\n \\\\r\\\\n \\\\t .*]+<h1>(.*?)</h1>"}, {"field": "author","title": "作者","comment": "","locator": "<dt>作者：</dt>[\\\\n \\\\r\\\\n \\\\t .*]+<dd>(.*?)</dd>"}, {"field": "category","title": "所属分类","comment": "","locator": "<dt>类别：</dt>[\\\\n \\\\r\\\\n .*]+<dd><a href=\\".*?\\">(.*?)</a></dd>"}, {"field": "intro","title": "漫画简介","comment": "","locator": "<div class=\\"book-intro book-intro-more\\" id=\\"bookIntro\\">[\\\\r \\\\n \\\\r\\\\n \\\\t .*]+<p>(.*?)</p>[\\\\r \\\\n \\\\r\\\\n \\\\t .*]+</div>"}, {"field": "picture","title": "封面图地址","comment": "","locator": "<img src=\\"(.*?)\\" title=\\".*?\\" alt=\\".*?\\".*?>"}, {"field": "book_status","title": "书籍状态","comment": "","locator": "<div class=\\"thumb\\">[\\\\r \\\\n \\\\r\\\\n .*]+<img src=\\".*?\\" title=\\".*?\\" alt=\\".*?\\" />[\\\\r \\\\n \\\\r\\\\n .*]+<i>(.*?)</i>[\\\\r \\\\n \\\\r\\\\n .*]+</div>"}, {"field": "cartoon_id","title": "漫画编号","comment": "","locator": "<link rel=\\"miphtml\\" href=\\"http://m.pufei8.com/mip/manhua/(\\\\d+)/\\">"}]},"chapter_list": {"urls": "http://m.pfmh.net/manhua/${cartoonId}/index.html","container": "<li><a href=\\"/manhua/\\\\d+/\\\\d+.html\\" title=\\".*?\\">.*?</a></li>","is_reverse_order": "0","columns": [{"field": "name","title": "漫画名","comment": "","locator": "<li><a href=\\".*?\\" title=\\".*?\\">(.*?)</a></li>"}, {"field": "content_id","title": "章节ID","comment": "","locator": "<li><a href=\\"/manhua/\\\\d+/(\\\\d+).html\\" title=\\".*?\\">.*?</a></li>"}, {"field": "content_url","title": "章节内容地址","comment": "","locator": "http://m.pfmh.net/manhua/${cartoonId}/${chapterId}.html"}]},"chapter_content": {"container": "<img width=\\"100%\\" src=\\".*?\\" style=\\"display: inline-block;\\">","picture": "<img width=\\"100%\\" src=\\"(.*?)\\" style=\\"display: inline-block;\\">","content_page":"","content_page_url":""}}'
        )
        this.ruleTypeVariable = this.rulekeytov
      } else {
        this.form.chromedpNode = ''
        this.ruleHmtl = JSON.parse(
          '{"update_list": {"urls": "http://www.ac.qq.com:8019/case?p=1&t=2"},"cartoon_info": {"url": "http://www.ac.qq.com:8019/info?id=${cartoonId}&t=2"},"chapter_list": {"url": "http://www.ac.qq.com:8019/list?id=${cartoonId}&t=2"},"chapter_content": {"url": "http://www.ac.qq.com:8019/chapter?id=${cartoonId}&cid=${chapterId}&t=2"}}'
        )
        this.ruleTypeVariable = this.rulekeytovJson
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      var _t = this
      const id = row.id || this.ids
      getCrawlerRule(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改采集规则'
        this.isEdit = true
        var rule = JSON.parse(this.form.rule)
        _t.ruleHmtl = rule
        if (this.form.type === 1) {
          this.ruleTypeVariable = this.rulekeytov
        } else {
          this.ruleTypeVariable = this.rulekeytovJson
        }
      })
    },
    /** 测试规则操作 */
    handleTest(row) {
      this.resetTestForm()
      this.openTest = true
      if (parseInt(row.id) > 0) {
        this.testRuleId = row.id
        if (row.type === 1) {
          this.ruleTypeVariable = this.rulekeytov
        } else {
          this.ruleTypeVariable = this.rulekeytovJson
        }
        this.ruleHmtl = JSON.parse(row.rule)
      } else {
        this.testRuleId = this.form.id
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        this.form.rule = JSON.stringify(this.ruleHmtl)
        if (valid) {
          if (this.form.id !== undefined) {
            updateCrawlerRule(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addCrawlerRule(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    // 提交测试规则表单
    submitTestForm: function () {
      this.$refs['formTest'].validate((valid) => {
        if (valid) {
          var testRuleData = {
            sourceCartoonId: this.formTest.sourceCartoonId + '',
            rule: JSON.stringify(this.ruleHmtl)
          }
          if (this.formTest.chapterId) testRuleData.chapterId = this.formTest.chapterId + ''
          const loading = this.$loading({
            lock: true,
            text: '正在获取源站数据中，请等待...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          testCrawlerRule(testRuleData)
            .then((response) => {
              loading.close()
              this.openTest = false
              if (response.code === 200) {
                var domain = process.env.VUE_APP_BASE_API
                window.open(domain + response.data.url, '_blank')
              } else {
                this.msgError(response.msg)
              }
            })
            .catch(() => {
              loading.close()
            })
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
          return delCrawlerRule({ ids: Ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
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
    }
  }
}
</script>
