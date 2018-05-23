<template>
  <div class="see-box">
    <div class="flex list-box" v-for="(item,index) in keyArr" :key="index">
      <span class="see-span">{{item.keyValue}}</span>
      <span class="right-span" v-if="item.type == 'switch'">{{item.value?'支持':'不支持'}}</span>
      <span class="right-span" v-else>{{filterMethods(index,item.key)}}</span>
    </div>
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
      populate: {
        type: Array,
        default () {
          return []
        }
      },
      str: {
        type: String,
        default () {
          return ''
        }
      },
      myid: {
        type: String,
        default: ''
      }
    },
    watch: {
      myid(val) {
        console.log('val', val);
      }
    },
    methods: {
      filterMethods(index, val) {
        if (val.indexOf('.') > -1) {
          let str = val.split('.')
          // console.log(str);
          // console.log(this.keyData['mfrs']['name']);
          console.log('--------------------------------------');
          console.log(index);
          console.log(str);
          console.log(str[0], str[1]);
          console.log([str[0]]);
          console.log(this.keyData);
          console.log(this.keyData[str[0]]);
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
          console.log(res);
        } catch (error) {}
      }
    },
    mounted() {
      // console.log('this.keyData', this.keyData);
      // console.log('this.keyArr', this.keyArr);
      this.getData()
    },
    created() {
      console.log('this.keyArr[6]', this.keyArr[6]);
      console.log('this.keyData[6]', this.keyData);
    }
  }
</script>

<style scoped>
  .see-box {
    width: 100%;
    max-height: calc(85vh - 200px);
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