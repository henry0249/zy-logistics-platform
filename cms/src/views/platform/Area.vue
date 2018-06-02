<template>
  <div>
    <loading-box v-model="laodingText">
      <my-table style="padding:0 1%" size="mini" height="100vh - 50px" index border :loadmore="loadmore" :thead="thead" :data.sync="data">
        <div class="flex ac" slot="header" style="padding:1% 0">
          <my-form-item v-model="areaType" select :options="field.Area.type.option" @change="areaTypeChange" size="mini" style="width:20%" label="类型" placeholder="选择区域类型" />
          <!-- <el-button icon="el-icon-search" style="margin-left:20px" size="mini" type="primary">搜索</el-button> -->
          <div class="f1"></div>
          <el-dropdown @command="dropdownHandle">
            <el-button icon="el-icon-plus" style="margin-left:20px" size="mini" type="primary" @click="show=true">添加区域<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,key) in field.Area.type.option" :key="key" :command="key">添加{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <template slot-scope="scope">
          <span v-if="scope.prop==='type'">{{field.Area.type.option[scope.row[scope.prop]]}}</span>
        </template>
      </my-table>
      <el-dialog size="mini" :title="`添加${field.Area.type.option[areaType]}`" :visible.sync="dialogVisible" width="40%">
        <div>
          <div>
            <my-form size="mini" v-if="dialogVisible">
              <div class="flex ac jb">
                <my-form-item @change="dropdownHandle" style="width:30%" label="添加类型" v-model="areaType" select :options="field.Area.type.option" placeholder="选择区域类型" />
                <my-form-item style="width:65%" label="区域数据" v-model="area" :area="area" :level="areaLevel" placeholder="选择数据" @change="areaChange"/>
              </div>
              <el-alert  style="margin-top:20px" v-if="areaType==='street'" title="选择街道时,区域数据对应的是乡,需要手动添加街道名称" type="warning">
              </el-alert>
              <div class="flex ac jb" style="margin-top:20px" v-if="areaType==='street'" >
                <my-form-item style="width:30%" input type="number" v-model="streetOtion.key" label="街道编码">
                </my-form-item>
                <my-form-item style="width:65%" input v-model="streetOtion.name" label="街道名称">
                </my-form-item>
              </div>
            </my-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addArea">确定添加{{field.Area.type.option[areaType]}}</el-button>
        </div>
      </el-dialog>
    </loading-box>
  </div>
</template>

<script>
import AreaAdd from "./AreaAdd";
export default {
  components: {
    AreaAdd
  },
  data() {
    return {
      laodingText: "",
      areaType: "province",
      thead: {
        type: {
          name: "类型",
          slot: true
        },
        key: "编码",
        name: "名称"
      },
      data: [],
      limit: 10,
      dialogVisible: false,
      area: [],
      areaLevel: 0,
      streetOtion: {
        key: 0,
        name: ""
      },
      areaOption: {}
    };
  },
  methods: {
    dropdownHandle(val) {
      this.dialogVisible = true;
      this.areaType = val;
      let level = {
        province: 0,
        city: 1,
        county: 2,
        township: 3,
        street: 4
      };
      this.areaLevel = level[val];
    },
    areaChange(val) {
      this.areaOption = val;
    },
    async addArea() {
      console.log(this.areaOption);
      if (this.is("empty", JSON.parse(JSON.stringify(this.areaOption)))) {
        this.$message.loading("没有选择区域数据");
        return;
      }
      if (!this.streetOtion.name && this.areaType === "street") {
        this.$message.error("没有输入街道名称");
        return;
      }
      this.dialogVisible = false;
      this.laodingText = "正在添加...";
      try {
        let addOption = {
          type: this.areaType,
          ...this.areaOption
        };
        if (this.areaType === "street") {
          addOption.street = this.streetOtion;
        }
        await this.$ajax.post("/area/add", addOption);
      } catch (error) {}
      this.laodingText = "";
    },
    areaTypeChange(val){
      this.areaType = val;
      this.getAreaTable()
    },
    async getAreaTable() {
      this.laodingText = "正在添加...";
      this.data = [];
      try {
        this.data = await this.$ajax.post("/area/find?type=", {
          type: this.areaType,
          limit: this.limit || 10
        });
        this.area = await this.$ajax("/area/select");
      } catch (error) {}
      this.laodingText = "";
    },
    async loadmore() {
      let res = [];
      try {
        res = await this.$ajax.post("/area/find", {
          type: this.areaType,
          limit: this.limit || 10,
          skip: this.data.length
        });
      } catch (error) {}
      return res;
    }
  },
  created() {
    this.getAreaTable();
  }
};
</script>

<style scoped>
</style>