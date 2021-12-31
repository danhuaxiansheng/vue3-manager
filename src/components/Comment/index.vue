<template>
  <div class="container comment-list-box">
    <div class="comment-form">
      <div class="header">
        <span class="header-title">评论</span>
      </div>
      <div class="content">
        <div class="avatar-box">
          <img :src="photo" class="lazy avatar" />
        </div>
        <EnterInput ref="input" @submit="submitStr"></EnterInput>
      </div>
    </div>
    <div class="comment-list-wrapper">
      <div class="title">
        全部评论 {{ dataList.length }}
        <div class="sort">
          <div class="item active">
            <vab-icon icon="clock" />
            最新
          </div>
        </div>
      </div>
      <div class="comment-list">
        <PopoverMessage
          :data-list="dataList"
          @submit="submitObj"
        ></PopoverMessage>
      </div>
    </div>
  </div>
</template>

<script>
import { baseURL } from '@/config'
import { getData, addData } from '@/api/common.js'
import PopoverMessage from './components/PopoverMessage.vue'
import EnterInput from './components/enterInput.vue'
export default {
  name: 'VabUpload',
  components: { PopoverMessage, EnterInput },
  props: {
    rowid: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      indexName: 'tb_article_message',
      dataList: [],
      photo: baseURL + this.$store.state.user.photo,
    }
  },
  beforeMount() {
    this.getData()
  },
  methods: {
    getData() {
      const parmas = {
        indexName: this.indexName,
        conditions: JSON.stringify([
          {
            field: 'artid',
            value: this.rowid,
          },
        ]),
        sort: JSON.stringify([{ createtime: 'asc' }]),
        select: JSON.stringify({
          id: true,
          pid: true,
          content: true,
          createtime: true,
          tb_user: {
            select: {
              id: true,
              username: true,
              photo: true,
            },
          },
        }),
      }
      this.tableLoading = true
      getData(parmas).then((res) => {
        this.tableLoading = false
        this.dataList = this.handMessageData(res.data)
      })
    },
    handMessageData(data) {
      let list = []
      if (data && data.length > 0) {
        let firstList = data.filter((element) => !element.pid)
        firstList.forEach((element) => {
          let children = this.eachChild(
            element.id,
            JSON.parse(JSON.stringify(data))
          )
          if (children && children.length > 0) {
            element.children = children
          }
          list.push(element)
        })
      }
      return list
    },
    submitStr(val) {
      addData({
        indexName: this.indexName,
        dataList: JSON.stringify({
          content: val,
          artid: this.rowid,
          createid: this.$store.state.user.userid,
        }),
      }).then((res) => {
        this.getData()
        this.$refs.input.clear()
      })
    },

    submitObj(obj) {
      addData({
        indexName: this.indexName,
        dataList: JSON.stringify({
          artid: this.rowid,
          createid: this.$store.state.user.userid,
          ...obj,
        }),
      }).then((res) => {
        this.getData()
      })
    },

    eachChild(pid, allData) {
      let list = []
      let firstList = allData.filter((element) => pid && pid === element.pid)
      firstList.forEach((element) => {
        let children = this.eachChild(
          element.id,
          JSON.parse(JSON.stringify(allData))
        )
        if (children && children.length > 0) {
          list = children.concat(list)
          // element.children = children
        }
        list.unshift(element)
      })
      return list
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
}
.container:after {
  display: table;
  content: '';
  clear: both;
}

.comment-list-box {
  border-radius: 4px;
  background-color: #fff;
  padding-left: 2.67rem;
  padding-right: 2.67rem;
  box-sizing: border-box;
  max-width: 1140px;
  padding-bottom: 2rem;
  margin-top: 1.67rem;
}

.comment-form {
  display: flex;
  position: relative;
  padding-top: 2rem;
  border-radius: 2px;
  flex-direction: column;
  .content {
    display: flex;
    align-items: flex-start;
  }
  .header {
    margin-bottom: 2rem;
    .header-title {
      font-size: 18px;
      line-height: 30px;
      font-weight: 600;
      color: #252933;
    }
  }
}
.avatar {
  margin-right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.auth-card {
  position: relative;
}

.avatar-box {
  flex: 0 0 auto;
}

.comment-list-wrapper {
  padding: 40px 0 16px;
}

.sort,
.title {
  display: flex;
  align-items: center;
}

.sort {
  font-size: 14px;
  color: #4e5969;
  font-weight: 400;
  cursor: pointer;
  border-radius: 2px;
  padding: 3px;
}

.title {
  position: relative;
  line-height: 30px;
  font-weight: 600;
  font-size: 18px;
  color: #252933;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 8px;
}

.comment {
  display: flex;
  padding: 16px 0;
}

.popover {
  height: 33px;
}
.popover-box {
  display: inline;
}
.content-box {
  flex: 1 1 auto;
  margin-left: 16px;
}
.user-link {
  flex: 0 0 auto;
}
a {
  text-decoration: none;
  cursor: pointer;
  color: #909090;
}

.comment-main {
  position: relative;
  .delete {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 14px;
    line-height: 22px;
    text-align: right;
    color: #f53f3f;
    cursor: pointer;
    z-index: 9;
    display: none;
  }
}
.content-box .user-box {
  display: flex;
  align-items: center;
  .username {
    display: flex;
    align-items: center;
  }
}

.content {
  font-weight: 400;
  font-size: 14px;
  line-height: 2rem;
  color: #515767;
  margin-top: 8px;
  -webkit-line-clamp: 6;
}

.content,
.content.hasimage {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
.content-box .time {
  margin-left: auto;
}
</style>
