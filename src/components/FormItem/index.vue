<template>
  <div>
    <el-form-item :key="prop" :label="label">
      <template v-if="type === 'input'">
        <el-input
          v-if="dataType === 'string'"
          v-model.trim="data"
          :placeholder="'请输入' + label"
          :maxlength="getMaxLength(maxlength)"
        />
        <el-input
          v-else-if="dataType === 'number'"
          v-model="data"
          :placeholder="'请输入' + label"
          :maxlength="10"
          min="0"
          type="number"
        />
      </template>

      <template v-else-if="type === 'switch'">
        <el-switch v-model="data" />
      </template>

      <template v-else-if="type === 'radio'">
        <el-radio-group v-model="data">
          <el-radio
            v-for="option in options"
            :key="option.label"
            :label="option.label"
          >
            {{ option.text }}
          </el-radio>
        </el-radio-group>
      </template>
    </el-form-item>
  </div>
</template>
<script>
  export default {
    name: 'FormItem',
    props: {
      // 字段值
      // 双向绑定值，字段名为固定，改了之后将不生效
      // value: {
      //   type() {
      //     return String | Number | Boolean
      //   },
      //   default: () => {
      //     return '' 
      //   },
      //   require: false,
      // },
      // 字段中文名
      label: {
        type: String,
        default: () => '',
        require: false,
      },
      // 字段名
      prop: {
        type: String,
        default: () => '',
        require: false,
      },
      // 内容框默认 placeholder
      placeholder: {
        type: String,
        default: () => '请输入',
        require: false,
      },
      // 字段值
      maxlength: {
        type: Number,
        default: () => 50,
      },
      // 字段类型
      type: {
        type: String,
        default: () => 'input',
        require: false,
      },
      // 数据类型
      dataType: {
        type: String,
        default: () => 'number',
        require: false,
      },
      // 子元素
      options: {
        type: Array,
        default: () => [],
        require: false,
      },
    },
    data() {
      return {
        data: '',
      }
    },
    // 监听双向绑定值的改变
    watch: {
      data: {
        handler: function (value) {
          this.$listeners.input(value)
        },
      },
      // value: {
      //   handler: function (value) {
      //     debugger
      //     this.data = value
      //   },
      // },
    },
    mounted() {
      this.data = this.value
    },
    beforeDestroy() {},
    methods: {
      getMaxLength(maxlength) {
        return maxlength ? maxlength : 50
      },
    },
  }
</script>
