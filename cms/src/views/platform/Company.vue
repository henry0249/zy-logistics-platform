<template>
  <loading-box class="company-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList">
      <div slot="header" class="flex company-header-box">
        <div class="search-box">
          <el-input  size="mini" placeholder="请输入内容" v-model="input4">
            <div slot="append">.com
            </div>
          </el-input>
        </div>
        <div class="add-box">
          <el-button type="primary" size="mini">主要按钮</el-button>
        </div>
      </div>
      <template slot-scope="scope" v-if="scope.column.property === 'name'||scope.column.property === 'type'">
    <el-tag v-if="scope.column.property === 'type'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['type']" :key="item.id">
      {{item}}</el-tag>
    <i title="点击查看详情" class="pointer name-txt" v-if="scope.column.property === 'name'" @click="op(scope)">{{scope.row['name']}}</i>
</template>
    </my-table>
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
        skip: 0,
        tableHeader: company,
        companyData: []
      };
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
      op(val) {
        console.log(val);
        this.$router.push({
          path: `/platform/company_edmit/${val.row._id}`,
        })
      },
      async getData() {
        try {
          this.loadingText = "加载中";
          this.companyData = await this.$api.curd({
            model: "company",
            curdType: "find",
            limit: 20,
            skip: this.skip,
            populate: [{
              path: 'platform'
            }]
          });
          console.log(this.companyData);
        } catch (error) {
          console.log(error);
        }
        this.loadingText = "";
      }
    },
    async created() {
      await this.getData()
      console.log(this.$route);
    }
  };
</script>

<style scoped>
.company-box{
  width: 100%;
  height: 100%;
  padding: 0 40px;
}
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
  .company-header-box{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    border-bottom: 1px solid #d6d6d6;
    box-sizing: border-box;
    /* padding: 0 3%; */
  }
</style>