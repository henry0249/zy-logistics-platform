<template>
  <div style="width:220px">
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
            <!-- <al-cascader v-model="areaArr" data-type="name" disabled /> -->
          </div>
        </el-tooltip>
        <my-form-item label="起运时间" size="mini" datetime></my-form-item>
      </div>
      <div v-if="Number(data.type)===1">
        <my-select v-if="data.areaType === 1"  class="marginBottom" :data.sync="data.company" company @change="companyChange"></my-select>
        <!-- <common-select :data.sync="data.company" class="marginBottom" v-if="data.areaType === 1" size="mini" border type="company" label="公司" @change="companyChange"></common-select> -->
        <my-form-item class="marginBottom" v-else disabled value="无需选择公司" label="公司" size="mini"></my-form-item>
        <el-tooltip key="0" v-if="data.areaType === 0" effect="dark" :content="areaInfo(data)" placement="top">
          <al-cascader v-model="data.areaArr" data-type="all" size="small" />
        </el-tooltip>
        <el-tooltip key="1" v-else effect="dark" :content="areaInfo(data)" placement="top">
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
export default {
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
    }
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
  methods: {
    areaInfo(item) {
      let res = "请选择地址";
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
    },
    remove() {
      this.$emit("remove", this.data);
    }
  }
};
</script>

<style scoped>
.marginBottom {
  margin-bottom: 10px;
}
</style>