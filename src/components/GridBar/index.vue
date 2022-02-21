<template>
  <div class="page-table">
    <!-- <div class="tool-bar">
      <div class="align-left"></div>
      <div class="align-right"></div>
    </div> -->
    <el-table
      v-if="tableOption.isShow"
      ref="pageTable"
      v-loading="tableLoading"
      :data="tableData"
      :height="height"
      :min-height="minHeight"
      :element-loading-text="tableOption.loadingText"
      :row-key="getKey"
      stripe
      @selection-change="selectRows"
      @sort-change="sortChange"
    >
      <template v-for="attr in tableOption.column">
        <el-table-column :key="attr.prop" show-overflow-tooltip v-bind="attr">
          <template
            v-if="attr.proptype === 'time' || timeFiled.includes(attr.prop)"
            #default="{ row }"
          >
            {{ timeFormat(row[attr.prop]) }}
          </template>
          <template v-else #default="{ row }">
            <slot :name="attr.prop" :row="row">
              {{ row[attr.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="pagerOption.isShow"
      v-bind="pagerOption"
      @current-change="currentChange"
      @size-change="sizeChange"
    ></el-pagination>
  </div>
</template>
<script>
  import { parseTime } from '@UTILS/index.js'
  import { getData } from '@/api/common.js'
  export default {
    props: {
      table: {
        type: Object,
        require: true,
        default() {
          return {
            isShow: true,
            column: [],
            height: '',
          }
        },
      },
      pager: {
        type: Object,
        require: false,
        default() {
          return {
            isShow: true,
            currentPage: 1,
            pageSize: 50,
            total: 0,
          }
        },
      },
      indexName: {
        type: String,
        require: false,
        default: '',
      },
    },
    data() {
      return {
        tableData: [],
        tableLoading: false,
        sort: null,

        column: [],
        tableOption: {},
        pagerOption: {},
        selectList: [],
        timeFiled: ['createtime', 'publictime'],
        height: '300',
        minHeight: 300,
      }
    },
    watch: {
      'table.data'(newVal) {
        this.tableOption.data = newVal
      },
      'table.column'(newVal) {
        this.tableOption.column = newVal
      },
      'pager.total'(newVal) {
        this.pagerOption.total = newVal
      },
      'pager.currentPage'(newVal) {
        this.pagerOption.currentPage = newVal
      },
      'pager.pageSize'(newVal) {
        this.pagerOption.pageSize = newVal
      },
    },
    beforeMount() {
      this.setOptions()
    },
    mounted() {
      this.tableSearch()
    },
    methods: {
      // 窗口改变时 更新表格高度
      screenChange() {
        let that = this
        window.onresize = () => {
          that.height = that.$baseTableHeight({
            hasPager: that.pagerOption.isShow,
          })
        }
      },
      timeFormat(val) {
        return val ? parseTime(new Date(val), '{y}-{m}-{d} {h}:{i}:{s}') : '-'
      },
      setOptions() {
        this.tableOption = {
          ...{
            isShow: true,
            column: [],
            select: null,
            key: 'id',
            loadingText: '正在加载...',
          },
          ...this.table,
        }

        this.pagerOption = {
          ...{
            isShow: true,
            background: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            currentPage: 1,
            pageSize: 50,
            total: 0,
          },
          ...this.pager,
        }
        if (this.tableOption.height) {
          this.height = this.tableOption.height
        } else {
          // 自动高度
          this.height = this.$baseTableHeight({
            hasPager: this.pagerOption.isShow,
          })
          this.screenChange()
        }
      },
      getKey(row) {
        return row[this.key]
      },
      selectRows(val) {
        this.selectList = val
      },
      sortChange(sort) {
        // sort: JSON.stringify([{ createtime: 'asc' }]),
        if ((sort.order = null)) {
          this.sort = null
        } else {
          this.sort = {}
          this.sort[sort.prop] = sort.order === 'descending' ? 'desc' : 'asc'
        }
        this.tableSearch()
      },
      sizeChange(newVal) {
        this.pagerOption.pageSize = newVal
        this.tableSearch()
      },
      currentChange(newVal) {
        this.pagerOption.currentPage = newVal
        this.tableSearch()
      },
      getCondition() {
        let conditions = []
        let parmas = {
          indexName: this.indexName,
        }

        // 修改排序字段
        if (this.sort) {
          parmas.sort = JSON.stringify([this.sort])
        }

        // 设置分页
        if (this.pagerOption.isShow) {
          parmas.skip = this.pagerOption.currentPage-1
          parmas.take = this.pagerOption.pageSize
        }

        // 设置要查询的字段
        if (this.tableOption.select) {
          parmas.select = this.tableOption.select
        }
        this.$emit('getConditions', conditions)
        parmas.conditions = JSON.stringify(conditions)
        return parmas
      },
      tableSearch() {
        const parmas = this.getCondition()
        this.tableLoading = true
        getData(parmas)
          .then((res) => {
            this.tableLoading = false
            this.tableData = res.data
            if (this.pagerOption.isShow) {
              this.pagerOption.total = res.total
            }
          })
          .catch(() => {
            this.tableLoading = false
          })
      },
    },
  }
</script>
