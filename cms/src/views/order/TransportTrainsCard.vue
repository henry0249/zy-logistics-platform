<template>
  <div style="width:220px">
    <el-card class="box-card" shadow="hover">
      <div class="flex ac jb" v-if="title" slot="header" style="font-size:12px">
        {{title}}
        <div v-if="data.type===1">{{index}}</div>
        <div class="f1"></div>
        <!-- <el-dropdown v-if="data.type===1" @command="handleCommand" trigger="click">
          <div :class="{blue:data.areaType==0,warning:data.areaType===1,success:data.areaType===2}" style="font-size:12px">
            <span v-if="data.areaType==0">普通地址</span>
            <span v-if="data.areaType==1">公司地址</span>
            <span v-if="data.areaType==2">贸易节点</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="dropdownItem in json2arr(field.TransportTrains.areaType.option)" :key="dropdownItem._id||dropdownItem.value || dropdownItem.id" :command="dropdownItem.value">{{dropdownItem.name || dropdownItem.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <text-dropdown v-if="data.type===1" v-model="data.areaType" :color="['#409EFF','#E6A23C','#67C23A']" :options="field.TransportTrains.areaType.option"></text-dropdown>
        <div style="margin-left:5px" v-if="data.type===1">
          <remove-check @remove="remove"></remove-check>
        </div>
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
        default () {
          return {};
        }
      },
      data: {
        type: Object,
        default () {
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
      handleCommand(val){
        this.data.areaType = val;
      },
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