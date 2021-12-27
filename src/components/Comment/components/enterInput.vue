<template>
  <div class="form-box">
    <div class="auth-card">
      <div class="input-box">
        <el-input
          v-model.trim="textarea"
          maxlength="200"
          class="rich-input empty"
          placeholder="输入评论（Enter换行，Ctrl + Enter发送）"
          type="textarea"
        />
      </div>
    </div>
    <div class="action-box">
      <div class="submit">
        <span>Ctrl + Enter</span>
        <el-button
          class="submit-btn"
          @click="submitTxt"
        >
          发表评论
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Usermessage',
  props: {
    value: {
      type: String,
      default () {
        return ''
      },
    },
  },
  data () {
    return {
      textarea: '',
    }
  },
  beforeMount () {
    this.textarea = this.value
  },
  methods: {
    clear () {
      this.textarea = ''
    },
    submitTxt () {
      if (!this.textarea) {
        return false
      }
      this.$emit('submit', this.textarea)
    },
  },
}
</script>

<style lang="scss" scoped>
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

.form-box {
  flex: 1 1 auto;
  position: relative;
  .input-box {
    font-size: 0;
    transition: all 0.3s;
    background: #f2f3f5;
    border: 1px solid #f2f3f5;
    border-radius: 4px;
  }

  .rich-input.el-textarea ::v-deep .el-textarea__inner {
    position: relative;
    padding: 8px 12px;
    color: #252933;
    outline: none;
    min-height: 66px;
    box-sizing: border-box;
    line-height: 22px;
    font-size: 14px;
    resize: none;
    height: 66px;
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
}

.action-box .item svg {
  fill: #8a919f;
  margin-right: 4px;
  font-size: 16px;
}
</style>
