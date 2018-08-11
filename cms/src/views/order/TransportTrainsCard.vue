<template>
  <div style="width:220px">
    <el-card class="box-card" shadow="hover">
      <div class="flex ac jb" v-if="title" slot="header" style="font-size:12px">
        {{title}}
        <div v-if="data.type===1" >{{index}}</div>
        <div class="f1"></div>
        <my-form-item v-model="data.areaType" v-if="data.type===1" width="56%" select :options="field.TransportTrains.areaType.option" size="mini"></my-form-item>
        <remove-check></remove-check>
        <!-- <i @click="remove" class="el-icon-delete pointer" style="color:#F56C6C;margin-left:5px"></i> -->
      </div>
      <div v-if="data.type==0">
        <el-tooltip effect="dark" :content="area2name(data.area)" placement="top">
          <common-select class="marginBottom" size="mini" border type="area" :data.sync="data.area" disabled></common-select>
        </el-tooltip>
        <my-form-item label="起运时间" size="mini" datetime></my-form-item>
      </div>
      <div v-if="data.type==1">
        <common-select :data.sync="data.company" class="marginBottom" v-if="data.areaType === 1" size="mini" border type="company" label="公司" @change="companyChange"></common-select>
        <my-form-item class="marginBottom" v-else disabled value="无需选择公司" label="公司" size="mini"></my-form-item>
        <el-tooltip effect="dark" :content="area2name(data.area)" placement="top">
          <common-select :data.sync="data.area" size="mini" border type="area" noChangeText="请选择地址" :disabled="data.areaType === 1"></common-select>
        </el-tooltip>
      </div>
      <div v-if="data.type==2">
        <el-tooltip effect="dark" :content="area2name(data.area)" placement="top">
          <common-select class="marginBottom" size="mini" border type="area" :data.sync="data.area" disabled></common-select>
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
  data() {
    return {
      // company: {}
    };
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
    companyChange(val) {
      this.data.area = val.area
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