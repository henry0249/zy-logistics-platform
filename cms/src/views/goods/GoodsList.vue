<template>
  <common-list title="商品" :tableHeader="tableHeader" str="goods" :keyArr="keyArr" :populate="populate" :or="or">
    <el-button slot-scope="scope" slot="operation" size="mini" @click="test(scope)">超小按钮</el-button>
  </common-list>
</template>

<script>
  import AddKey from './AddKey.js';
  import CommonList from '../common/CommonList.vue';
  export default {
    components: {
      CommonList,
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
          key: 'brand.name',
          keyValue: '品牌',
        }, {
          key: 'category.name',
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
        populate: [{
          path: 'brand'
        }, {
          path: 'category'
        }, {
          path: 'platform'
        }, {
          path: 'company'
        }, {
          path: 'mfrs'
        }],
        or: [{
          key: 'name'
        }, {
          key: 'category',
          type: 'id'
        }, {
          type: 'id',
          key: 'brand',
        }, {
          key: 'tag',
          type: 'in'
        }],
      };
    },
    methods: {
      async getData() {
        let i = 0
        try {
          let category = await this.$api.curd({
            model: 'category',
            curdType: 'find',
          })
          let brand = await this.$api.curd({
            model: 'brand',
            curdType: 'find',
          })
          let company = await this.$api.curd({
            model: 'company',
            curdType: 'find',
          })
          this.keyArr.forEach((item, index) => {
            console.log('object', item.key);
            if (item.key == 'platform.name') {
              console.log('platform');
              if (this.platform._id) {
                item.options.push({
                  value: this.platform._id,
                  label: this.platform.name
                })
              } else {
                i = index
              }
            }
            if (item.key == 'company.name') {
              console.log('this.company', this.company);
              if (this.company._id) {
                item.options.push({
                  value: this.company._id,
                  label: this.company.name
                })
              } else {
                i = index
              }
            }
            if (item.key == 'mfrs.name') {
              company.forEach(resItem => {
                item.options.push({
                  value: resItem.name,
                  label: resItem.name,
                  _id: resItem._id,
                })
              });
            }
            if (item.key == 'category.name') {
              category.forEach(resItem => {
                item.options.push({
                  value: resItem.name,
                  label: resItem.name,
                  _id: resItem._id,
                })
              });
            }
            if (item.key == 'brand.name') {
              brand.forEach(resItem => {
                item.options.push({
                  value: resItem.name,
                  label: resItem.name,
                  _id: resItem._id,
                })
              });
            }
          });
          this.keyArr.splice(i, 1)
        } catch (error) {}
      }
    },
    async created() {
      this.getData()
    }
  };
</script>

<style scoped>

</style>