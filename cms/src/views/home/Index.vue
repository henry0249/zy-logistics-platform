<template>
  <div class="flex g-container g-index" v-loading="loading">
    <div class="flex ac filter-box">
      <div v-for="(item,index) in filterKey" :key="index" v-ripple class="filter" :class="item.io?'active-color':''" @click="filterMethods(item,index)">{{item.label}}</div>
    </div>
    <div class="list-box" ref="listBox">
      <el-table :data="listArr" stripe style="width: 100%" :height="heightValue">
        <el-table-column v-for="(item,index) in tableKey" :key="index" :prop="item.key" :label="item.keyValue" :width="item.width" :fixed="index ==0?true:false">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <div slot-scope="scope">
            <el-button size="mini" type="success" @click="receipt(scope.row)">接单</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="请确认该订单的信息！" :visible.sync="dialogTableVisible">
      <div class="dialog-box">
        <div class="flex auto-box">
          <div class="flex message-box" v-for="(item,index) in tableKey" :key="index">
            <span style="width:80px;">{{item.keyValue}}：</span>
            <span class="message-span">{{row[item.key]}}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确定接单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        dialogTableVisible: false,
        row: {},
        heightValue: 0,
        data: [],
        loading: false,
        filterKey: [{
            key: 'all',
            label: '全部',
            io: true,
          },
          {
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
          }
        ],
        n: 20,
        tableKey: [{
          key: 'name',
          width: 150,
          keyValue: '订单编号'
        }, {
          key: 'publisher',
          width: 100,
          keyValue: '发布者'
        }, {
          key: 'PublishingCompany',
          width: 300,
          keyValue: '发布公司'
        }, {
          key: 'transportation',
          width: 100,
          keyValue: '运输方式'
        }, {
          key: 'startAt',
          width: 150,
          keyValue: '开始时间'
        }, {
          key: 'endAt',
          width: 150,
          keyValue: '期限时间'
        }, {
          key: 'type',
          width: 100,
          keyValue: '类型'
        }, {
          key: 'price',
          width: 120,
          keyValue: '总价(元)'
        }, {
          key: 'tonnage',
          width: 100,
          keyValue: '吨位(t)'
        }, {
          key: 'from',
          width: 300,
          keyValue: '出发地'
        }, {
          key: 'destination',
          width: 300,
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
          name: '0000000001',
          publisher: '发布者0',
          PublishingCompany: '发布公司0',
          transportation: '船运',
          startAt: '2018-5-10 10:00:00',
          endAt: '2018-6-10 10:00:00',
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
      receipt(row) {
        console.log(row);
        this.dialogTableVisible = true
        this.row = row
      },
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
        setTimeout(() => {
          this.n += 20
          this.loading = false
        }, 1000)
      },
      getHeight() {
        this.heightValue = document.body.clientHeight - 100
        console.log(this.heightValue);
      },
    },
    created() {
      this.heightValue = 'calc(100vh - 100px)'
    },
    mounted() {
      let tabel = document.getElementsByClassName('el-table__body-wrapper')[0]
      tabel.addEventListener('scroll', (e) => {
        let scrollHeight = tabel.scrollHeight
        let clientHeight = tabel.clientHeight
        let scrollTop = tabel.scrollTop
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
    width: calc(100% - 20px)!important;
    height: calc(100vh - 81px);
    overflow: hidden;
  }
  .dialog-box {
    width: 100%;
    max-height: calc(70vh - 184px);
    overflow: auto;
  }
  .auto-box {
    width: calc(100% - 20px);
    margin: auto;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .message-box {
    flex: 0 0 50%;
    min-height: 40px;
    font-size: 16px;
  }
  .message-span {
    flex: 1;
    margin-right: 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
</style>