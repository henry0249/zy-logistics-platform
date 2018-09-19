<template>
  <loading-box v-model="value">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{type === 'add'?'用户添加':'用户详情'}}</strong>
        </div>
        <common-alert style="margin:15px 0">用户信息</common-alert>
        <user-edmit-item-form v-if="!value" :data.sync="userData" :startData="startUserData" :type="type"></user-edmit-item-form>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button :disabled="disabled" size="small" type="primary" @click="sub">{{type === 'add'?'添 加':'修 改'}}</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
import UserEdmitItemForm from "./UserEdmitItemForm.vue";
export default {
  components: {
    UserEdmitItemForm
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
      default() {
        return {};
      }
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // value: "",
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
        this.$alert("名字是必填的", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            subIo = false;
          }
        });
      } else if (!this.userData.mobile) {
        this.$alert("手机号是必填的", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            subIo = false;
          }
        });
      }
      return subIo;
    },
    async sub() {
      if (this.checkMethods()) {
        try {
          if (this.type === "add") {
            this.$emit("input", "添加中");
          } else if (this.type === "edmit") {
            this.$emit("input", "更新中");
          }
          let op = {
            model: "user",
            curdType: "update"
          };
          // let res;
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
          } else if (this.type === "edmit") {
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
          if (!res) {
            this.$confirm(`${this.type === 'add'?'添加失败':'更新失败'}`, "提示", {
              confirmButtonText:  `${this.type === 'add'?'继续添加':'继续修改'}`,
              cancelButtonText: "返回",
              type: "warning"
            })
              .then(() => {
                // this.$router.go(0);
              })
              .catch(() => {
                this.$router.go(-1);
              });
          } else {
            this.$alert(`${this.type === 'add'?'添加成功':'修改成功'}`, "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.go(-1);
              }
            });
          }
        } catch (error) {}
        this.$emit("input", "");
      }
    }
  },
  created() {
    if (this.type === "edmit") {
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
.edmit-tag {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>