<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>访问量</span>
          </div>
          <vab-chart autoresize theme="vab-echarts-theme" :option="fwl" />
          <div class="bottom">
            <span>
              日均访问量:
              <vab-count
                :start-val="config1.startVal"
                :end-val="config1.endVal"
                :duration="config1.duration"
                :separator="config1.separator"
                :prefix="config1.prefix"
                :suffix="config1.suffix"
                :decimals="config1.decimals"
              />
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>日志审计</span>
          </div>
          <vab-chart autoresize theme="vab-echarts-theme" :option="sqs" />
          <div class="bottom">
            <span>
              日志数:
              <vab-count
                :start-val="config2.startVal"
                :end-val="config2.endVal"
                :duration="config2.duration"
                :separator="config2.separator"
                :prefix="config2.prefix"
                :suffix="config2.suffix"
                :decimals="config2.decimals"
              />
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <router-link :to="item.link" >
          <el-card class="icon-panel" shadow="never">
            <vab-icon
              :style="{ color: item.color }"
              :icon="['fas', item.icon]"
            ></vab-icon>
            <p>{{ item.title }}</p>
          </el-card>
        </router-link>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>会议记录</span>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="activity in activities"
              :key="activity.id"
              :timestamp="parseTime(activity.createtime)"
            >
              <el-link type="primary" @click="jumpMeet(activity)">
                {{ activity.title }}
              </el-link>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>回复我的</span>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="rm in rmList"
              :key="rm.id"
              :timestamp="parseTime(rm.createtime)"
            >
              <div class="avatar-panle">
                <img :src="sererIp + rm.tb_user.photo" class="lazy avatar" />
                <div class="author-info-box">
                  <div class="author-name">
                    <span class="name" style="max-width: calc(100% - 50px)">
                      {{ rm.tb_user.username }}
                    </span>
                  </div>
                  <el-link type="primary" @click="jumpDetails(rm)">
                    {{ rm.content }}
                  </el-link>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VabChart from '@/plugins/echarts'
import { parseTime } from '@UTILS/index.js'
import { getData } from '@/api/common.js'
import { baseURL } from '@/config'
export default {
  name: 'Index',
  components: {
    VabChart,
  },
  data() {
    return {
      sererIp: baseURL,
      config1: {
        startVal: 0,
        endVal: this.$baseLodash.random(20000, 60000),
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 3000,
      },
      config2: {
        startVal: 0,
        endVal: this.$baseLodash.random(1000, 20000),
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 3000,
      },
      //访问量
      fwl: {
        grid: {
          top: '4%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            data: [10, 52, 20, 33, 39, 33, 22],
            smooth: true,
            areaStyle: {},
          },
        ],
      },
      //授权数
      sqs: {
        grid: {
          top: '4%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            /*boundaryGap: false,*/
            data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '授权数',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 20, 33, 39, 33, 22],
          },
        ],
      },

      //更新日志
      reverse: true,
      activities: [],
      rmList: [],
      //其他信息
      userAgent: navigator.userAgent,
      //卡片图标
      iconList: [
        {
          icon: 'bullhorn',
          title: '公告',
          link: '',
          color: '#ff85c0',
        },
        {
          icon: 'file-signature',
          title: '创建会议记录',
          link: '/meet/meetcreate',
          color: '#ffc069',
        },
        {
          icon: 'book',
          title: '学习资料',
          link: '/material/studylist',
          color: '#ff85c0',
        },
        {
          icon: 'video',
          title: '视频资料',
          link: '/material/audiolist',
          color: '#ff85c0',
        },
        {
          icon: 'chalkboard-teacher',
          title: '入职资料',
          link: '/material/studylist',
          color: '#ff9c6e',
        },
        {
          icon: 'clipboard-list',
          title: '日志审计',
          link: '/log/loginLog',
          color: '#95de64',
        },

        // {
        //   icon: 'gift',
        //   title: '礼物',
        //   link: '',
        //   color: '#ffd666',
        // },
      ],
    }
  },
  created() {
    this.fetchData()
    this.getRme()
  },

  methods: {
    parseTime(val) {
      return parseTime(new Date(val), '{y}-{m}-{d} {h}:{i}:{s}')
    },
    jumpMeet(row) {
      this.$router.push({
        path: '/meet/meetdetils',
        query: {
          rowid: row.id,
          type: 'details',
        },
      })
    },
    jumpDetails(row) {
      this.$router.push({
        path: '/meet/meetdetils',
        query: {
          rowid: row.artid,
          type: 'details',
        },
      })
    },
    getRme() {
      const tableName = 'tb_article_message'
      const parmas = {
        indexName: tableName,
        select: JSON.stringify({ id: true }),
        conditions: JSON.stringify([
          {
            field: 'createid',
            value: this.$store.state.user.userid,
          },
        ]),
      }
      this.tableLoading = true
      getData(parmas).then((res) => {
        let ids = []
        res.data.forEach((element) => {
          ids.push(element.id)
        })

        getData({
          indexName: tableName,
          select: JSON.stringify({
            id: true,
            content: true,
            artid: true,
            createtime: true,
            tb_user: {
              select: {
                id: true,
                username: true,
                photo: true,
              },
            },
          }),
          conditions: JSON.stringify([
            {
              field: 'pid',
              value: ids,
              type: '内部匹配',
            },
            {
              field: 'createid',
              value: this.$store.state.user.userid,
              type: '不等于',
            },
          ]),
        }).then((resList) => {
          this.tableLoading = false
          this.rmList = resList.data
        })
      })
    },
    fetchData() {
      const parmas = {
        indexName: 'tb_article',
        conditions: JSON.stringify([]),
        sort: JSON.stringify([{ createtime: 'asc' }]),
      }
      this.tableLoading = true
      getData(parmas).then((res) => {
        this.tableLoading = false
        this.activities = res.data
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.index-container {
  padding: 0 !important;
  margin: 0 !important;
  background: #f5f7f8 !important;

  ::v-deep {
    .el-alert {
      padding: $base-padding;

      &--info.is-light {
        min-height: 82px;
        padding: $base-padding;
        margin-bottom: 15px;
        color: #909399;
        background-color: $base-color-white;
        border: 1px solid #ebeef5;
      }
    }

    .el-card__body {
      .echarts {
        width: 100%;
        height: 115px;
      }
    }
  }

  .card {
    ::v-deep {
      .el-card__body {
        .echarts {
          width: 100%;
          height: 305px;
        }
      }
    }
  }

  .bottom {
    padding-top: 20px;
    margin-top: 5px;
    color: #595959;
    text-align: left;
    border-top: 1px solid $base-border-color;
  }

  .table {
    width: 100%;
    color: #666;
    border-collapse: collapse;
    background-color: #fff;

    td {
      position: relative;
      min-height: 20px;
      padding: 9px 15px;
      font-size: 14px;
      line-height: 20px;
      border: 1px solid #e6e6e6;

      &:nth-child(odd) {
        width: 20%;
        text-align: right;
        background-color: #f7f7f7;
      }
    }
  }

  .icon-panel {
    height: 117px;
    text-align: center;
    cursor: pointer;

    svg {
      font-size: 40px;
    }

    p {
      margin-top: 10px;
    }
  }

  .bottom-btn {
    button {
      margin: 5px 10px 15px 0;
    }
  }
}
.avatar-panle {
  display: flex;
  align-items: center;
}
.avatar {
  flex: 0 0 auto;
  margin-right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
</style>
