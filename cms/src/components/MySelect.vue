<template>
  <div>
    <my-form-item :label="label" :size="size||$parent.size">
      <div slot="label">
        {{label}}
      </div>
      <div style="position:relative">
        <div class="disabled-hide" v-if="disabled">
        </div>
        <el-input style="width:100%" :value="multi?(text(data)+' +'+(data.length-1)):text(data)" v-bind="$attrs" :placeholder="$attrs.placeholder || autoPlaceholder" :size="size||$parent.size" class="input-with-select">
          <text-dropdown v-if="userCompanyTypeChoose" slot="prepend" v-model="innerType" :options="field.Order.type.option" :color="['#E6A23C','#409EFF']"></text-dropdown>
          <text-dropdown v-if="truckShipTypeChoose" slot="prepend" v-model="innerType" :options="field.Logistics.transportation.option" :color="['#67C23A','#E6A23C']"></text-dropdown>
        </el-input>
        <div class="choose-icon ac pointer" @click="dialogVisible = true">
          <i class="el-icon-edit blue" :class="{disabled:disabled}"></i>
        </div>
      </div>
    </my-form-item>
    <el-dialog append-to-body :title="title||autoTitle" :visible.sync="dialogVisible" width="70%" :top="multi?'7vh':'10vh'">
      <div style="height:55vh;overflow:hidden">
        <div v-if="dialogVisible">
          <common-table :select="data" :selection="multi" :option="searchOption" :path="path" :thead="thead" height="55vh" style="padding:0" @current-change="selectChange" @selection-change="handleSelectionChange"  :currentCompany="currentCompany">
            <my-select-search slot="header" :data.sync="searchOption" :type="selectType"></my-select-search>
            <div slot-scope="scope" v-if="selectType === 'company'">
              <div v-if="scope.prop==='type'">{{companyType2Text(scope.row.type)}}</div>
            </div>
          </common-table>
        </div>
      </div>
      <!-- 单选 -->
      <div slot="footer" class="flex ac" v-if="!multi">
        <div class="info">
          当前选择：
        </div>
        <div class="blue">
          {{text(data)}}
        </div>
        <div class="f1"></div>
        <el-button @click="dialogVisible = false" size="mini">关 闭</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
      </div>
      <!-- 多选 -->
      <div slot="footer" class="flex ac" v-if="multi">
        <div class="flex ac f1">
          <div class="info tc" style="font-size: 13px">
            <div>当前选择</div>
            <div style="height:10px"></div>
            <div>共<strong class="blue">{{data.length || 0}}</strong>项</div>
          </div>
          <div class="flex f1 multi-box" style="margin:0 10px">
            <div class="flex fw" v-if="is('array',data)">
              <div class="multi-box-item" v-for="(item,index) in data" :key="item.id" @click="remove(item,index)">
                {{text(item)}}<i class="el-icon-close el-icon--right pointer info"></i>
              </div>
            </div>
            <div class="multi-box-item" v-else @click="remove">
              {{text(data)}}<i class="el-icon-close el-icon--right pointer info"></i>
            </div>
          </div>
        </div>
        <div>
          <el-button @click="dialogVisible = false" size="mini">关 闭</el-button>
          <div style="height:10px"></div>
          <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import options from "./MySelect.js";
import MyForm from "./MyForm";
import MySelectSearch from "./MySelectSearch";
export default {
  extends: MyForm,
  components: {
    MySelectSearch
  },
  props: {
    size: {
      type: String,
      default: "mini"
    },
    title: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    data: {
      type: [Object, Number, String, Array],
      default() {
        return {};
      }
    },
    type: {
      type: [Number, String],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    preSearch: {
      type: [Object],
      default() {
        return {};
      }
    },
    multi: {
      type: Boolean,
      default: false
    },
    currentCompany: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      options: options,
      innerType: "",
      dialogVisible: false,
      searchOption: {},
      areaInfo: []
    };
  },
  watch: {
    innerType(val) {
      this.$emit("update:type", val);
    },
    data: {
      handler: function(val) {
        this.$emit("change", val);
      },
      deep: true
    },
    dialogVisible(val) {
      if (val === false) {
        this.searchOption = {};
      }
    }
  },
  computed: {
    selectType() {
      let res = "company";
      for (const key in this.options.type) {
        if (this.$attrs.hasOwnProperty(key)) {
          res = key;
        }
      }
      if (this.type) {
        res = this.type;
      }
      return res;
    },
    autoTitle() {
      return "选择" + this.options.type[this.selectType];
    },
    autoPlaceholder() {
      return "请选择" + this.options.type[this.selectType];
    },
    path() {
      return this.options.path[this.selectType];
    },
    thead() {
      return this.options.thead[this.selectType];
    },
    userCompanyTypeChoose() {
      return (
        this.type &&
        (this.selectType === "user" || this.selectType === "company")
      );
    },
    truckShipTypeChoose() {
      return (
        this.type && (this.selectType === "truck" || this.selectType === "ship")
      );
    }
  },
  methods: {
    text(data) {
      if ((this.is("array", data) && data, length > 0)) {
        data = data[0];
      }
      if (typeof data === "object") {
        if (!data) {
          return "";
        }
        return data.nick || data.name || data.mobile || data.no;
      }
      if (typeof data === "number" || typeof data === "string") {
        return data || "";
      }
      return "";
    },
    selectChange(val) {
      this.$emit("update:data", val);
    },
    companyType2Text(typeArr) {
      let res = [];
      typeArr.forEach(item => {
        res.push(this.field.Company.type.option[item]);
      });
      return res.join("、");
    },
    handleSelectionChange(val) {
      this.$emit("update:data", val);
    },
    remove(item, index) {
      if (this.is("array", this.data)) {
        this.data.splice(index, 1);
      } else {
        this.$emit("update:data", {});
      }
    }
  },
  created() {
    if (this.userCompanyTypeChoose || this.truckShipTypeChoose) {
      this.innerType = this.type;
    }
  }
};
</script>

<style>
.input-with-select .el-input {
  width: 40px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  width: 40px;
  padding: 0 10px;
}
.choose-icon {
  font-size: 10px;
  position: absolute;
  top: 25%;
  right: 2px;
  height: 50%;
  background: #fff;
  padding: 0 10px;
}
.disabled-hide {
  position: absolute;
  height: 100%;
  width: 100%;
  background: transparent;
  z-index: 100;
  cursor: not-allowed;
}
.multi-box {
  height: 67px;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid #eee;
  border-radius: 4px;
  /* padding: 8px; */
}
.multi-box-item {
  color: #606266;
  padding: 5px 8px;
  border: 1px dashed #eee;
  height: 30px;
  font-size: 13px;
  border-radius: 4px;
  margin: 5px;
}
</style>