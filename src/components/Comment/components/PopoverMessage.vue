/* eslint-disable vue/no-v-for-template-key */
<template>
  <div>
    <div
      v-for="item in dataList"
      :key="item.id"
      class="comment"
    >
      <div class="popover-box user-popover popover">
        <img
          :src="sererIp + item.tb_user.photo"
          class="lazy avatar"
        />
      </div>
      <div class="content-box">
        <Block
          :row="item"
          @submit="submitTxt"
        ></Block>
        <div
          v-if="item.children&&item.children.length>0"
          class="subcomment-wrapper"
        >
          <div class="sub-comment-list">
            <template v-for="child in item.children">
              <div
                :key="child.id"
                class="subcomment sub-comment"
              >
                <div class="popover-box user-popover">
                  <img
                    :src="sererIp + child.tb_user.photo"
                    class="lazy avatar"
                  >
                </div>
                <div class="content-box">
                  <Block
                    :row="child"
                    :pname="item.id!== child.pid?getPname( child.pid,item.children):''"
                    @submit="submitTxt"
                  ></Block>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseURL } from '@/config'
import Block from './block.vue'


export default {
  name: 'PopoverMessage',
  components: { Block },
  props: {
    dataList: {
      type: Array,
      default () {
        return []
      },
      required: true,
    },
  },
  data () {
    return {
      sererIp: baseURL,
    }
  },
  beforeMount () { },
  methods: {
    submitTxt (obj) {
      this.$emit('submit', obj)
    },
    getPname (pid, list) {
      if (!pid) {
        return ''
      } else {
        let filList = list.filter(item => { return item.id === pid })
        return filList.length > 0 ? filList[0].tb_user.username : ''
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.title {
  display: flex;
  align-items: center;
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
.sub-comment-list {
  padding: 16px;
  background: rgba(247, 248, 250, 0.7);
  border-radius: 4px;
}
.sub-comment-list:first-child {
  margin-top: 16px;
}
.subcomment:not(:first-child) {
  margin-top: 24px;
}
.popover {
  height: 33px;
}
.popover-box {
  display: inline;
}
.subcomment {
  display: flex;
}
.subcomment .avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
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
.content-box {
  flex: 1 1 auto;
  margin-left: 16px;
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

.submit {
  flex: 0 0 auto;
  margin-left: auto;
  span {
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.2px;
    color: #86909c;
    margin-right: 16px;
  }
  .submit-btn {
    flex: 0 0 auto;
    margin-left: auto;
    width: 92px;
    text-align: center;
    font-size: 14px;
    line-height: 36px;
    background: #1e80ff;
    border-radius: 4px;
    color: #fff;
    padding: 0;
    cursor: pointer;
  }
}
</style>
