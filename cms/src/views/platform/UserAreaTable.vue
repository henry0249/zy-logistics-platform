<template>
  <my-table style="margin-top:20px;" border index size="mini" :thead="thead" edit :data.sync="data" op>
    <div slot="op" slot-scope="scope">
      <i v-if="data.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'],data)">
                <icon size="16px">icon-ec1</icon>
              </i>
      <i v-if="scope['index'] === data.length - 1" title="增加一个地址" class="pointer" @click="addAdr(data)">
                <icon size="16px">icon-54</icon>
              </i>
    </div>
    <template slot-scope="scope" v-if="scope.column.property === 'default' || scope.column.property === 'area'">
              <my-form-item @change="change($event,scope.index)" size="mini" v-if="scope.column.property === 'default'" active-text="默认地址"
              inactive-text="非默认地址" switch v-model="scope.row[scope.column.property]"></my-form-item>
              <my-form-item size="mini" v-if="scope.column.property === 'area'" select filterable :change-on-select="true" v-model="scope.row[scope.column.property]" :options="areaArr" placeholder="选择区域"></my-form-item>
</template>
  </my-table>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      thead: {
        type: Object,
        default () {
          return {}
        }
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      newAreaArr: {
        type: Array,
        default () {
          return []
        }
      },
      getAreaOp: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        areaArr: [],
      }
    },
    watch: {
      newAreaArr(val) {
        this.areaArr = JSON.parse(JSON.stringify(val))
      },
    },
    methods: {
      change(event, index) {
        console.log(event, index);
        this.data.forEach((item, i) => {
          if (index !== i && item.default === true) {
            this.$alert(`只能拥有一个默认地址`, "提示", {
              confirmButtonText: "确定",
              callback: () => {
                this.data[index].default = false
              }
            });
          }
        });
      },
      delAdr(i, arr) {
        if (arr.length > 1) {
          arr.splice(i, 1);
        } else {
          this.$alert(`至少有一个`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              return;
            }
          });
        }
      },
      addAdr(arr) {
        let obj = JSON.parse(JSON.stringify(arr[arr.length - 1]));
        obj.default = false
        arr.push(obj);
      },
    },
    async created() {
      this.areaArr = JSON.parse(JSON.stringify(this.newAreaArr));
    }
  }
</script>

<style scoped>

</style>