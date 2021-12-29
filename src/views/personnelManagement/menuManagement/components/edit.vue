<template>
  <el-dialog
    v-loading="listLoading"
    :visible="true"
    :close-on-click-modal="false"
    width="650px"
    :append-to-body="false"
    :show-close="false"
    :title="getTitle"
  >
    <el-form
      ref="formDia"
      :rules="rules"
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
            :props="defaultProps"
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
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirmRole">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    updateData,
    addData,
    getFirstData,
    getData,
  } from '@/api/page/common.js'
  import { GetMenulist } from '@UTILS/menus.js'
  export default {
    name: 'MenuEdit',
    props: {
      rid: {
        type: String,
        default: () => '',
        require: false,
      },
    },
    data() {
      return {
        indexName: 'tb_menu',
        listLoading: false,

        tableData: [], // 所有菜单的原始数组
        menusData: [], // children 的菜单

        dataRow: {},
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
    async created() {
      this.getAllList()
      if (this.rid) {
        this.fetchData()
      }
    },
    methods: {
      getTitle() {
        return this.rid ? '编辑菜单' : '新增菜单'
      },
      getAllList() {
        const parmas = {
          indexName: this.indexName,
          conditions: JSON.stringify([]),
          sort: JSON.stringify([{ sort: 'asc' }, { pid: 'asc' }]),
        }
        this.listLoading = true
        getData(parmas).then((res) => {
          this.tableData = res.data
          this.menusData = GetMenulist(res.data)
          this.listLoading = false
        })
      },
      fetchData() {
        const parmas = {
          indexName: this.indexName,
          conditions: JSON.stringify([{ field: 'id', value: this.rid }]),
        }
        this.listLoading = true
        getFirstData(parmas).then((res) => {
          this.dataRow = res.data
          this.listLoading = false
        })
      },
      handleEdit(row) {
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
          this.dataRow.parentName =
            filData.length > 0 ? filData[0].fullname : ''
          this.checkPid = [this.dataRow.parentid]
        }
      },
      handleNodeClick(row) {
        this.dataRow.parentid = row.id
        this.dataRow.parentName = row.fullname
        this.$refs.popover.doClose()
      },
      submitData() {
        this.listLoading = true
        const form = { ...this.dataRow }
        form.isshow = form.isshow ? 1 : 0
        form.enabledmark = form.enabledmark ? 1 : 0
        if (form.sortcode) {
          form.sortcode = parseInt(form.sortcode)
        }
        delete form.parentName

        if (this.rid) {
          updateData({
            indexName: this.indexName,
            conditions: JSON.stringify([
              { field: 'id', value: this.dataRow.id },
            ]),
            dataList: JSON.stringify(form),
          })
            .then((res) => {
              this.listLoading = false
              this.$baseMessage('修改成功!', 'success')
              this.$emit('yes')
            })
            .catch(() => {
              this.listLoading = false
            })
        } else {
          addData({
            indexName: this.indexName,
            dataList: JSON.stringify(form),
          })
            .then((res) => {
              this.listLoading = false
              this.$baseMessage('新增成功!', 'success')
              this.$emit('yes')
            })
            .catch(() => {
              this.listLoading = false
            })
        }
      },
      confirmRole() {
        this.$refs.formDia.validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.submitData()
          }
        })
      },
      cancel() {
        this.$emit('cancel')
      },
    },
  }
</script>
<style lang="sass" scoped></style>
