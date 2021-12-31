<template>
  <div v-loading="loading" class="page-container">
    <div style="min-height: 60vh">
      <h1 class="article-title">{{ form.title }}</h1>
      <div class="author-info-block">
        <a href="#" target="_blank" rel="" class="avatar-link">
          <img
            :src="sererIp + form.tb_user.photo"
            class="lazy avatar"
          />
        </a>
        <div class="author-info-box">
          <div class="author-name">
            <a href="#" target="_blank" class="username username ellipsis">
              <span class="name" style="max-width: calc(100% - 50px)">
                {{ form.tb_user.username }}
              </span>
            </a>
          </div>
          <div class="meta-box">
            <time
              :datetime="form.createtime"
              :title="new Date(form.createtime).toString()"
              class="time"
            >
              {{ new Date(form.createtime).toLocaleString() }}
            </time>
            <span class="views-count">
              ·&nbsp;&nbsp;阅读 {{ form.readtime || 0 }}
            </span>
          </div>
        </div>
      </div>
      <div class="article-content">
        <div class="markdown-body" v-html="form.content"></div>
      </div>
    </div>
    <Comment v-if="type === 'details'" :rowid="rowid"></Comment>
  </div>
</template>

<script>
import { baseURL } from '@/config'
import Comment from '@/components/Comment/index'
import { getFirstData } from '@/api/common.js'
export default {
  name: 'Editor',
  components: { Comment },
  data() {
    return {
      indexName: 'tb_article',
      loading: false,
      rowid: '',
      type: '',
      sererIp: baseURL,
      form: {
        title: '',
        type: '',
        content: '',
        readtimes: 0,
        tb_user: {
          username: '',
          photo: '',
        },
      },
    }
  },
  beforeMount() {
    this.rowid = this.$route.query.rowid
    this.type = this.$route.query.type
    if (!this.rowid) {
      this.$router.push({ path: '/meet/meetlist' })
    } else {
      this.getCurr()
    }
  },
  methods: {
    getCurr() {
      const parmas = {
        indexName: this.indexName,
        conditions: JSON.stringify([{ field: 'id', value: this.rowid }]),
        select: JSON.stringify({
          id: true,
          content: true,
          createtime: true,
          ismessage: true,
          readtime: true,
          title: true,
          type: true,
          tb_user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        }),
      }
      this.loading = true
      getFirstData(parmas).then((res) => {
        this.form = res.data
        this.loading = false
      })
    },
  },
}
</script>
<style lang="scss" scoped>

.article-title {
  margin: 0 0 1.667rem;
  font-size: 2.667rem;
  font-weight: 600;
  line-height: 1.31;
  color: #252933;
}

.author-info-block,
.team-follow {
  margin-bottom: 1.667rem;
}

.author-info-block {
  display: flex;
  align-items: center;

  .avatar {
    flex: 0 0 auto;
    margin-right: 1rem;
    width: 3.333rem;
    height: 3.333rem;
    border-radius: 50%;
  }

  .author-name .username {
    display: inline-block;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    color: #515767;
    line-height: 2rem;
  }

  .author-info-box {
    min-width: 0;
    flex-grow: 1;
    flex: 1;
    min-height: 43px;
  }
}

.meta-box {
  font-size: 14px;
  color: #8a919f;
  margin-top: 2px;
  line-height: 22px;
  .time {
    letter-spacing: 1px;
  }
}

.markdown-body {
  p {
    line-height: inherit;
    margin-top: 22px;
    margin-bottom: 22px;
  }
  h2 {
    padding-bottom: 12px;
    border-bottom: 1px solid #ececec;
  }
}

.follow-button {
  margin: 0 0 0 auto;
  padding: 0 1rem;
  height: 34px;
  font-size: 14px;
  color: #1e80ff;
  background: rgba(30, 128, 255, 0.05);
  border: 1px solid rgba(30, 128, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.markdown-body {
  word-break: break-word;
  line-height: 1.75;
  font-weight: 400;
  font-size: 16px;
  overflow-x: hidden;
  color: #333;
}

.markdown-body pre > code {
  font-size: 12px;
  padding: 15px 12px;
  margin: 0;
  word-break: normal;
  display: block;
  overflow-x: auto;
  color: #333;
  background: #f8f8f8;
}

.markdown-body code,
.markdown-body pre {
  font-family: Menlo, Monaco, Consolas, Courier New, monospace;
}

.markdown-body code {
  word-break: break-word;
  border-radius: 2px;
  overflow-x: auto;
  background-color: #fff5f5;
  color: #ff502c;
  font-size: 0.87em;
  padding: 0.065em 0.4em;
}

body {
  word-break: break-word;
  overflow-y: scroll;
}
</style>
