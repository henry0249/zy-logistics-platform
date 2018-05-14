<template>
  <div class="flex g-container g-index">
    <div class="flex ac filter-box">
      <div v-for="(item,index) in filterKey" :key="index" v-ripple class="filter" :class="item.io?'active-color':''" @click="filterMethods(item,index)">{{item.label}}</div>
    </div>
    <div class="list-box" v-loading="loading">
      <el-table :data="listArr" style="width: 100%" :height="heightValue">
        <el-table-column v-for="(item,index) in tableKey" :key="index" :prop="item.key" :label="item.keyValue">
        </el-table-column>
        <el-table-column label="操作" width="70">
          <div slot-scope="scope">
            <el-button size="mini" type="success">接单</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        heightValue: 0,
        data: [],
        loading: false,
        filterKey: [{
          key: 'cement',
          label: '水泥',
          io: false,
        }, {
          key: 'sand',
          io: false,
          label: '砂石'
        }, {
          key: 'board',
          io: false,
          label: '板材'
        }, {
          key: 'rebar',
          io: false,
          label: '钢筋'
        }, {
          key: 'huagong',
          io: false,
          label: '化工'
        }],
        n: 20,
        tableKey: [{
          key: 'name',
          keyValue: '订单'
        }, {
          key: 'publisher',
          keyValue: '发布者'
        }, {
          key: 'PublishingCompany',
          keyValue: '发布公司'
        }, {
          key: 'creatAt',
          keyValue: '创建时间'
        }, {
          key: 'termAt',
          keyValue: '期限时间'
        }, {
          key: 'type',
          keyValue: '类型'
        }, {
          key: 'price',
          keyValue: '总价(元)'
        }, {
          key: 'tonnage',
          keyValue: '吨位(t)'
        }, {
          key: 'from',
          keyValue: '出发地'
        }, {
          key: 'destination',
          keyValue: '目的地'
        }]
      }
    },
    computed: {
      height() {
        let height = document.body.scrollHeight
        return height - 81
      },
      listArr() {
        let arr = []
        this.list.forEach((item, index) => {
          if (index < this.n) {
            arr.push(item)
          }
        });
        return arr
      },
      list() {
        let list = [{
          name: '测试订单0',
          publisher: '发布者0',
          PublishingCompany: '发布公司0',
          creatAt: '2018-5-10 10:00:00',
          termAt: '2018-6-10 10:00:00',
          type: '水泥0',
          price: 100000,
          tonnage: 50,
          destination: '广西桂平市凤凰商务大厦',
          from: '如家酒店'
        }]
        for (let index = 1; index < 1000; index++) {
          let obj = {}
          for (const key in list[0]) {
            if (list[0].hasOwnProperty(key)) {
              obj[key] = list[0][key] + index
            }
          }
          list.push(obj)
        }
        return list
      }
    },
    methods: {
      filterMethods(item, index) {
        this.filterKey.forEach((v, i) => {
          if (i == index) {
            item.io = true
          } else {
            v.io = false
          }
        });
      },
      scrollMore() {
        this.loading = true
        this.n += 20
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
    created() {
      this.heightValue = document.body.clientHeight - 81
    },
    mounted() {
      document.getElementsByClassName('el-table__body-wrapper')[0].addEventListener('scroll', (e) => {
        console.log(document.getElementsByClassName('el-table__body-wrapper'));
        let scrollHeight = document.getElementsByClassName('is-scrolling-none')[0].scrollHeight
        let clientHeight = document.getElementsByClassName('is-scrolling-none')[0].clientHeight
        let scrollTop = document.getElementsByClassName('is-scrolling-none')[0].scrollTop
        if (scrollHeight == clientHeight + scrollTop) {
          this.scrollMore()
        }
      })
    }
  }
</script>

<style scoped>
  .g-index {
    height: calc(100vh - 41px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .filter-box {
    background: #fff;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    color: #757575;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .filter {
    padding: 0 10px;
    color: #757575;
    border-radius: 10px;
  }
  .active-color {
    color: #519cf4
  }
  .list-box {
    width: calc(100% - 20px);
    height: calc(100vh - 81px)
  }
</style>