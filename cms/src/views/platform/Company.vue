<template>
  <loading-box class="company-box" v-model="loadingText">
    <div style="padding:0 3%">
      <my-table height="100vh - 50px" border index size="mini" edit :thead="tableHeader" :data.sync="tableList">
        <div slot="header" class="flex company-header-box">
          <div class="js search-box">
            <el-input size="mini" placeholder="请输入公司名称" v-model="input">
              <div slot="append" class="pointer" @click="search">搜 索</div>
            </el-input>
            <my-form-item style="margin-left:20px;" @change="change" placeholder="公司类型" size="mini" collapse-tags multiple filterable select v-model="selectArr" :options="field.Company.type.option">
            </my-form-item>
          </div>
          <div class="add-box">
            <el-button type="primary" size="mini" @click="$router.push({path:'/platform/company_add'})">添 加</el-button>
          </div>
        </div>
        <template slot-scope="scope" v-if="scope.column.property === 'name'||scope.column.property === 'type'">
                      <el-tag v-if="scope.column.property === 'type'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['type']" :key="item.id">
                      {{item}}</el-tag>
                      <i title="点击查看详情" class="pointer name-txt" v-if="scope.column.property === 'name'" @click="op(scope)">{{scope.row['name']}}</i>
</template>
    </my-table>
    </div>
  </loading-box>
</template>

<script>
  import {
    company
  } from './company.js';
  export default {
    data() {
      return {
        loadingText: "",
        input: '',
        skip: 0,
        tableHeader: company,
        companyData: [],
        selectArr: []
      };
    },
    watch: {
      async selectArr(val) {
        if (val.length === 0) {
          let data = {}
          if (this.input) {
            data.$or = [{
              name: {
                $regex: this.input
              }
            }]
          }
          await this.getData(data);
        }
      }
    },
    computed: {
      tableList() {
        let obj = this.field.Company.type.option
        let company = JSON.parse(JSON.stringify(this.companyData))
        company.forEach(item => {
          let arr = []
          item.type.forEach(typeItem => {
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (key === typeItem) {
                  arr.push(obj[key])
                }
              }
            }
          });
          item.type = arr;
        });
        return company;
      }
    },
    methods: {
      async change(val) {
        this.selectArr = val;
        let data = {
          type: {
            $in: val
          }
        }
        if (this.input) {
          data.$or = [{
            name: {
              $regex: this.input
            }
          }]
        }
        await this.getData(data);
      },
      async search() {
        this.companyData = [];
        let data = {
          $or: [{
            name: {
              $regex: this.input
            }
          }]
        }
        if (this.selectArr.length > 0) {
          data.type = {
            $in: this.selectArr
          }
        }
        await this.getData(data);
      },
      op(val) {
        console.log(val);
        this.$router.push({
          path: `/platform/company_edmit/${val.row._id}`,
        })
      },
      async getData(data) {
        try {
          this.loadingText = "加载中";
          data.model = 'company';
          data.curdType = 'find';
          data.limit = this.limit;
          data.skip = 0;
          data.populate = [{
            path: 'platform'
          }]
          this.companyData = await this.$api.curd(data);
        } catch (error) {
          console.log(error);
        }
        this.loadingText = "";
      }
    },
    async created() {
      let data = {}
      await this.getData(data);
    }
  };
</script>

<style scoped>
  .company-box {
    width: 100%;
    height: 100%;
    padding: 0 20px;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
  .company-header-box {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    /* border-bottom: 1px solid #d6d6d6; */
    box-sizing: border-box;
    /* padding: 0 3%; */
  }
</style>