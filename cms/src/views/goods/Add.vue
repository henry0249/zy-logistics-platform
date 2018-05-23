<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-for="(item,index) in tableHeader" :key="index" :prop="item.key" :label="item.keyValue">
    </el-table-column>
    <!-- <el-table-column prop="name" label="姓名" width="180">
                                      </el-table-column>
                                      <el-table-column prop="address" label="地址">
                                      </el-table-column> -->
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableHeader: [{
            key: "date.name",
            keyValue: "日期"
          },
          {
            key: "name",
            keyValue: "姓名"
          },
          {
            key: "address",
            keyValue: "地址"
          }
        ],
        tableData: [{
            date: {
              name: "2016-05-02"
            },
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: {
              name: "2016-05-02"
            },
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: {
              name: "2016-05-02"
            },
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: {
              name: "2016-05-02"
            },
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ]
      };
    },
    methods: {
      async del() {
        try {
          let res = await this.$api.curd({
            model: "category",
            curdType: "delete",
            _id: "5b0381d9340bf885ca3672a2"
          });
          console.log(res);
        } catch (error) {}
      },
      async getData() {
        try {
          let res = await this.$api.curd({
            model: "category",
            curdType: "find"
            // name: '测试公司'
          });
          console.log(res);
        } catch (error) {}
      }
    },
    created() {
      // this.del()
      console.log(this.company);
      console.log(this.platform);
      // this.getData();
    }
  };
</script>

<style scoped>

</style>