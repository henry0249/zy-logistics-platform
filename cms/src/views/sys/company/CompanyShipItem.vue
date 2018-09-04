<template>
  <my-table :data.sync="data" edit max-height="300" border index size="mini" :thead="thead" op opWidth="45">
    <div slot="op" slot-scope="scope" class="jc">
      <remove-check @remove="remove(scope)"></remove-check>
    </div>
    <!-- <div slot-scope="scope" style="width:20px;height:20px;color:#F56C6C" slot="op" class="jc">
          <div style="width:20px;height:20px;" class="jc lll" @click="del(scope)">
            <icon class="pointer" size="16px" title="移除该用户">icon-ec1</icon>
          </div>
        </div> -->
    <template slot-scope="scope">
            <div v-if="scope.prop === 'type'">
            <my-form-item size="mini" multiple collapse-tags select v-model="scope.row[scope.prop]" :options="field[str].type.option"></my-form-item>
            </div>
            <my-select v-if="scope.prop === 'owner'" :data.sync="scope.row[scope.prop]" user></my-select>
</template>
  </my-table>
</template>

<script>
  export default {
    props: {
      removeArr: {
        type: Array,
        default () {
          return [];
        }
      },
      str: {
        type: String,
        default: "Truck"
      },
      activeName: {
        type: String,
        default: ""
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      thead: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        newRemoveArr: []
      };
    },
    computed: {
      option() {
        if (this.activeName === "ship") {
          return this.field.Ship.type.option;
        } else if (this.activeName === "truck") {
          return this.field.Truck.type.option;
        }
      }
    },
    methods: {
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
        if (index <= arr.length - 1) {
          return type[index];
        } else {
          return type[index - arr.length - 1];
        }
      },
      remove(val) {
        let data = JSON.parse(JSON.stringify(this.data));
        this.newRemoveArr.push(val.row);
        data.splice(val.index, 1);
        this.$emit("update:data", data);
        this.$emit("update:removeArr", this.newRemoveArr);
      },
    },
    created() {}
  };
</script>

<style scoped>

</style>