<template>
  <div v-loading="pageloading" class="page-panle">
    <SearchBar></SearchBar>

    <div class="boder"></div>

    <div class="list-content list-wrap">
      <el-col class="mod-ul">
        <template v-for="o in 21">
          <div :key="o" class="mod-li">
            <div class="list-img vertical">
              <div class="mod-link-wrap">
                <a href="#" class="mod-link" target="_blank">
                  <div style="height: 100%; overflow: hidden">
                    <img class="mod-cover" :src="imgUrl" />
                  </div>
                  <div class="icon-tr">独播</div>
                </a>
              </div>
              <div class="title-wrap">
                <p class="main">
                  <span class="text-score">7.8</span>
                  <a
                    data-pb=""
                    rseat=""
                    title="三重威胁之跨国大营救"
                    href="//www.iqiyi.com/v_19rsi5tllg.html"
                    class="link-txt"
                    target="_blank"
                  >
                    <span>三重威胁之跨国大营救</span>
                  </a>
                </p>
                <p class="sub">
                  主演:
                  <span>
                    <a
                      target="_blank"
                      href="//www.iqiyi.com/lib/s_214544205.html"
                      title="陈虎"
                      class="sub-link"
                    >
                      陈虎
                    </a>
                    <span>/</span>
                  </span>
                  <span>
                    <a
                      target="_blank"
                      href="//www.iqiyi.com/lib/s_215045605.html"
                      title="托尼·贾"
                      class="sub-link"
                    >
                      托尼·贾
                    </a>
                    <span>/</span>
                  </span>
                  <span>
                    <a
                      target="_blank"
                      href="//www.iqiyi.com/lib/s_214528405.html"
                      title="卢靖姗"
                      class="sub-link"
                    >
                      卢靖姗
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </template>
      </el-col>
    </div>
  </div>
</template>

<script>
  import SearchBar from '@/components/SearchBar/index.vue'
  // import { getData } from '@/api/common.js'
  export default {
    name: 'Meetlist',
    components: { SearchBar },
    data() {
      return {
        pageloading: false,
        indexName: 'tb_article',
        imgUrl: require('@/assets/study/1.jpg'),
      }
    },
    methods: {
      searchData() {},
    },
  }
</script>

<style lang="scss" scoped>
  .list-wrap {
    position: relative;
    margin: 0 auto 20px;
    overflow: hidden;
    .mod-ul {
      font-size: 0;
      margin-right: -20px;
    }

    .mod-li {
      vertical-align: top;
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 30px;
    }
  }

  .list-img.vertical {
    width: 197px;
    .mod-link {
      width: 197px;
      height: 263px;
    }
  }

  .list-img {
    .mod-link,
    .mod-link-wrap {
      z-index: 1;
      position: relative;
    }
    .mod-link {
      display: block;
      overflow: hidden;
    }
    .mod-cover {
      display: block;
      width: 100%;
      height: 100%;
      transition: all 0.25s ease-in-out;
      backface-visibility: hidden;
      background-size: 100%;
    }
    .icon-tr {
      position: absolute;
      right: 5px;
      top: 0;
    }

    .title-wrap {
      position: relative;
      background: #f8f8f8;
      line-height: 1;
      padding: 6px 10px;

      .main {
        line-height: 23px;
        height: 23px;
        font-size: 15px;
        vertical-align: baseline;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0px;
        padding: 0px;
      }
    }
  }

  .boder {
    border-top: 1px solid #e9e9e9;
    margin-top: 15px;
    margin-bottom: 40px;
  }

  .text-score {
    float: right;
    color: #ff6200;
    font-size: 16px;
  }

  .link-txt {
    color: #222;
  }
</style>
