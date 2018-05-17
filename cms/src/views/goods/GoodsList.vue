<template>
  <common-list title="商品" :tableHeader="tableHeader" str="goods">
    <!-- <el-button slot-scope="scope" slot="operation" size="mini" @click="test(scope)">超小按钮</el-button> -->
    <category-add str="goods" :key-arr="keyArr" slot="addModel" :keyArr="keyArr"></category-add>
  </common-list>
</template>

<script>
  import AddKey from './AddKey.js';
  import CommonList from '../common/CommonList.vue';
  import CategoryAdd from './AddModel.vue';
  export default {
    components: {
      CommonList,
      CategoryAdd
    },
    data() {
      return {
        dialogShow: false,
        loadingText: "",
        data: "",
        boxStyle: {
          width: 'calc(100% - 20px)',
          height: 'calc(100% - 10px)'
        },
        heightValue: 'calc(100% - 10px)',
        tableHeader: [{
          key: 'brand',
          keyValue: '品牌',
        }, {
          key: 'category',
          keyValue: '分类',
        }, {
          key: 'name',
          keyValue: '名称',
        }, {
          key: 'unit',
          keyValue: '单位',
        }, {
          key: 'tag',
          keyValue: '标签',
          type: 'Arr'
        }],
        keyArr: AddKey,
      };
    },
    methods: {
      async getData() {
        try {
          let category = await this.$api.curd({
            model: 'category',
            curdType: 'find',
          })
          let brand = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
          })
          this.keyArr.forEach((item, index) => {
            console.log(index);
            console.log(Object.keys(this.platform).length > 0);
            if (item.key == 'platform') {
              if (Object.keys(this.platform).length > 0) {}
            }
            // if (item.key == 'category') {
            //   category.forEach(resItem => {
            //     item.options.push({
            //       value: resItem._id,
            //       label: resItem.name
            //     })
            //   });
            // } else if (item.key == 'brand') {
            //   brand.forEach(resItem => {
            //     item.options.push({
            //       value: resItem._id,
            //       label: resItem.name
            //     })
            //   });
            // } else if (item.key == 'company') {
            //   if (Object.keys(this.company).length > 0) {
            //     item.options.push({
            //       value: this.company._id,
            //       label: this.company.name
            //     })
            //   } else {
            //     this.keyArr.splice(index, 1)
            //   }
            // } else if (item.key == 'platform') {
            //   console.log(1111);
            //   if (Object.keys(this.platform).length > 0) {
            //     console.log(2222);
            //     item.options.push({
            //       value: this.platform._id,
            //       label: this.platform.name
            //     })
            //   } else {
            //     console.log(3333);
            //     this.keyArr.splice(index, 1)
            //   }
            // }
          });
          console.log(this.keyArr);
        } catch (error) {}
      }
    },
    created() {
      this.getData()
    }
  };
</script>

<style scoped>

</style>