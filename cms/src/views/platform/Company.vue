<template>
  <loading-box class="goods-box" v-model="loadingText">
    <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList">
      <template slot-scope="scope" v-if="scope.column.property === 'name'||scope.column.property === 'type'">
                <el-tag  v-if="scope.column.property === 'type'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['type']" :key="item.id">{{item}}</el-tag>
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
      op(val){
        console.log(val);
        this.$router.push({
          path:`/platform/company_edmit/${val.row._id}`,
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
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>