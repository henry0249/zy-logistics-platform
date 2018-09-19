<template>
  <loading-box v-model="loadingText">
    <my-table size="mini" border stripe style="padding:0" :thead="thead" :data.sync="goodsData" max-height="200px">
      <template slot-scope="scope">
        <my-form-item number v-if="scope.prop === 'stock'" v-model="scope.row['stock']" size="mini"></my-form-item>
      </template>
    </my-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      initData: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        loadingText: '',
        goodsData: [],
        option: {
          limit: 0
        },
        thead: {
          name: {
            name: '商品名',
          },
          "brand.name": {
            readOnly: true,
            name: "品牌"
          },
          "category.name": {
            readOnly: true,
            name: "分类"
          },
          unit: {
            readOnly: true,
            name: "单位"
          },
          stock: {
            readOnly: true,
            name: "库存",
            slot: true
          }
        }
      }
    },
    watch: {
      goodsData:{
        handler(val,oldVal){
          this.$emit('update:data',val);
        },
        deep:true
      }
    },
    methods: {
    },
    created() {
      this.goodsData = JSON.parse(JSON.stringify(this.initData));
    }
  }
</script>

<style scoped>

</style>