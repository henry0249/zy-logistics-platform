<template>
  <loading-box v-model="loadingText">
    <div class="g-area-add">
      <h2 class="tc">添加区域</h2>
      <div class="flex ac" style="margin:20px 0">
        <div style="padding-right:20px">选择类型</div>
        <el-select style="width:10%" size="small" v-model="type" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div style="padding:0 20px">选择区域</div>
        <div class="f1" v-if="!areaLoading">
          <al-cascader v-model="area" searchable :level="type" />
        </div>
      </div>
      <div class="tr">
        <el-button @click="back()" size="mini">取 消</el-button>
        <el-button type="primary" @click="addArea" size="mini">确定添加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      areaLoading:"",
      type: 3,
      area: [],
      options: [
        {
          label: "省",
          value: 0
        },
        {
          label: "市",
          value: 1
        },
        {
          label: "县",
          value: 2
        },
        {
          label: "乡",
          value: 3
        }
      ]
    };
  },
  methods: {
    typeChange(val) {
      this.loadingText = "加载中...";
      this.areaLoading = true;
      setTimeout(() => {
        this.areaLoading = false;
        this.loadingText = "";
      }, 200);
    },
    async addArea() {
      this.loadingText = "正在添加...";
      try {
        await this.$ajax.post("/area/add", {
          type: this.type,
          data: this.area
        });
        this.$message.success("添加成功!");
      } catch (error) {}
      this.loadingText = "";
    }
  }
};
</script>

<style scoped>
.g-area-add {
  margin: 2%;
  border: 1px solid #eee;
  padding: 2% 15%;
  border-radius: 4px;
}
</style>