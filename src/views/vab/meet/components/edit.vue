<template>
  <div v-loading="loading" class="page-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="所属模块" prop="type">
        <el-select v-model="form.type">
          <el-option label="会议动态" value="1"></el-option>
          <el-option label="重要时事" value="2"></el-option>
          <el-option label="实时热点" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="vab-quill-content">
        <Editor v-model="form.content"></Editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSee">预览效果</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="预览效果" :visible.sync="dialogTableVisible">
      <div style="min-height: 60vh">
        <h1 class="news-title">{{ form.title }}</h1>
        <div class="news-content" v-html="form.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from '@/components/Editor/index.vue'
  import { updateData, getFirstData } from '@/api/common'
  export default {
    name: 'Meetedit',
    components: { Editor },
    data() {
      return {
        indexName: 'tb_article',
        loading: false,
        borderColor: '#dcdfe6',
        dialogTableVisible: false,
        form: {
          title: '',
          type: '',
          content: '',
        },
        type: '',
        rules: {
          title: [
            {
              required: true,
              message: '请输入标题',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择模块',
              trigger: 'change',
            },
          ],
          content: [
            {
              required: true,
              message: '请输入内容',
              trigger: 'blur',
            },
          ],
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
      // updateContent(val) {
      //   this.form.content = val
      // },
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
          }),
        }
        this.loading = true
        getFirstData(parmas).then((res) => {
          this.form = res.data
          this.loading = false
        })
      },
      cancel() {
        this.$router.go(-1)
      },
      handleSee() {
        this.$refs['form'].validate((valid) => {
          this.$refs.form.validateField('content', (errorMsg) => {})
          if (valid) {
            this.dialogTableVisible = true
          } else {
            return false
          }
        })
      },
      handleSave() {
        this.$refs['form'].validate((valid) => {
          this.$refs.form.validateField('content', (errorMsg) => {
            this.borderColor = '#dcdfe6'
            if (errorMsg) {
              this.borderColor = '#F56C6C'
            }
          })
          if (valid) {
            updateData({
              indexName: this.indexName,
              dataList: JSON.stringify(this.form),
              conditions: JSON.stringify([
                { field: 'id', value: this.form.id },
              ]),
            })
              .then((res) => {
                this.loading = false
                this.$baseMessage('更新成功!', 'success')
                this.$router.push({
                  path: '/meet/meetdetils',
                  query: {
                    rowid: this.form.id,
                    type: 'details',
                  },
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .meet-container {
    .news {
      &-title {
        text-align: center;
      }

      &-content {
        ::v-deep {
          p {
            line-height: 30px;

            img {
              display: block;
              margin-right: auto;
              margin-left: auto;
            }
          }
        }
      }
    }

    .vab-quill-content {
      ::v-deep {
        .el-form-item__content {
          line-height: normal;
        }
      }
    }
  }
</style>
