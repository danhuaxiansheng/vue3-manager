<template>
  <div
    v-loading="pageloading"
    class="page-container"
  >
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          type="primary"
          @click="addMeet"
        >新增资料</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form
          :inline="true"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model.trim="queryForm.title"
              clearable
              placeholder="请输入标题名称"
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
      <template #title="{ row }">
        <el-link
          type="primary"
          @click="detailsRow(row)"
        >
          {{ row.title }}
        </el-link>
      </template>
      <template #oper="{ row }">
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
  </div>
</template>

<script>
import Table from '@/components/GridBar/index.vue'
import { deleteData } from '@/api/page/common.js'
export default {
  name: 'Meetlist',
  components: { Table },
  data () {
    return {
      tableOptions: {
        column: [
          { prop: 'title', label: '标题' },
          {
            label: '创建时间',
            prop: 'createtime',
            width: '180',
          },
          {
            label: '操作',
            prop: 'oper',
            width: '180',
          },
        ],
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
      },
      pageloading: false,
      indexName: 'tb_article',
    }
  },
  methods: {
    searchData () {
      this.$refs.pageTable.tableSearch()
    },
    getConditions (conditions) {
      if (this.queryForm.title && this.queryForm.title.length > 0) {
        conditions.push({ field: 'title', type: '包含', value: this.queryForm.title })
      }
      return conditions
    },
    addMeet () {
      this.$router.push({
        path: '/meet/meetcreate',
      })
    },
    detailsRow (row) {
      this.$router.push({
        path: '/meet/meetdetils',
        query: {
          rowid: row.id,
          type: 'details',
        },
      })

      this.addReadTimes(row.id)
    },
    // 新增阅读次数
    addReadTimes (rowid) { },
    handleEdit (row) {
      this.$router.push({
        path: '/meet/meetedit',
        query: {
          rowid: row.id,
          type: 'edit',
        },
      })
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
            this.searchData()
          })
          .catch(() => {
            this.pageloading = false
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
