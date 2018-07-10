<template>
  <div style="min-width:200px">
    <div class="tc" style="color:#909399;font-size:12px" v-if="data.length===0">
      暂无推荐数据
    </div>
    <my-form-item v-if="data.length>0" v-model="search" size="mini"></my-form-item>
    <el-tabs v-if="data.length>0" type="border-card" style="box-shadow:none;width:100%;margin-top:15px">
      <el-tab-pane v-for="(item,index) in data" :key="item._id || item.id">
        <span style="font-size:13px" @click="tabClick(item,index)" slot="label">{{item.name}}</span>
        <div class="flex ac fw">
          <div v-if="searchFilter(children)" :class="{active:select.indexOf(children)>-1}" class="tabItem pointer" @click="tabItemClick(children,cIndex)" v-for="(children,cIndex) in item.children" :key="children._id || children.id">
            {{children.name || children.mobile || children.tel || children._id}}
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        search: "",
        select: []
      };
    },
    methods: {
      tabClick() {},
      tabItemClick(item, index) {
        let mySet = new Set(this.select);
        if (mySet.has(item)) {
          mySet.delete(item);
        } else {
          if (this.multiple || this.select.length === 0) {
            mySet.add(item);
          } else {
            mySet.clear();
            mySet.add(item);
          }
        }
        this.select = [...mySet];
        if (this.multiple) {
          this.$emit("change", this.select);
        } else {
          this.$emit("change", this.select[0]);
        }
      },
      searchFilter(item) {
        if (this.search) {
          if (item.name) {
            return item.name.indexOf(this.search) > -1;
          } else if (item.mobile) {
            return item.mobile.indexOf(this.search) > -1;
          } else if (item.tel) {
            return item.tel.indexOf(this.search) > -1;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    }
  };
</script>

<style scoped>
  .tabItem {
    padding: 5px 10px;
    margin: 0 5px;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: 13px;
  }
  .tabItem.active {
    color: #fff;
    background: #409eff;
  }
</style>