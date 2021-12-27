<template>
  <div>
    <div class="comment-main">
      <span class="delete">删除</span>
      <div class="user-box">
        <div class="popover-box user-popover">
          <span class="username username">
            <span
              class="name"
              style="max-width: 128px"
            >
              {{ data.tb_user.username }}
            </span>
          </span>
        </div>

        <div
          v-if="pname && pname.length>0"
          class="rely-box"
        >
          <span data-v-c234f650="">回复</span>
          <div class="popover-box user-popover">
            {{pname}}
          </div>
        </div>

        <time
          :datetime="data.createtime"
          :title="new Date(data.createtime).toString()"
          class="time"
        >
          {{ new Date(data.createtime).toLocaleString() }}
          <!-- 1月前 -->
        </time>
      </div>
      <div class="content">{{ data.content }}</div>
      <div class="action-box">
        <span
          class="item"
          @click="openInput"
        >
          <vab-icon icon="comment-dots" />
          {{!isShow? data.children && data.children.length > 0 ? data.children.length : '回复' :'取消回复'}}
        </span>
      </div>
    </div>

    <div class="subcomment-wrapper">
      <EnterInput
        v-if="isShow"
        class="replyform"
        @submit="submitTxt"
      > </EnterInput>
    </div>
  </div>

</template>

<script>
import EnterInput from './enterInput.vue'
export default {
  name: 'UserBlock',
  components: { EnterInput },
  props: {
    row: {
      type: Object,
      default () {
        return {}
      },
      required: true,
    },
    pname: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      isShow: false,
      data: {
        tb_user: {},
        children: [],
      }
    }
  },
  beforeMount () {
    this.data = { ...this.data, ...this.row }
  },
  methods: {
    submitTxt (val) {
      this.$emit('submit', { pid: this.data.id, content: val })
      this.isShow = false
    },
    openInput (e) {
      this.isShow = !this.isShow
    }
  },
}
</script>

<style lang="scss" scoped>
.popover-box {
  display: inline;
}
.replyform {
  margin-top: 12px;
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
.comment-main {
  position: relative;
  .time {
    font-size: 14px;
    color: #8a919f;
    line-height: 22px;
    margin-left: auto;
  }
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

  .user-box {
    display: flex;
    align-items: center;
    .username {
      display: flex;
      align-items: center;
      .name {
        font-weight: 500;
        font-size: 15px;
        color: #252933;
        max-width: 90px;
        line-height: 26px;
      }
    }
    .rely-box {
      display: flex;
      align-items: center;
      span {
        padding: 0 12px;
        font-size: 14px;
        line-height: 22px;
        color: #8a919f;
      }
    }
  }
}

.action-box {
  display: flex;
  align-items: center;
  margin-top: 8px;
  .item {
    display: flex;
    align-items: center;
    margin-right: 16px;
    line-height: 22px;
    font-size: 14px;
    cursor: pointer;
    color: #8a919f;
  }
  .item svg {
    fill: #8a919f;
    margin-right: 4px;
    font-size: 16px;
  }
}
</style>
