<template>
  <div class="flex add-main">
    <div class="flex add-header">{{$route.query.title}}</div>
    <div class="flex add-box">
      <div class="flex add-list" v-for="item in key" :key="item.id">
        <span style="width:150px">{{item.keyValue}}:</span>
        <div class="flex add-select" v-if="item.type == 'input'">
          <el-input v-model="item.value" :placeholder="'请输入'+item.keyValue"></el-input>
        </div>
        <div class="flex add-select" v-else-if="item.type == 'arr'">
          <span style="flex:1" :title="changeArr(item,index)">{{changeArr(item,index) | textFilter}}</span>
          <el-button size="small">添加</el-button>
        </div>
        <div class="flex add-select" v-else-if="item.type == 'select'">
          <el-select v-model="item.value" placeholder="请选择">
            <el-option v-for="(v,i) in item.options" :key="i" :label="v.label" :value="v.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flex add-list add-sub">
        <div class="sub">
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
          <el-button type="success" size="small" @click="sub">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import keyObj from './key';
  export default {
    data() {
      return {
        key: [],
        keyObj,
      }
    },
    methods: {
      changeArr(item, index) {
        let str = ''
        item.value.forEach(valueItem => {
          str += valueItem + '、'
        });
        return str
      },
      sub() {
        this.post()
      },
      async post() {
        let url = '/' + this.$route.query.key + '/add'
        let res = await this.all(url,)
      }
    },
    filters: {
      textFilter: function(value) {
        let length = 8
        let val = ''
        if (value.length > length) {
          val = value.substr(0, length - 1) + '...'
        }
        return val;
      }
    },
    created() {
      console.log(this.$route);
      this.key = this.keyObj[this.$route.query.str]
    }
  }
</script>

<style scoped>
  .add-main {
    width: 100%;
    height: 100%;
    background: #fff;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .add-header {
    width: calc(100% - 40px);
    height: 45px;
    border-bottom: 1px solid #c9cbcc;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add-box {
    width: calc(100% - 40px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .add-list {
    width: 500px;
    height: 40px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 30px;
  }
  .add-sub {
    position: relative;
  }
  .sub {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .add-select {
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%；
  }
</style>