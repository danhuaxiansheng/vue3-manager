<template>
  <div v-loading="pageloading" class="page-container">
    <el-row>
      <el-col class="panel-left">
        <el-card v-for="item in tableData" :key="item.id">
          <el-row class="card-head">
            <a class="card-head-title title" @click="detailsRow(item)">
              {{ item.title }}
            </a>
          </el-row>
          <el-row class="card-body">
            <div
              class="cart-body-panle"
              :class="getMoreClass(item)"
              v-html="item.content"
            ></div>
            <el-button
              v-if="!item.showMore"
              type="text"
              class="no-background more"
              @click="showMore(item)"
            >
              阅读全文
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </el-row>
          <el-row class="card-btn">
            <el-button
              type="primary"
              icon="el-icon-caret-top"
              class="btn blue"
              @click="addGoods(item)"
            >
              赞同 {{ item.goodtimes }}
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-caret-bottom"
              class="btn blue"
              @click="addBads(item)"
            ></el-button>
            <el-button
              type="text"
              class="no-background color-default"
              @click="openComment(item)"
            >
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
            <el-button
              v-if="item.showMore"
              type="text"
              class="no-background more right"
              @click="hideMore(item)"
            >
              收起
              <i class="el-icon-arrow-up"></i>
            </el-button>
          </el-row>
        </el-card>
      </el-col>
      <el-col class="panel-right">
        <el-card class="box-card">
          <span class="card-item">
            <i class="el-icon-tickets"></i>
            回答问题
          </span>
          <span class="card-item">
            <i class="el-icon-video-camera"></i>
            发视频
          </span>
          <span class="card-item">
            <i class="el-icon-edit-outline"></i>
            写文章
          </span>
          <span class="card-item">
            <i class="el-icon-chat-dot-round"></i>
            写想法
          </span>
        </el-card>
        <el-card>
          <div class="ProfileSideCreator-analytics">
            <div class="ProfileSideCreator-readCountItem">
              <div class="ProfileSideCreator-readCountTitle">
                今日阅读 (播放) 数
                <div class="Popover ProfileSideCreator-analytics-Popover">
                  <div>
                    <span
                      style="display: inline-flex; align-items: center"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="ProfileSideCreator-readCountNumber">0</div>
              <div class="css-u2c28s">
                <div class="ProfileSideCreator-countDeltaText">昨日数据</div>
                <div class="css-1gqd0v0">0</div>
              </div>
            </div>
            <div class="ProfileSideCreator-readCountItem">
              <div class="ProfileSideCreator-readCountTitle">今日赞同数</div>
              <div class="ProfileSideCreator-readCountNumber">0</div>
              <div class="css-u2c28s">
                <div class="ProfileSideCreator-countDeltaText">昨日数据</div>
                <div class="css-1gqd0v0">0</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      width="50%"
      height="500px"
      class="cmment-dia"
      top="7vh"
      :visible.sync="showComment"
      @beforeClose="showComment = false"
    >
      <Comment :rowid="commentid" reversed></Comment>
    </el-dialog>
  </div>
</template>

<script>
  // 外部组件
  import copyText from '@/utils/clipboard'
  // 组件
  import Comment from '@/components/Comment/index'
  // 接口
  import { getData, updateData } from '@/api/common.js'

  export default {
    name: 'Meetlist',
    components: { Comment },
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
        showComment: false, // 是否展示弹出框
        commentid: 0,
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
      },
      // 点赞
      addGoods(item) {
        updateData({
          indexName: this.indexName,
          conditions: JSON.stringify([{ field: 'id', value: item.id }]),
          dataList: JSON.stringify({
            goodtimes: {
              increment: 1, // 自增
            },
          }),
        }).then((result) => {
          item.goodtimes = result.data.goodtimes
          this.$baseMessage('点赞+1', 'success')
        })
      },
      // 踩
      addBads(item) {
        updateData({
          indexName: this.indexName,
          conditions: JSON.stringify([{ field: 'id', value: item.id }]),
          dataList: JSON.stringify({
            badtimes: {
              increment: 1, // 自增
            },
          }),
        }).then((result) => {
          item.badtimes = result.data.badtimes
          this.$baseMessage('踩+1', 'success')
        })
      },
      // 拼接链接
      getCopyTxt(row) {
        return (
          location.origin +
          '/' +
          location.hash.replace('meetcart', 'meetdetils') +
          `?rowid=${row.id}&type=details`
        )
      },
      // 复制链接
      copy(item, event) {
        let text = this.getCopyTxt(item)
        copyText(text, event)
      },
      // 查看更多
      showMore(row) {
        row.showMore = true
        this.$forceUpdate()
      },
      hideMore(row) {
        row.showMore = false
        this.$forceUpdate()
      },
      getMoreClass(item) {
        item.showMore = item.showMore ?? false
        return item.showMore ? 'show-more' : 'hide-more'
      },
      // 打开评论
      openComment(item) {
        this.commentid = item.id
        this.showComment = true
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
      margin-top: 9px;
    }
    .hide-more {
      height: 155px;
      overflow: hidden;
    }
    .show-more {
      height: calc(100vh - 225px);
      overflow-y: auto;
    }
  }
  .right {
    margin-left: auto;
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

  .more {
    color: #175199;
  }

  .cmment-dia {
    ::v-deep {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0px;
        .comment-list {
          max-height: 300px;
          overflow-y: auto;
        }
      }
    }
  }
  .panel-left {
    width: calc(100% - 296px - 10px);
  }
  .panel-right {
    margin-left: 10px;
    width: 296px;
    .box-card {
      padding: 8px 0 20px;
      position: relative;
      .card-item {
        margin: 0 auto;
        display: inline-flex;
        -ms-flex-direction: column;
        flex-direction: column;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        width: 50px;
        margin-right: 18px;
      }
      .card-item:last-child {
        margin-right: 0px;
      }
      span {
        font-size: 12px;
        line-height: 1;
        text-align: center;
        color: #444;
        i {
          width: 50px;
          height: 40px;
          font-size: 24px;
        }
      }
    }
  }
</style>
