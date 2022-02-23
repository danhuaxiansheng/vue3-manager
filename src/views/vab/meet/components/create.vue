<template>
  <div v-loading="loading" class="page-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="所属模块" prop="typeid">
        <el-select v-model="form.typeid">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="vab-quill-content">
        <!-- <vab-quill
          v-model="form.content"
          :min-height="400"
          :options="options"
        ></vab-quill> -->
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
  import { addData, getData } from '@/api/common.js'
  export default {
    name: 'Meetcreate',
    components: { Editor },
    data() {
      return {
        indexName: 'tb_article',
        loading: false,
        borderColor: '#dcdfe6',
        dialogTableVisible: false,
        typeList: [],
        form: {
          title: '',
          typeid: '',
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
          typeid: [
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
    created() {
      this.getTypeList()
    },
    methods: {
      getTypeList() {
        const parmas = {
          indexName: 'tb_article_type',
          conditions: JSON.stringify([]),
          sort: JSON.stringify([{ id: 'asc' }]),
        }
        getData(parmas).then((res) => {
          this.typeList = res.data
        })
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
      cancel() {
        this.$router.go(-1)
      },
      handleSave() {
        this.$refs['form'].validate((valid) => {
          this.$refs.form.validateField('content', (errorMsg) => {
            this.borderColor = '#dcdfe6'
            if (errorMsg) {
              this.borderColor = '#F56C6C'
            }
          })

          debugger
          if (valid) {
            this.form.createid = this.$store.getters['user/userid']
            addData({
              indexName: this.indexName,
              dataList: JSON.stringify(this.form),
            })
              .then((res) => {
                this.loading = false
                this.$baseMessage('新增成功!', 'success')

                this.$router.push({
                  path: '/meet/meetdetils',
                  query: {
                    rowid: res.data.id,
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
  .page-container {
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
