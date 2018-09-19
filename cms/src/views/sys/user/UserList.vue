<template>
  <div>
    <common-table path="/user/find" :thead="thead" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input placeholder="请输入用户名或手机号" width="250px" v-model="input"></my-form-item>
      </div>
      <template slot-scope="scope" v-if="scope.prop === 'tag'||scope.prop === 'name'">
                <el-tag v-if="scope.prop === 'tag'" :type="tagType(index,scope.row['tag'])" style="margin-right:10px;" size="mini" v-for="(item,index) in scope.row['tag']" :key="item.id">{{item}}</el-tag>
                <div title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see(scope)">{{setName(scope)}}</div>
</template>
</common-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: "",
        op: {},
        thead: {
          name: {
            name: "用户名",
            slot: true
          },
          mobile: {
            name: "手机号"
          },
          tag: {
            name: "标签",
            slot: true
          }
        }
      };
    },
    methods: {
      setName(scope) {
        return scope.row.name || scope.row.nick || scope.row.mobile || scope.row._id;
      },
      see(val) {
        this.$router.push({
          path: "/sys/user/edit/" + val.row._id
        });
      },
      inputChange(val) {
        if (val) {
          this.$set(this.op, "$or", [{
            name: {
              $regex: val
            }
          }]);
        } else {
          delete this.op.$or;
        }
      },
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
        if (index <= arr.length - 1) {
          return type[index];
        } else {
          return type[index - arr.length - 1];
        }
      }
    },
    created() {}
  };
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>