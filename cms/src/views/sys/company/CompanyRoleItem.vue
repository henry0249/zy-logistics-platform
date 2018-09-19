<template>
  <div style="width:100%">
    <my-table :data.sync="data" max-height="300" border index size="mini" :thead="thead" op>
      <div slot-scope="scope" slot="op" class="jc" style="color:#F56C6C">
        <div style="width:20px;height:20px;" class="jc" @click="del(scope)">
          <icon class="pointer" size="16px" title="移除该用户">icon-ec1</icon>
        </div>
      </div>
    </my-table>
  </div>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: true
      },
      removeData: {
        type: Array,
        default () {
          return []
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        startRemoveData: [],
        thead: {
          name: {
            name: "用户名",
            readOnly: true
          },
          mobile: {
            name: "手机号",
            readOnly: true
          }
        }
      };
    },
    methods: {
      del(val) {
        let data = JSON.parse(JSON.stringify(this.data));
        data.splice(val.index, 1);
        if (val.row.roleId) {
          this.startRemoveData.push(val.row.roleId);
          this.$emit('update:removeData', this.startRemoveData);
        }
        this.$emit("update:data", data);
        this.$emit('update:show', false);
      }
    }
  };
</script>

<style scoped>
</style>