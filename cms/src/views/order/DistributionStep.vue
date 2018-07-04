<template>
  <loading-box style="font-size:12px">
    <div style="height:380px;overflow:auto;padding-right:10px">
      <div>
        <div class="tc" style="color:#909399" v-if="stepData.length===0"> 
          暂无物流信息
        </div>
        <el-steps v-if="!edit" size="mini" direction="vertical" :active="1" :space="90" key="step">
          <el-step :status="item.state || 'process'" icon="el-icon-location" v-for="(item,index) in stepData" :key="index">
            <div slot="icon">
              <icon v-if="item.type === 3" color="#67C23A" size="22">icon-dingwei</icon>
              <icon v-else-if="item.type === 2" size="22" color="#E6A23C" style="margin-top:3px">icon-dibiaozhongzhuan1</icon>
              <icon v-else-if="item.type === 0" size="22" color="#F56C6C" style="margin-top:5px">icon-qidian</icon>
              <icon v-else color="#909399" size="19" style="margin-top:5px">icon-wuliu</icon>
            </div>
            <div slot="title" style="font-size:12px;color:#606266" class="tf2">
              <span style="color:#909399">{{item.time | formatTime}} </span> {{item.title || item.address}}
            </div>
            <div slot="description" style="color:#909399" class="tf2">
              {{item.desc}}
            </div>
          </el-step>
        </el-steps>
        <el-steps v-if="edit" size="mini" direction="vertical" :active="1" :space="130" key="editStep">
          <el-step :status="item.state || 'process'" icon="el-icon-location" v-for="(item,index) in stepData" :key="index">
            <div slot="icon">
              <icon v-if="item.type === 3" color="#67C23A" size="22">icon-dingwei</icon>
              <icon v-else-if="item.type === 2" size="22" color="#E6A23C">icon-dibiaozhongzhuan1</icon>
              <icon v-else-if="item.type === 0" size="22" color="#F56C6C">icon-qidian</icon>
              <icon v-else color="#909399" size="19">icon-wuliu</icon>
            </div>
            <div slot="title">
              <el-date-picker v-model="item.time" type="datetime" size="mini" placeholder="选择日期时间" style="width:100%">
              </el-date-picker>
              <el-input  style="margin:10px 0" v-model="item.address" size="mini" placeholder="请输入地址信息"></el-input>
              <div slot="description" class="flex ac">
                <el-input v-model="item.desc" size="mini" placeholder="请输入描述"></el-input>
                <i @click="remove(item,index)" class="el-icon-delete pointer" style="margin-left:10px;color:#F56C6C"></i>
              </div>
            </div>
          </el-step>
        </el-steps>
      </div>
    </div>
    <div class="flex ac" style="padding:10px 0" v-if="stepData.length>0">
      <el-button v-if="!edit" @click="edit=true" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
      <el-button v-if="edit" @click="save" size="mini" type="success" icon="el-icon-success">保存</el-button>
      <div class="f1"></div>
      <el-button v-if="edit" size="mini" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
  </loading-box>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    val: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    data(val) {
      this.stepData = [];
      this.data.forEach(item => {
        this.stepData.unshift(JSON.parse(JSON.stringify(item)));
      });
    }
  },
  data() {
    return {
      stepData: [],
      edit: false
    };
  },
  methods: {
    remove(item, index) {
      let removeIndex = this.data.indexOf(item);
      this.data.splice(removeIndex, 1);
      if (item.type === 0) {
        let newItem = this.data[0];
        newItem.type = 0;
        this.data.splice(0, 1, newItem);
      }
    },
    save() {
      this.edit = false;
      this.$emit('save',this.stepData);
    }
  },
  created() {
    this.stepData = [];
    if (this.val.length > 0) {
      this.stepData = [];
    }
  }
};
</script>

<style scoped>
</style>