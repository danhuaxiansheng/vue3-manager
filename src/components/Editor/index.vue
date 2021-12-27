<template>
  <div class="editor-container">
    <div :id="id"></div>
  </div>
</template>
<script>
  import wangeditor from 'wangeditor'
  import { baseURL } from '@/config'
  import { UploadImg } from '@/api/page/common'

  export default {
    name: 'WngEditor',
    props: {
      // 节点 id
      id: {
        type: String,
        default: () => 'wangeditor',
        require: false,
      },
      // 是否禁用
      isDisable: {
        type: Boolean,
        default: () => false,
        require: false,
      },
      // 内容框默认 placeholder
      placeholder: {
        type: String,
        default: () => '请输入内容',
        require: false,
      },
      // 双向绑定
      // 双向绑定值，字段名为固定，改了之后将不生效
      value: {
        type: String,
        default: () => '',
      },
    },
    data() {
      return {
        isParent: true,
        isHtmlChange: false,
      }
    },
    // 监听双向绑定值的改变
    watch: {
      value: {
        handler: function (value) {
          this.isParent = true
          // 防止循环触发change事件
          if (!this.isHtmlChange) {
            this.editor.txt.html(value)
          } else {
            this.isParent = false
            this.isHtmlChange = false
          }
        },
      },
    },
    mounted() {
      this.initWangeditor()
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy()
      this.editor = null
    },
    methods: {
      initWangeditor() {
        this.editor = new wangeditor(`#${this.id}`)
        this.editor.config.zIndex = 1
        this.editor.config.placeholder = this.placeholder
        this.editor.config.uploadImgShowBase64 = true
        this.editor.config.showLinkImg = false
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M

        // 设置编辑区域高度为 500px
        this.editor.config.height = 420
        this.editor.txt.html(this.value || '')
        this.onWangeditorChange()

        this.editor.create()
        this.isDisable ? this.editor.disable() : this.editor.enable()
      },

      // 内容改变时
      onWangeditorChange() {
        this.editor.config.onchange = (html) => {
          if (this.isParent && !this.isHtmlChange) {
            this.isHtmlChange = true
            this.$listeners.input(html)
          }
          // 插件自身修改值 同步父数据
          else if (!this.isParent || this.isHtmlChange) {
            this.isHtmlChange = true
            this.$listeners.input(html)
          }
        }
        this.editor.config.customUploadImg = function (
          resultFiles,
          insertImgFn
        ) {
          // 也可以用一个已有的form元素来初始化FormData对象
          const formData = new FormData()
          // 这里是把上传接口所有的参数都append到formData中
          formData.append('files', resultFiles[0])
          UploadImg(formData).then((res) => {
            let imgUrl = baseURL + '/' + res.data
            // resultFiles 是 input 中选中的文件列表
            // 上传图片，返回结果，将图片插入到编辑器中
            insertImgFn(imgUrl)
          })
        }
      },
    },
  }
</script>
