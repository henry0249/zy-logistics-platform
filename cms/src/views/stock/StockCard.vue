<template>
  <el-card>
    <div class="flex ac jb">
      <div :class="typeData.className">
        <i class="el-icon-menu el-icon--right"></i> {{typeData.title}}
      </div>
      <div class="info">
        <i class="el-icon-time el-icon--right"></i><span style="color:#ccc">{{time | formatTime('YYYY-MM-DD hh:mm')}}</span>
      </div>
    </div>
    <div class="tc" :class="typeData.className" :style="{fontSize:stockFontSize}">
      {{data || 0}}
    </div>
    <div class="flex ac jb" style="padding:0 1px">
      <div class="line"></div>
      <div v-for="key in typeData.tool" :key="key">
        <el-tooltip effect="dark" :content="`新增${toolObj[key].name}单`" placement="bottom">
          <div :class="toolObj[key].className" class="pointer" @click="changeStock(key)">
            <i :class="toolObj[key].icon" class="el-icon--right"></i>
            {{toolObj[key].name}}
          </div>
        </el-tooltip>
      </div>
      <div class="line"></div>
    </div>
  </el-card>
</template>

<script>
  export default {
    props: {
      data: {
        type: Number,
        default: 0
      },
      time: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "stock"
      }
    },
    data() {
      return {
        toolObj: {
          increase: {
            name: "增益",
            icon: "el-icon-circle-plus",
            className: "success"
          },
          decrease: {
            name: "损耗",
            icon: "el-icon-remove",
            className: "danger"
          },
          in: {
            name: "入库",
            icon: "el-icon-download",
            className: "blue"
          },
          out: {
            name: "出库",
            icon: "el-icon-upload2",
            className: "danger"
          },
          check: {
            name: "盘点",
            icon: "el-icon-document",
            className: "warning"
          }
        },
        typeObj: {
          stock: {
            title: "当前库存",
            name: "库存",
            className: "info",
            tool: ["increase", "decrease"]
          },
          in: {
            title: "累计入库",
            name: "入库",
            className: "blue",
            tool: ["in"]
          },
          out: {
            title: "累计出库",
            name: "出库",
            className: "danger",
            tool: ["out"]
          },
          check: {
            title: "累计盘点",
            name: "盘点",
            className: "warning",
            tool: ["check"]
          }
        }
      };
    },
    computed: {
      typeData() {
        let type = "stock";
        for (const key in this.typeObj) {
          if (this.$attrs[key] !== undefined) {
            type = key;
          }
        }
        if (this.type && this.typeObj[this.type]) {
          type = this.type;
        }
        return this.typeObj[type];
      },
      stockFontSize() {
        let num = this.data || 0;
        let fontSize = 60,
          sizeStep = 5,
          min = 10000;
        let numLength = num.toString().length;
        if (numLength > 5) {
          fontSize = fontSize - (numLength - 5) * sizeStep;
        }
        return fontSize + "px";
      }
    },
    methods: {
      changeStock(type) {
        this.$router.push({
          path: "/stock/add",
          query: {
            type
          }
        });
      }
    }
  };
</script>

<style scoped>
  .line {
    height: 15px;
    width: 1px;
    background: #ddd;
  }
</style>