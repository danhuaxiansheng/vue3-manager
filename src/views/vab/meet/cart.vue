<template>
  <div v-loading="pageloading" class="page-container">
    <!-- <Table
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
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button type="text" @click="handleDelete(row)">删除</el-button>
      </template>
    </Table> -->
    <el-card v-for="item in tableData" :key="item.id">
      <el-row class="card-head">
        <a class="card-head-title title" @click="detailsRow(item)">
          {{ item.title }}
        </a>
      </el-row>
      <el-row class="card-body">
        <div class="cart-body-panle" v-html="item.content"></div>
      </el-row>
      <el-row class="card-btn">
        <el-button type="primary" icon="el-icon-caret-top" class="btn blue">
          赞同 {{ item.goodtimes }}
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-caret-bottom"
          class="btn blue"
        ></el-button>
        <el-button type="text" class="no-background color-default">
          <i class="el-icon-s-comment"></i>
          添加评论
        </el-button>
        <el-button
          type="text"
          class="no-background color-default"
          @click="copy(item, $event)"
        >
          <i class="el-icon-s-promotion"></i>
          分享
        </el-button>
      </el-row>
      <!-- <Comment  :rowid="rowid"></Comment> -->
    </el-card>
  </div>
</template>

<script>
  // 外部组件
  import copyText from '@/utils/clipboard'
  // 组件
  import Comment from '@/components/Comment/index'
  // 接口
  import { getData } from '@/api/common.js'

  export default {
    name: 'Meetlist',
    // components: { Comment },
    data() {
      return {
        tableOptions: {
          column: [
            { prop: 'title', label: '标题' },
            // { prop: 'typeid', label: '文章类型' },
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
        tableData: [],
        indexName: 'tb_article',
      }
    },
    beforeMount() {
      this.getAllList()
    },
    methods: {
      getAllList() {
        const parmas = {
          indexName: this.indexName,
          conditions: JSON.stringify([]),
          sort: JSON.stringify([{ createtime: 'desc' }]),
        }
        getData(parmas).then((result) => {
          this.tableData = result.data
        })
      },
      addMeet() {
        this.$router.push({
          path: '/meet/meetcreate',
        })
      },
      detailsRow(row) {
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
      addReadTimes(rowid) {},
      getCopyTxt(row) {
        return (
          location.origin +
          '/' +
          location.hash.replace('meetcart', 'meetdetils') +
          `?rowid=${row.id}&type=details`
        )
      },
      copy(item, event) {
        let text = this.getCopyTxt(item)
        copyText(text, event)
        // var clipboard = new Clipboard('#copy_link')
        // clipboard.on('success', (e) => {
        //   this.$baseMessage('复制链接成功', 'success')
        //   // 释放内存
        //   clipboard.destroy()
        // })
        // clipboard.on('error', (e) => {
        //   // 不支持复制
        //   this.$baseMessage('该浏览器不支持自动复制', 'error')
        //   // 释放内存
        //   clipboard.destroy()
        // })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page-container {
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
      Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
      sans-serif;
    font-size: 15px;
    color: #121212;
    padding: 0;
  }
  .card-head-title {
    text-decoration: none;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #121212;
  }

  .card-body {
    .cart-body-panle {
      height: 155px;
      overflow: hidden;
      margin-top: 9px;
    }
  }

  .card-btn {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    margin: 0 -20px -10px;
  }

  .btn {
    display: inline-block;
    padding: 0 16px;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    background: none;
    border-radius: 3px;
    color: #8590a6;
    height: 32px;
    ::v-deep {
      i {
        font-size: 16px;
      }
    }
  }

  .blue {
    color: #06f;
    border-color: transparent;
    background: rgba(0, 102, 255, 0.1);
    padding: 0 10px;
  }

  .no-background {
    background-color: transparent;
    border: none;
    border-radius: 0;
    display: inline-block;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    background: none;
    color: #8590a6;
    height: 32px;
    ::v-deep {
      i {
        font-size: 16px;
      }
    }
  }

  .color-default {
    color: #8590a6;
  }
</style>
