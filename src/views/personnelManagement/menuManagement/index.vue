<template>
  <div class="page-container">
    <vab-query-form>
      <vab-query-form-top-panel :span="12">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addData"
        >
          添加
        </el-button>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      :data="menusData"
      style="width: 100%; margin-top: 20px"
      border
      stripe
      row-key="id"
      :default-expand-all="true"
      :element-loading-text="elementLoadingText"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      >
      <el-table-column
        type="selection"
        width="55"
      />
      <!-- <el-table-column label="父级" prop="parentid" width="180" /> -->
      <el-table-column
        label="菜单名称"
        prop="fullname"
      />
      <!-- <el-table-column label="图标" prop="icon" width="80" /> -->
      <el-table-column
        label="访问路径"
        prop="urladdress"
      />
      <!-- <el-table-column label="菜单排序" prop="sortcode" width="80" /> -->
      <el-table-column
        label="是否启用"
        prop="enabledmark"
        width="80"
      >
        <template #default="{ row }">
          {{ row.enabledmark == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示"
        prop="isshow"
        width="80"
      >
        <template #default="{ row }">
          {{ row.isshow == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
      />
      <el-table-column
        align="center"
        label="操作"
        width="180"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-if="dialog.visible"
      v-loading="dialog.loading"
      :visible="true"
      :close-on-click-modal="false"
      width="650px"
      :append-to-body="false"
      :show-close="false"
      :title="dialog.type === 'edit' ? '编辑菜单' : '新增菜单'"
    >
      <el-form
        ref="formDia"
        :rules="dialog.rules"
        :model="dataRow"
        label-width="85px"
        label-position="rigth"
      >
        <el-form-item label="父级菜单:">
          <el-popover
            ref="popover"
            placement="bottom"
            width="400"
            trigger="click"
          >
            <el-tree
              :data="menusData"
              node-key="id"
              :props="dialog.defaultProps"
              default-expand-all
              :default-checked-keys="checkPid"
              @node-click="handleNodeClick"
            />
            <el-input
              slot="reference"
              v-model.trim="dataRow.parentName"
              placeholder="请选择父级菜单"
              maxlength="50"
              readonly
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="菜单名称：">
          <el-input
            v-model.trim="dataRow.fullname"
            placeholder="请输入菜单名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="请求地址：">
          <el-input
            v-model.trim="dataRow.urladdress"
            placeholder="请输入请求地址"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="图标样式：">
          <el-input
            v-model.trim="dataRow.icon"
            placeholder="请输入图标样式"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="排序顺序：">
          <el-input
            v-model.trim="dataRow.sortcode"
            placeholder="请输入排序顺序"
            maxlength="3"
            type="number"
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="dataRow.enabledmark" />
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-switch v-model="dataRow.isshow" />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetMenulist } from '@UTILS/menus.js'
import { getData, deleteData, updateData, addData } from '@/api/page/common.js'
export default {
  name: 'MenuManagement',
  data () {
    return {
      indexName: 'tb_module',
      menusData: [],
      tableData: [],
      roleList: [],
      listLoading: true,
      elementLoadingText: '正在加载...',
      dataRow: {},
      dialog: {
        loading: false,
        visible: false,
        type: 'new',
        treeVisible: false,
        defaultProps: {
          children: 'children',
          label: 'fullname',
        },
        rules: {
          account: [{ required: true, message: '请输入账户', trigger: 'blur' }],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        },
      },
      checkPid: [],
      defaultRow: {
        parentid: '',
        parentName: '',
        fullname: '',
        urladdress: '',
        icon: '',
        sortcode: 10,
        isshow: 1,
        enabledmark: 1,
      },
    }
  },
  async created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const parmas = {
        indexName: this.indexName,
        conditions: JSON.stringify([]),
        sort: JSON.stringify([{ sortcode: 'asc' }]),
      }
      this.listLoading = true
      getData(parmas).then((res) => {
        this.tableData = res.data
        this.menusData = GetMenulist(res.data)
        this.listLoading = false
      })
    },
    addData () {
      this.dataRow = JSON.parse(JSON.stringify(this.defaultRow))
      this.checkPid = []
      this.dialog.type = 'new'
      this.dialog.visible = true
    },
    handleEdit (row) {
      const newRow = JSON.parse(JSON.stringify(row))
      delete newRow.children

      this.dataRow = JSON.parse(
        JSON.stringify(Object.assign(this.defaultRow, newRow))
      )
      this.dataRow.isshow = this.dataRow.isshow === 1
      this.dataRow.enabledmark = this.dataRow.enabledmark === 1

      if (this.dataRow.parentid) {
        let filData = this.tableData.filter(
          (el) => el.id === this.dataRow.parentid
        )
        this.dataRow.parentName = filData.length > 0 ? filData[0].fullname : ''
        this.checkPid = [this.dataRow.parentid]
      }
      this.dialog.type = 'edit'
      this.dialog.visible = true
    },
    handleDelete (row) {
      this.$baseConfirm('你确定要删除当前项吗？', null, async () => {
        this.listLoading = true
        deleteData({
          indexName: this.indexName,
          conditions: JSON.stringify([{ field: 'id', value: row.id }]),
        })
          .then((res) => {
            this.$baseMessage('删除成功!', 'success')
            this.fetchData()
          })
          .catch(() => {
            this.listLoading = false
          })
      })
    },
    confirmRole () {
      this.$refs.formDia.validate((valid) => {
        if (valid) {
          this.dialog.loading = true
          const form = { ...this.dataRow }
          form.isshow = form.isshow ? 1 : 0
          form.enabledmark = form.enabledmark ? 1 : 0
          if (form.sortcode) {
            form.sortcode = parseInt(form.sortcode)
          }
          delete form.parentName
          if (this.dialog.type === 'edit') {
            updateData({
              indexName: this.indexName,
              conditions: JSON.stringify([
                { field: 'id', value: this.dataRow.id },
              ]),
              dataList: JSON.stringify(form),
            })
              .then((res) => {
                this.dialog.loading = false
                this.dialog.visible = false
                this.$baseMessage('修改成功!', 'success')
                this.fetchData()
              })
              .catch(() => {
                this.dialog.loading = false
              })
          } else {
            addData({
              indexName: this.indexName,
              dataList: JSON.stringify(form),
            })
              .then((res) => {
                this.dialog.loading = false
                this.dialog.visible = false
                this.$baseMessage('新增成功!', 'success')
                this.fetchData()
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
    handleNodeClick (row) {
      this.dataRow.parentid = row.id
      this.dataRow.parentName = row.fullname
      this.$refs.popover.doClose()
    },
  },
}
</script>
