<template>
  <div
    v-loading="pageloading"
    class="page-container"
  >
    <vab-query-form>

      <vab-query-form-left-panel :span="12">
        <el-form
          :inline="true"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model.trim="queryForm.details"
              clearable
              placeholder="请输入操作详情"
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
      </vab-query-form-left-panel>
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
    </Table>
  </div>
</template>

<script>
import Table from '@/components/GridBar/index.vue'
export default {
  name: 'OperationLog',
  components: { Table },
  data () {
    return {
      tableOptions: {
        column: [
          { prop: 'createid', label: '操作人' },
          { prop: 'createtime', label: '登录时间' },
          { prop: 'menuname', label: '模块名称' },
          { prop: 'opertype', label: '操作类型' },
          { prop: 'details', label: '操作详情' },
        ],
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
      },
      pageloading: false,
      indexName: 'tb_operation_log',
    }
  },
  methods: {
    searchData () {
      this.$refs.pageTable.tableSearch()
    },
    getConditions (conditions) {
      if (this.queryForm.details && this.queryForm.details.length > 0) {
        conditions.push({ field: 'details', type: '包含', value: this.queryForm.details })
      }
      return conditions
    },
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
