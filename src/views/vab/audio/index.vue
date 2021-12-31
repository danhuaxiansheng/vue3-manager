<template>
  <div v-loading="pageloading" class="page-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button type="primary" >新增资料</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.title"
              clearable
              placeholder="请输入标题名称"
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
    <el-col
      v-for="(o, index) in 2"
      :key="o"
      :span="8"
      :offset="index > 0 ? 2 : 0"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
        <div style="padding: 14px">
          <span>好吃的汉堡</span>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text" class="button">操作按钮</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
// import Table from '@/components/GridBar/index.vue'
import { getData } from '@/api/common.js'
export default {
  name: 'Meetlist',
  // components: { Table },
  data() {
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
    searchData() {
      this.$refs.pageTable.tableSearch()
    },

    // 新增阅读次数
    addReadTimes(rowid) {},
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
