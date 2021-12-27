<template>
  <div class="page-searhbar qy-list-category">
    <div class="category-class category-class2">
      <div class="category-list">
        <span class="category-item">
          <span class="category-text">综合排序</span>
        </span>
        <span class="category-item selected">
          <span class="category-text">热播榜</span>
        </span>
        <span class="category-item">
          <span class="category-text">好评榜</span>
        </span>
        <span class="category-item">
          <span class="category-text">新上线</span>
        </span>
      </div>
    </div>

    <div class="category-class category-class2">
      <div class="category-list">
        <span class="category-item">
          <span class="category-text">全部类型</span>
        </span>
        <span class="category-item selected">
          <span class="category-text">励志</span>
        </span>
        <span class="category-item">
          <span class="category-text">好评榜</span>
        </span>
        <span class="category-item">
          <span class="category-text">新上线</span>
        </span>
      </div>
    </div>
    <div class="category-class category-class2">
      <div class="category-list">
        <span class="category-item selected">
          <span class="category-text">全部年份</span>
        </span>
        <span class="category-item">
          <span class="category-text">2021</span>
        </span>
        <span class="category-item">
          <span class="category-text">2020</span>
        </span>
        <span class="category-item">
          <span class="category-text">2019</span>
        </span>
        <span class="category-item">
          <span class="category-text">2018</span>
        </span>
        <span class="category-item">
          <span class="category-text">2017</span>
        </span>
        <span class="category-item">
          <span class="category-text">2016-2011</span>
        </span>
        <span class="category-item">
          <span class="category-text">2010-2000</span>
        </span>
        <span class="category-item">
          <span class="category-text">90年代</span>
        </span>
        <span class="category-item">
          <span class="category-text">80年代</span>
        </span>
        <span class="category-item">
          <span class="category-text">更早</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import { parseTime } from '@UTILS/index.js'
  // import { getData } from '@/api/page/common.js'
  export default {
    // props: {
    // },
    data() {
      return {
        tableData: [],
        tableLoading: false,
        sort: null,
      }
    },
    beforeMount() {},
    mounted() {},
    methods: {
      timeFormat(val) {
        return val ? parseTime(new Date(val), '{y}-{m}-{d} {h}:{i}:{s}') : '-'
      },
    },
  }
</script>

<style lang="scss" scoped>
  .qy-list-category {
    .category-list {
      overflow: hidden;
    }
    .category-class2 {
      margin-left: -15px;
      padding-right: 70px;
      height: 36px;
      font-size: 0;

      .category-item.selected {
        background-color: #efefef;
      }

      .category-item {
        font-size: 14px;
        height: 26px;
        line-height: 26px;
        padding: 0 10px;
        margin: 10px 0 0 15px;
        text-align: center;
        border-radius: 13px;
        cursor: pointer;
      }
    }

    .category-item.selected,
    .category-item:hover {
      color: #00be06;
    }
    .category-item {
      display: inline-block;
      color: #222;
      cursor: pointer;
    }
  }
</style>
