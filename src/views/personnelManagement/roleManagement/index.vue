<template>
  <div v-loading="pageloading" class="page-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="addData">
          添加
        </el-button>
        <!-- <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name"
              clearable
              placeholder="请输入角色名称"
              @keyup.enter.native="searchData"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="searchData">
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
      <template #title="{ row }">
        <el-link type="primary" @click="detailsRow(row)">
          {{ row.title }}
        </el-link>
      </template>
      <template #oper="{ row }">
        <!-- <el-button type="text" @click="handleDetails(row)">包含用户</el-button> -->
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button type="text" @click="handleDelete(row)">删除</el-button>
      </template>
    </Table>
    <el-dialog
      v-if="dialog.visible"
      v-loading="dialog.loading"
      :visible="true"
      :close-on-click-modal="false"
      width="650px"
      :show-close="false"
      class="form-dialog"
      :title="dialog.type === 'edit' ? '编辑角色' : '新增角色'"
    >
      <el-form
        ref="formDia"
        v-loading="dialog.loading"
        :rules="dialog.rules"
        :model="dialog.dataRow"
        label-width="80px"
        label-position="rigth"
      >
        <el-form-item label="角色名:" prop="name">
          <el-input
            v-model.trim="dialog.dataRow.name"
            :disabled="dialog.type === 'edit' ? true : false"
            placeholder="角色名"
            max-length="50"
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model.trim="dialog.dataRow.remark"
            max-length="250"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="菜单权限:">
          <el-tree
            ref="tree"
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="dialog.moduleids"
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      v-if="detailsDia.visible"
      :visible="true"
      :close-on-click-modal="false"
      width="780px"
      title="用户列表"
    >
      <Table
        ref="detailsTable"
        :index-name="userName"
        :table="detailsDia.tableOptions"
        :pager="detailsDia.pagerOptions"
        @getConditions="getDetailsConditions"
      ></Table>
      <span slot="footer" style="text-align: right">
        <el-button @click="detailsDia.visible = false">关闭</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
  import { GetMenulist } from '@UTILS/menus.js'
  import { addRole, updateRole } from '@/api/role.js'
  import { getData, deleteData } from '@/api/common.js'
  import Table from '@/components/GridBar/index.vue'
  export default {
    name: 'RoleManagement',
    components: { Table },
    data() {
      return {
        indexName: 'tb_role',
        userName: 'tb_user',
        queryForm: {
          permission: '',
        },
        tableOptions: {
          column: [
            { prop: 'name', label: '角色名', width: '220', sortable: true },
            {
              label: '备注',
              prop: 'remark',
            },
            {
              label: '创建时间',
              prop: 'createtime',
              width: '180',
              sortable: true,
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
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'title',
        },
        // detailsDia: {
        //   visible: false,
        //   dataRow: {},
        //   tableOptions: {
        //     column: [
        //       {
        //         label: '创建时间',
        //         prop: 'createtime',
        //         width: '180',
        //         sortable: true,
        //       },
        //       {
        //         prop: 'account',
        //         label: '登录名',
        //         width: '180',
        //       },
        //       {
        //         prop: 'username',
        //         label: '用户名',
        //         width: '180',
        //         sortable: true,
        //       },
        //       {
        //         label: '备注',
        //         prop: 'remark',
        //       },
        //     ],
        //     height: '300',
        //   },
        //   pagerOptions: {
        //     isShow: false,
        //   },
        // },
        dialog: {
          loading: false,
          visible: false,
          type: 'new',
          dataRow: {},
          moduleids: [],
          rules: {
            account: [
              { required: true, message: '请输入账户', trigger: 'blur' },
            ],
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
          },
        },
      }
    },
    created() {
      this.getTreeData()
    },
    methods: {
      getConditions(conditions) {
        if (this.queryForm.name && this.queryForm.name.length > 0) {
          conditions.push({
            field: 'name',
            type: '包含',
            value: this.queryForm.name,
          })
        }
        return conditions
      },
      // getDetailsConditions(conditions) {
      //   conditions.push({
      //     field: 'roleids',
      //     value: this.detailsDia.dataRow.id,
      //     type: '内部匹配',
      //   })
      //   return conditions
      // },

      searchData() {
        this.$refs.pageTable.tableSearch()
      },
      getTreeData() {
        const parmas = {
          indexName: 'tb_menu',
          conditions: JSON.stringify([]),
          sort: JSON.stringify([{ sort: 'asc' }]),
        }
        getData(parmas).then((res) => {
          this.treeData = GetMenulist(res.data)
        })
      },
      addData() {
        this.dialog.dataRow = {}
        this.dialog.type = 'new'
        this.dialog.moduleids = []
        this.dialog.visible = true
      },
      handleEdit(row) {
        this.dialog.dataRow = { ...row }
        this.dialog.type = 'edit'
        this.dialog.visible = true
        this.dialog.loading = true
        this.dialog.moduleids = []
        getData({
          indexName: 'tb_menu_role',
          conditions: JSON.stringify([{ field: 'roleid', value: row.id }]),
        })
          .then((res) => {
            if (res.data && res.data.length > 0) {
              const ids = []
              res.data.forEach((item) => {
                ids.push(item.menuid)
              })
              this.dialog.moduleids = ids
            }
            this.dialog.loading = false
          })
          .catch(() => {
            this.dialog.loading = false
          })
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗？', null, async () => {
          this.pageloading = true
          deleteData({
            indexName: this.indexName,
            conditions: JSON.stringify([{ field: 'id', value: row.id }]),
          })
            .then((res) => {
              this.pageloading = false
              this.$message({ type: 'success', message: '删除成功!' })
              this.searchData()
            })
            .catch(() => {
              this.pageloading = false
            })
        })
      },
      handleDetails(row) {
        this.detailsDia.tableOptions.data = []
        this.detailsDia.visible = true
        this.detailsDia.dataRow = row
      },
      confirmRole() {
        this.$refs.formDia.validate((valid) => {
          if (valid) {
            let modules = this.$refs.tree.getCheckedKeys()
            modules = modules.length > 0 ? modules.join(',') : null
            this.dialog.loading = true
            if (this.dialog.type === 'edit') {
              updateRole({
                indexName: this.indexName,
                conditions: JSON.stringify([
                  { field: 'id', value: this.dialog.dataRow.id },
                ]),
                dataList: JSON.stringify({
                  remark: this.dialog.dataRow.remark,
                  name: this.dialog.dataRow.name,
                  modules: modules,
                }),
              })
                .then((res) => {
                  this.dialog.loading = false
                  this.dialog.visible = false
                  this.$message({ type: 'success', message: '修改成功!' })
                  this.searchData()
                })
                .catch(() => {
                  this.dialog.loading = false
                })
            } else {
              addRole({
                indexName: this.indexName,
                dataList: JSON.stringify({
                  remark: this.dialog.dataRow.remark,
                  name: this.dialog.dataRow.name,
                  modules: modules,
                }),
              })
                .then((res) => {
                  this.dialog.loading = false
                  this.dialog.visible = false
                  this.$message({ type: 'success', message: '新增成功!' })
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
    },
  }
</script>

<style lang="scss" scoped>
  .form-dialog {
    .el-textarea ::v-deep textarea {
      resize: none;
      height: 65px;
    }
  }
</style>
