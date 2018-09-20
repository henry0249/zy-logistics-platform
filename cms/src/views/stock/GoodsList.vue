<template>
  <loading-box v-model="loadingText">
    <my-table size="mini" border stripe style="padding:0" :thead="thead" :loadmore="checkAll && $attrs.type === 'check'?loadmore:undefined" :data.sync="goodsData" max-height="200px">
      <template slot-scope="scope">
        <my-form-item number v-if="scope.prop === 'key'" v-model="scope.row['key']" :min="0" size="mini"></my-form-item>
        <my-select v-if="scope.prop === 'name'" :disabled="disabled" goods :data.sync="goodsData[scope.index]" size="mini"></my-select>
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
      checkAll: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        loadingText: "",
        disabled: false,
        goodsData: [{
          name: "",
          brand: "",
          category: "",
          unit: "",
          stock: 0,
          key: 0
        }]
      };
    },
    watch: {
      goodsData: {
        handler(val, oldVal) {
          this.$emit("update:data", val);
        },
        deep: true
      },
      '$attrs.type' (val) {
        if (val !== 'check') {
          this.goodsData = [{
            name: "",
            brand: "",
            category: "",
            unit: "",
            stock: 0,
            key: 0
          }];
          this.disabled = false;
          this.$emit('update:checkAll', false);
        }
      },
      checkAll(val) {
        if (val && this.$attrs.type === "check") {
          this.getGoodsByComapny();
          this.disabled = true;
        } else {
          this.goodsData = [{
            name: "",
            brand: "",
            category: "",
            unit: "",
            stock: 0,
            key: 0
          }];
          this.disabled = false;
        }
      }
    },
    computed: {
      thead() {
        return {
          name: {
            name: "商品名",
            slot: true
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
            name: "当前库存"
          },
          key: {
            readOnly: true,
            name: this.field.Stock.type.option[this.$attrs.type] + "数量",
            slot: true
          }
        };
      }
    },
    methods: {
      async loadmore() {
        let option = this.$attrs.option || {};
        let body = {
          skip: this.goodsData.length,
          ...option
        };
        return await this.$ajax.post('/goods/find', body);
      },
      async getGoodsByComapny() {
        try {
          this.loadingText = "加载中";
          let res = await this.$api.curd({
            model: "goods",
            curdType: "find",
            company: this.company._id
          });
          this.goodsData = [];
          res.forEach(item => {
            let obj = item;
            this.$set(obj, "key", 0);
            this.goodsData.push(obj);
          });
        } catch (error) {}
        this.loadingText = "";
      }
    },
  };
</script>

<style scoped>

</style>