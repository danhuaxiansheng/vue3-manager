<template>
  <div class="page-container">
    <vab-query-form>
      <vab-query-form-top-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleDialog">
          添加
        </el-button>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      :data="menusData"
      style="width: 100%; margin-top: 20px"
      border
      :stripe="true"
      row-key="id"
      :expand-row-keys="expandKeys"
      :element-loading-text="elementLoadingText"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column label="父级" prop="parentid" width="180" /> -->
      <el-table-column label="菜单名称" prop="title" width="180">
        <template #default="{ row }">
          <vab-icon :icon="row.icon"></vab-icon>
          {{ row.title }}
        </template>
      </el-table-column>

      <el-table-column label="路由路径" prop="path" width="220" />
      <el-table-column label="排序标识" prop="sort" width="80" />
      <el-table-column label="组件路径" prop="component" />
      <!-- <el-table-column label="图标" prop="icon" width="80" /> -->
      <!-- <el-table-column label="访问路径" prop="urladdress" /> -->
      <!-- <el-table-column label="菜单排序" prop="sortcode" width="80" /> -->
      <el-table-column align="center" label="操作" width="180">
        <template #default="{ row }">
          <el-button type="text" @click="handleDialog(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Edit
      v-if="dialog.visible"
      :rid="dialog.rowid"
      @yes="yesDia"
      @cancel="dialog.visible = false"
    ></Edit>
  </div>
</template>

<script>
  import { GetMenulist } from '@UTILS/menus.js'
  import { getData, deleteData } from '@/api/page/common.js'
  import Edit from './components/edit.vue'

  export default {
    name: 'MenuManagement',
    components: {
      Edit,
    },
    data() {
      return {
        indexName: 'tb_menu',
        menusData: [],
        tableData: [],
        expandKeys: [], //默认展开的节点
        listLoading: true,
        elementLoadingText: '正在加载...',
        dialog: {
          visible: false,
          rowid: null,
        },
      }
    },
    async created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const parmas = {
          indexName: this.indexName,
          conditions: JSON.stringify([]),
          sort: JSON.stringify([{ sort: 'asc' }, { pid: 'asc' }]),
        }
        this.listLoading = true
        getData(parmas).then((res) => {
          this.tableData = res.data
          this.menusData = GetMenulist(res.data)
          this.getExpandKey()
          this.listLoading = false
        })
      },
      getExpandKey() {
        this.expandKeys = []
        this.menusData.forEach((item) => {
          this.expandKeys.push(item.id)
        })
      },
      handleDialog(row) {
        this.dialog.rowid = row ? row.id : ''
        this.dialog.visible = true
      },
      handleDelete(row) {
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
      yesDia() {
        this.dialog.visible = false
        this.fetchData()
      },
    },
  }
</script>
