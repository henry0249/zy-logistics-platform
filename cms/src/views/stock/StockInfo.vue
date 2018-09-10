<template>
  <loading-box v-model="loadingText">
    <div>
      <div class="g-stock-info">
        <slot name="title">
          <div class="title">
            {{typeText}}单
          </div>
        </slot>
        <el-alert title="库存单类型" type="info" :closable="false">
        </el-alert>
        <div class="flex ac jb" style="margin-top:15px">
          <div class="pointer" v-for="(val,key) in field.Stock.type.option" :key="key" @click="form.type = key">
            <el-card :shadow="form.type === key?'always':'hover'" class="info" :class="{activeType:form.type === key}" style="padding:0 20px;font-size:13px">
              {{val}}单
            </el-card>
          </div>
        </div>
        <el-alert style="margin-top:15px" title="库存单信息" type="info" :closable="false">
        </el-alert>
        <my-form size="small" width="32%">
          <div class="flex ac jb" style="margin-top:15px">
            <my-form-item label="数量" v-model="form.num" number :min="0"></my-form-item>
            <my-form-item label="名称" v-model="form.name"></my-form-item>
            <my-form-item label="状态" v-model="form.state" select :options="field.Stock.state.option"></my-form-item>
          </div>
          <my-form-item style="margin-top:15px" width="100%" label="备注" v-model="form.remake"></my-form-item>
        </my-form>
        <el-alert style="margin-top:15px" title="待处理状态的库存单不会使库存立即变化,完成状态会立即修改库存" type="warning" :closable="false" center show-icon>
        </el-alert>
      </div>
      <div class="flex ac jb" style="margin-top:30px">
        <slot name="left">
          <el-button size="small" @click="back()">返回</el-button>
        </slot>
        <div class="f1"></div>
        <slot name="right">
          <el-button type="primary" size="small" @click="submit">{{submitText}}</el-button>
        </slot>
      </div>
    </div>
  </loading-box>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    val: {
      type: Object,
      default() {
        return {};
      }
    },
    submitText: {
      type: String,
      default: "确认提交"
    }
  },
  data() {
    return {
      loadingText: "",
      form: {
        state: "finish",
        type: "in",
        name: "",
        num: 0,
        remake: ""
      },
      typeObj: {}
    };
  },
  watch: {
    form: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    },
    "form.type"(val) {
      this.setName();
    }
  },
  computed: {
    typeText() {
      return this.field.Stock.type.option[this.form.type] || "未知类型";
    }
  },
  methods: {
    setName() {
      let date = this.formatTime(new Date(), "YYYY年MM月DD日A");
      date = date.replace("AM", "上午");
      date = date.replace("PM", "下午");
      this.form.name = `${date}的${this.typeText}单`;
    },
    submit() {
      this.form.company = this.company._id;
      this.$emit("submit", this.form);
    }
  },
  mounted() {
    if (this.val && this.val._id) {
      this.form = JSON.parse(JSON.stringify(this.val));
    } else {
      if (!this.form.name) {
        this.setName();
      }
      if (this.$route.query.type && this.field.Stock.type.option[this.$route.query.type]) {
        this.form.type = this.$route.query.type
      }
    }
  }
};
</script>

<style scoped>
.g-stock-info {
  padding: 30px;
  /* box-shadow: 0 0 10px rgba(0,0,0,.2); */
  border: 1px solid #eee;
  border-radius: 4px;
}
.title {
  font-size: 20px;
  text-align: center;
  padding-bottom: 15px;
}
.activeType {
  color: #aaa;
  background-color: #409eff;
  color: #fff;
  font-weight: 500;
}
</style>