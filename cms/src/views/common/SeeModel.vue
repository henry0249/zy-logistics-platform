<template>
  <div class="see-box">
    <div class="flex list-box" v-for="(item,index) in keyArr" :key="index">
      <span class="see-span">{{item.keyValue}}</span>
      <span class="right-span" v-if="item.type == 'switch'">{{item.value?'支持':'不支持'}}</span>
      <span class="right-span" v-else-if="item.type === 'Arr'">{{Arrfilter(item.key)}}</span>
      <span class="right-span" v-else-if="item.type === 'brankCategory'">{{brandCategoryFilter(item.key)}}</span>
      <span class="right-span" v-else>{{filterMethods(index,item.key)}}</span>
    </div>
    <div class="flex list-box" v-if="str === 'goods'">goods</div>
  </div>
</template>

<script>
  export default {
    props: {
      keyArr: {
        type: Array,
        default () {
          return []
        }
      },
      keyData: {
        type: Object,
        default () {
          return {};
        }
      },
      str: {
        type: String,
        default: ''
      }
    },
    methods: {
      brandCategoryFilter(val) {
        let arr = val.split('.')
        let str = ''
        this.keyData[arr[0]].forEach(item => {
          console.log('item',item[arr[1]]);
          str += item[arr[1]] + '、';
        });
        return str.substr(0, str.length - 1)
      },
      Arrfilter(key) {
        let str = ''
        this.keyData[key].forEach(keyItem => {
          str += keyItem + '、'
        });
        return str.substr(0, str.length - 1)
      },
      filterMethods(index, val) {
        if (val.indexOf('.') > -1) {
          let str = val.split('.')
          if (this.keyData[str[0]] == undefined) {
            return '无'
          } else {
            return this.keyData[str[0]][str[1]]
          }
        } else {
          if (val == 'saleState') {
            let options = [{
              value: 0,
              label: '未发布'
            }, {
              value: 1,
              label: '已发布'
            }, {
              value: 2,
              label: '已下架'
            }, {
              value: 3,
              label: '缺货中'
            }]
            let label = ''
            options.forEach(item => {
              if (item.value == this.keyData[val]) {
                label = item.label
              }
            });
            return label
          } else {
            return this.keyData[val]
          }
        }
      },
      async getData() {
        try {
          let data = {
            model: this.str,
            curdType: 'find',
            _id: this.myid
          }
          console.log('111111',res);
        } catch (error) {}
      }
    },
    mounted() {
      this.getData()
    },
    created() {
      console.log('this.keyArr', this.keyArr);
      console.log('this.keyData', this.keyData);
    }
  }
</script>

<style scoped>
  .see-box {
    width: 100%;
    max-height: calc(85vh - 190px);
    overflow: auto;
  }
  .list-box {
    width: calc(100% - 60px);
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 30px;
    min-height: 40px;
    border: 1px solid #dfdfdf;
    border-top: none;
    box-sizing: border-box;
  }
  .list-box:first-child {
    border-top: 1px solid #dfdfdf;
  }
  .see-span {
    width: 100px;
    background: #cccccc6e;
    min-height: 40px;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .right-span {
    flex: 1;
    margin-left: 20px;
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .arr-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .el-tag+.el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>