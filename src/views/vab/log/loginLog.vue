<template>
  <div v-loading="pageloading" class="page-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.account"
              clearable
              placeholder="请输入账户名"
              @keyup.enter.native="searchData"
            />
          </el-form-item>

          <el-form-item>
            <el-select
              v-model.trim="queryForm.loginstate"
              placeholder="请选择登录状态"
            >
              <el-option label="登录成功" value="登录成功" />
              <el-option label="登录失败" value="登录失败" />
              <el-option label="退出登录" value="退出登录" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="searchData">
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
        <el-link type="primary" @click="detailsRow(row)">
          {{ row.title }}
        </el-link>
      </template>
    </Table>
  </div>
</template>

<script>
  import Table from '@/components/GridBar/index.vue'
  export default {
    name: 'LoginLog',
    components: { Table },
    data() {
      return {
        tableOptions: {
          column: [
            { prop: 'account', label: '登录账户' },
            { prop: 'loginip', label: 'IP地址' },
            { prop: 'createtime', label: '登录时间' },
            { prop: 'loginstate', label: '登录状态' },
          ],
        },
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          username: '',
        },
        pageloading: false,
        indexName: 'tb_login_log',
      }
    },
    methods: {
      searchData() {
        this.$refs.pageTable.tableSearch()
      },
      getConditions(conditions) {
        if (this.queryForm.account && this.queryForm.account.length > 0) {
          conditions.push({
            field: 'account',
            type: '包含',
            value: this.queryForm.account,
          })
        }
        if (this.queryForm.loginstate) {
          conditions.push({
            field: 'loginstate',
            type: '等于',
            value: this.queryForm.loginstate,
          })
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
