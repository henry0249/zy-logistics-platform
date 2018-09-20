<template>
  <loading-box v-model="value">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{type === 'add'?'用户添加':'用户详情'}}</strong>
        </div>
        <common-alert style="margin:15px 0">用户信息</common-alert>
        <user-edit-item-form v-if="!value" :data.sync="userData" :startData="startUserData" :type="type"></user-edit-item-form>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">{{type === 'add'?'添 加':'修 改'}}</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import UserEditItemForm from "./UserEditItemForm.vue";
  export default {
    components: {
      UserEditItemForm
    },
    props: {
      value: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "add"
      },
      startData: {
        type: Object,
        default () {
          return {};
        }
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      sys: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        disabled: true,
        userData: {},
        startUserData: {
          name: "",
          mobile: "",
          type: "",
          email: "",
          area: [],
          address: "",
          recommendedByUser: {},
          superior: {},
          parent: {},
          tag: []
        }
      };
    },
    watch: {
      userData: {
        handler(val, oldVal) {
          this.disabled = false;
        },
        deep: true
      }
    },
    methods: {
      checkMethods() {
        let subIo = true;
        if (!this.userData.name) {
          this.$message.warn('名字是必填的');
          subIo = false;
        } else if (!this.userData.mobile) {
          this.$message.warn('手机号是必填的');
          subIo = false;
        } else if (!(/^1[34578]\d{9}$/.test(this.userData.mobile))) {
          this.$message.warn("手机号码格式不正确！");
          subIo = false;
        }
        return subIo;
      },
      async sub() {
        if (this.checkMethods()) {
          try {
            if (this.type === "add") {
              this.$emit("input", "添加中");
            } else if (this.type === "edit") {
              this.$emit("input", "更新中");
            }
            let op = {
              model: "user",
              curdType: "update"
            };
            if (this.type === "add") {
              Object.assign(op, {
                name: this.userData.name,
                mobile: this.userData.mobile,
                type: this.userData.type,
                email: this.userData.email,
                tag: this.userData.tag,
                recommendedByUser: this.userData.recommendedByUser._id,
                superior: this.userData.superior._id,
                parent: this.userData.parent._id
              });
              if (this.userData.area.length > 0) {
                op.area = [];
                this.userData.area.forEach(areaItem => {
                  op.area.push(areaItem._id);
                });
              }
              for (const key in op) {
                if (!op[key]) {
                  delete op[key];
                }
              }
              this.$set(op, "curdType", "set");
            } else if (this.type === "edit") {
              Object.assign(op, {
                find: {
                  _id: this.$route.params._id
                },
                update: {
                  name: this.userData.name,
                  mobile: this.userData.mobile,
                  type: this.userData.type,
                  email: this.userData.email,
                  tag: this.userData.tag,
                  recommendedByUser: this.userData.recommendedByUser._id,
                  superior: this.userData.superior._id,
                  parent: this.userData.parent._id
                }
              });
            }
            let res = await this.$api.curd(op);
            this.$message.success(`${this.type === 'add'?'添加成功':'更新成功'}`);
            let path = '/sys/user/list';
            if (this.sys) {
              path = '/sys/user/list';
            } else {
              // path = '/sys/user/list';
            }
            this.$router.push({
              path
            });
          } catch (error) {}
          this.$emit("input", "");
        }
      }
    },
    created() {
      if (this.type === "edit") {
        this.userData = JSON.parse(JSON.stringify(this.startData));
        for (const key in this.startUserData) {
          this.$set(this.startUserData, key, this.startData[key]);
        }
        this.$set(this.startUserData, "_id", this.startData._id);
      }
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .edit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>