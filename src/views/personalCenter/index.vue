<template>
  <div class="personalCenter-container">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="个人简介">
        <el-descriptions title="用户信息">
          <el-descriptions-item label="用户名">
            kooriookami
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            18100000000
          </el-descriptions-item>
          <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-tag size="small">学校</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系地址">
            江苏省苏州市吴中区吴中大道 1188 号
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="基本设置">基本设置</el-tab-pane>
      <el-tab-pane label="安全设置">安全设置</el-tab-pane>
      <el-tab-pane label="账户绑定">账户绑定</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'PersonalCenter',
  data() {
    return {
      tabPosition: 'left',
    }
  },
  created() {},
  methods: {},
}
</script>
