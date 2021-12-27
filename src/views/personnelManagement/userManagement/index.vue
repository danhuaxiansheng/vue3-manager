<template>
  <div
    v-loading='pageloading'
    class="page-container"
  >
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <!-- <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button> -->
        <el-button
          type="primary"
          @click="addUser"
        >新增用户</el-button>
        <el-button @click="updatePws">初始密码</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form
          :inline="true"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              clearable
              placeholder="请输入用户名称"
              @keyup.enter.native="searchData"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="searchData"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <Table
      ref="pageTable"
      :index-name="indexName"
      :table="tableOptions"
      @getConditions="getConditions"
    >
      <template #oper="{ row }">
        <el-button
          type="text"
          @click="handleReset(row)"
        >重置密码</el-button>
        <el-button
          type="text"
          @click="handleEdit(row)"
        >编辑</el-button>
        <el-button
          type="text"
          @click="handleDelete(row)"
        >删除</el-button>
      </template>
    </Table>
    <el-dialog
      v-if="dialog.visible"
      v-loading="dialog.loading"
      :visible="true"
      :close-on-click-modal="false"
      width="650px"
      class="form-dialog "
      :title="dialog.type === 'edit' ? '编辑用户' : '新增用户'"
    >
      <el-form
        ref="formDia"
        :rules="dialog.rules"
        :model="dialog.dataRow"
        label-width="80px"
        label-position="rigth"
      >
        <el-form-item
          label="账号:"
          prop="account"
        >
          <el-input
            v-model.trim="dialog.dataRow.account"
            :disabled="dialog.type === 'edit' ? true : false"
            placeholder="账户"
            max-length="50"
          />
        </el-form-item>
        <el-form-item
          label="用户名:"
          prop="username"
        >
          <el-input
            v-model.trim="dialog.dataRow.username"
            placeholder="用户名"
            max-length="50"
          />
        </el-form-item>
        <el-form-item label="角色:">
          <el-select
            v-model.trim="dialog.dataRow.roleArr"
            multiple
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model.trim="dialog.dataRow.remark"
            max-length="250"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        style="text-align: right"
      >
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@UTILS/index.js'
import { getData, deleteData, updateData } from '@/api/page/common.js'
import { addUser, updateDefaultPwd, resetPwd } from '@/api/page/user.js'
import md5 from 'js-md5'
import Table from '@/components/GridBar/index.vue'
export default {
  name: 'UserManagement',
  components: { Table },
  data () {
    return {
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
      },
      tableOptions: {
        column: [
          { prop: 'account', label: '账号', width: '180' },
          { prop: 'username', label: '用户名', width: '220' },
          {
            label: '备注',
            prop: 'remark'
          },
          {
            label: '创建时间',
            prop: 'createtime',
            width: '180',
          },
          {
            label: '操作',
            prop: 'oper',
            align: 'center',
            width: '180',
          },
        ],
      },
      pageloading: false,
      indexName: 'tb_user',
      roleList: [],
      dialog: {
        loading: false,
        visible: false,
        type: 'new',
        dataRow: { roleArr: [] },
        rules: {
          account: [{ required: true, message: '请输入账户', trigger: 'blur' }],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        },
      },
    }
  },
  created () {
    this.getRoleData()
  },
  methods: {
    searchData () {
      this.$refs.pageTable.tableSearch()
    },
    getConditions (conditions) {
      if (this.queryForm.username && this.queryForm.username.length > 0) {
        conditions.push({ field: 'username', type: '包含', value: this.queryForm.username })
      }
      return conditions
    },
    parseTime (val) {
      return parseTime(new Date(val), '{y}-{m}-{d} {h}:{i}:{s}')
    },

    getRoleData () {
      const parmas = { indexName: 'tb_role', conditions: JSON.stringify([]) }
      this.pageloading = true
      getData(parmas).then((res) => {
        this.pageloading = false
        this.roleList = res.data
      })
    },
    addUser () {
      this.dialog.dataRow = {}
      this.dialog.type = 'new'
      this.dialog.visible = true
    },
    handleEdit (row) {
      this.dialog.dataRow = {
        ...row,
        roleArr: row.roleids ? row.roleids.split(',') : [],
      }
      this.dialog.type = 'edit'
      this.dialog.visible = true
    },
    handleDelete (row) {
      this.$baseConfirm('你确定要删除当前项吗？', null, async () => {
        this.pageloading = true
        deleteData({
          indexName: this.indexName,
          conditions: JSON.stringify([{ field: 'id', value: row.id }]),
        })
          .then((res) => {
            this.$baseMessage('删除成功!', 'success')
            this.pageloading = false
            this.searchData()
          })
          .catch(() => {
            this.pageloading = false
          })
      })
    },
    confirmRole () {
      this.$refs.formDia.validate((valid) => {
        if (valid) {
          this.dialog.loading = true
          if (this.dialog.type === 'edit') {
            updateData({
              indexName: this.indexName,
              conditions: JSON.stringify([
                { field: 'id', value: this.dialog.dataRow.id },
              ]),
              dataList: JSON.stringify({
                remark: this.dialog.dataRow.remark,
                username: this.dialog.dataRow.username,
                roleids: this.dialog.dataRow.roleArr.join(','),
              }),
            })
              .then((res) => {
                this.dialog.loading = false
                this.dialog.visible = false
                this.$baseMessage('修改成功！', 'success')
                this.searchData()
              })
              .catch(() => {
                this.dialog.loading = false
              })
          } else {
            addUser({
              indexName: this.indexName,
              dataList: JSON.stringify({
                account: this.dialog.dataRow.account,
                remark: this.dialog.dataRow.remark,
                username: this.dialog.dataRow.username,
                roleids: this.dialog.dataRow.roleArr.join(','),
              }),
            })
              .then((res) => {
                this.dialog.loading = false
                this.dialog.visible = false
                this.$baseMessage('新增成功！', 'success')
                this.searchData()
              })
              .catch(() => {
                this.dialog.loading = false
              })
          }
        } else {
          return false
        }
      })
    },
    updatePws () {
      this.$prompt('请输入初始密码', '修改初始密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
      })
        .then(({ value }) => {
          updateDefaultPwd({
            dataList: JSON.stringify({ value: md5(value) }),
          })
            .then((res) => {
              this.$baseMessage(
                '初始密码修改成功，已新增的账户不受影响。',
                'success'
              )
            })
            .catch(() => {
              this.dialog.loading = false
            })
        })
        .catch(() => { })
    },
    handleReset (row) {
      this.$confirm('是否重置该用户密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          resetPwd({
            conditions: JSON.stringify([{ field: 'id', value: row.id }]),
          }).then((res) => {
            this.$baseMessage('修改成功！', 'success')
          })
        })
        .catch(() => { })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.form-dialog {
  .el-textarea ::v-deep textarea {
    resize: none;
    height: 65px;
  }
}
</style>
