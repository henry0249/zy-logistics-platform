<template>
  <div :style="{width:width}">
    <el-card class="box-card" shadow="hover">
      <div class="flex ac jb" v-if="title" slot="header" style="font-size:12px">
        {{title}}
        <div v-if="Number(data.type)===1">{{index}}</div>
        <div class="f1"></div>
        <text-dropdown v-if="Number(data.type)===1" v-model="data.areaType" :color="['#409EFF','#E6A23C','#67C23A']" :options="field.TransportTrains.areaType.option"></text-dropdown>
        <div style="margin-left:5px" v-if="Number(data.type)===1">
          <remove-check @remove="remove"></remove-check>
        </div>
      </div>
      <div v-if="Number(data.type)===0">
        <el-tooltip effect="dark" :content="areaInfo(data)" placement="top">
          <div class="marginBottom">
            <my-select area :data.sync="data.area" disabled></my-select>
          </div>
        </el-tooltip>
        <my-form-item label="起运时间" size="mini" datetime></my-form-item>
      </div>
      <div v-if="Number(data.type)===1">
        <div class="marginBottom">
          <my-form-item v-if="Number(data.areaType) === 0" size="mini" text value="根据实际地址自行选择"></my-form-item>
          <relation-company v-if="Number(data.areaType) === 1 && order._id" :order="order" :data.sync="data.company" @change="companyChange" label="公司" transport></relation-company>
          <!-- <my-form-item v-if="Number(data.areaType) === 1" select v-model="data.company" :options="order.handle.businessRelationCompany || []" size="mini" @change="companyChange" label="公司" placeholder="请选择关联公司"></my-form-item> -->
        </div>
        <el-tooltip key="areaType0" v-if="Number(data.areaType) === 0" effect="dark" :content="areaInfo(data)" placement="top">
          <al-cascader v-model="data.areaArr" size="small" />
        </el-tooltip>
        <el-tooltip key="areaType1" v-else effect="dark" :content="areaInfo(data)" placement="top">
          <my-select area :data.sync="data.area" disabled placeholder="请选择地址"></my-select>
        </el-tooltip>
      </div>
      <div v-if="Number(data.type)===2">
        <el-tooltip effect="dark" :content="areaInfo(data)" placement="top">
          <div class="marginBottom">
            <my-select area :data.sync="data.area" disabled></my-select>
          </div>
        </el-tooltip>
        <my-form-item label="收货时间" size="mini" datetime></my-form-item>
      </div>
    </el-card>
  </div>
</template>

<script>
import RelationCompany from "./RelationCompany";
export default {
  components: {
    RelationCompany
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    order: {
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
    },
    width: {
      type: String,
      default: "220px"
    },
    settle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    title() {
      let res = {
        0: "起运地",
        1: "中转地",
        2: "目的地"
      };
      return res[this.data.type] || "地点";
    }
  },
  watch: {
    "data.areaType"(val) {
      this.$set(this.data, "company", "");
      this.$set(this.data, "area", {});
      this.$set(this.data, "areaArr", []);
    },
    "data.area"() {
      let areaInfo = this.areaInfo(this.data);
      this.$set(this.data, "areaInfo", areaInfo);
    },
    "data.areaArr"() {
      let areaInfo = this.areaInfo(this.data);
      this.$set(this.data, "areaInfo", areaInfo);
    }
  },
  methods: {
    areaInfo(item) {
      let res = "请选择地址";
      if (!item) {
        return res;
      }
      if (Number(item.type) === 1) {
        if (item.areaType === 0) {
          if (item.areaArr instanceof Array && item.areaArr.length > 0) {
            let temp = [];
            item.areaArr.forEach(item => {
              temp.push(item.name);
            });
            res = temp.join("/");
          }
        } else {
          res = this.area2name(item.area);
        }
      } else {
        res = this.area2name(item.area);
      }
      return res;
    },
    handleCommand(val) {
      this.data.areaType = val;
    },
    companyChange(val) {
      this.data.area = val.area;
      this.$set(this.data, "company", val._id);
    },
    remove() {
      this.$emit("remove", this.data);
    },
    getBusinessTrainsArea() {
      let res = [];
      this.order.businessTrains.forEach(item => {
        if (item.type === "pool") {
          res.push(item.company);
        }
      });
      return res;
    }
  },
  mounted() {
    if (this.data.areaArr && this.data.areaArr.length > 0) {
      let temp = [];
      this.data.areaArr.forEach(item => {
        temp.push(item.name);
      });
      this.data.areaArr = temp;
    }
  }
};
</script>

<style scoped>
.marginBottom {
  margin-bottom: 10px;
}
</style>