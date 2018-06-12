<template>
  <div>
    <!-- <test1 label="ffffffffffffffffffgggggggggggggg" filterable></test1> -->
    <el-table :data="tableData6" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="amount1" label="数值 1（元）">
      </el-table-column>
      <el-table-column prop="amount2" label="数值 2（元）">
      </el-table-column>
      <el-table-column prop="amount3" label="数值 3（元）">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import test1 from "./test1";
  export default {
    components: {
      test1
    },
    data() {
      return {
        a: "2",
        b: "3",
        tableData6: [{
            id: "12987122",
            name: "王小虎",
            amount1: "234",
            amount2: "3.2",
            amount3: 10
          },
          {
            id: "12987122",
            name: "王小虎",
            amount1: "165",
            amount2: "4.43",
            amount3: 12
          },
          {
            id: "12987124",
            name: "王小虎",
            amount1: "324",
            amount2: "1.9",
            amount3: 9
          },
          {
            id: "12987124",
            name: "王小虎",
            amount1: "621",
            amount2: "2.2",
            amount3: 17
          },
          {
            id: "12987126",
            name: "王小虎",
            amount1: "539",
            amount2: "4.1",
            amount3: 15
          }
        ]
      };
    },
    methods: {
      arraySpanMethod(row, column, rowIndex, columnIndex) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },
      objectSpanMethod(val) {
      },
      async test() {
        try {
          let res = await this.$api.curd({
            model: 'price',
            curdType: 'findOne',
            find: {
              _id: "5b18ff487e4da9b84b7e917c"
            },
            update:{

            }
          })
          console.log(res);
          // let price = await this.$api.curd({
          //   model:'price',
          //   curdType:'find',
          //   _id:'5b18f1401dcc35b52c0a1619'
          // })
          console.log('price', price);
        } catch (error) {
        }
      }
    },
    async created() {
      await this.test()
    }
  };
</script>

<style scoped>

</style>