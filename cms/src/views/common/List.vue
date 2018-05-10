<template>
  <div class="list-box" v-loading="loading">
    <div class="list-header">
      <search-box style="width:450px;height:55px;"></search-box>
    </div>
    <div class="list-table">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column v-for="(item,index) in keyArr" :key="index" :prop="item.key" :label="item.keyValue" :width="item.width">
        </el-table-column>
        <el-table-column label="操作" v-if="operation" width="300">
          <div class="flex opera-box" slot-scope="scope">
            <div class="pointer see" title="查看" @click="see(scope.row)">
              <Icon>icon-iconlogineyesopen</Icon>
            </div>
            <div class="pointer see" title="编辑" @click="edit(scope.row)">
              <Icon>icon-bianji</Icon>
            </div>
            <div class="pointer see" title="删除" @click="del(scope.row)">
              <Icon>icon-ec1</Icon>
            </div>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div class="list-page"></div>
  </div>
</template>

<script>
  import {
    Loading
  } from 'element-ui'
  import SearchBox from './SearchBox';
  export default {
    components: {
      [Loading.name]: Loading,
      SearchBox
    },
    props: {
      parameter: {
        type: Object,
        default () {
          return {
            url: '/user/find',
            collection: {}
          }
        }
      },
      operation: {
        type: Boolean,
        default: true,
      },
      keyArr: {
        type: Array,
        default () {
          return []
        }
      },
      // : {
      //   type: Array,
      //   default () {
      //     return []
      //   }
      // }
    },
    data() {
      return {
        tableData: [],
        loading:false,
      }
    },
    methods: {
      edit(item) {
        console.log(item);
      },
      see(item) {},
      del(item) {},
      async getData() {
        this.loading = true
        let collection = this.parameter.collection
        let res = []
        if (Object.keys(collection).length > 0) {
          res = await this.$api.all(this.parameter.url, collection)
        } else {
          res = await this.$ajax.post('/user/find')
          // res = await this.$api.all(this.parameter.url)
        }
        if (res.length > 0) {
          console.log(res);
          this.tableData = res
        }
        this.loading = false
      }
    },
    created() {
      console.log(document.cookie.split('='));
      this.getData()
    }
  }
</script>

<style scoped>
  .list-box {
    width: 100%;
    height: 100%;
  }
  .opera-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .see {
    margin-right: 30px;
  }
</style>