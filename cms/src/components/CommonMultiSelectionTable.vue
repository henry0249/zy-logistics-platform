<template>
  <div>
    <div class="as js" ref="tag">
      <div :style="{fontSize:$parent.fontSize,flex:'0 0 80px'}">已选择：</div>
      <div style="flex-wrap:wrap;max-height:50px;overflow:auto;">
        <el-tag style="margin-right:5px;" v-if="dynamicTags.length > 0" :key="index" size="mini" v-for="(tag,index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag,index)">
          {{tag.no || tag.name || tag.nick || tag.mobile}}
        </el-tag>
        <div v-if="dynamicTags.length <= 0">未选择</div>
      </div>
    </div>
    <common-table size="mini" height="50vh - 50px" selection @selection-change="selectionChange" style="margin-top:10px;padding:0px;width:100%;" :path="path" :thead="thead" :option="op">
      <common-multi-selection-table-search slot="header" :data.sync="inputData" :type="typeChange"></common-multi-selection-table-search>
    </common-table>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: ''
      },
      option: {
        type: Object,
        default () {
          return {}
        }
      },
      selectIo: {
        type: Boolean,
        default: false
      },
      keyData: {
        type: Object,
        default () {
          return {};
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        inputData:{},
        maxHeight: "",
        dynamicTags: [],
        op:{},
      };
    },
    watch: {
      inputData:{
        handler(val){
          console.log(val);
          for (const key in val) {
            this.$set(this.op,key,val[key]);
          }
        },
        deep:true
      },
      dynamicTags: {
        handler(val) {
          this.$emit("update:data", val);
        },
        deep: true
      }
    },
    computed: {
      typeChange(){
        return this.type;
      },
      path() {
        return "/" + this.keyData.key + "/find";
      },
      thead() {
        return this.keyData.obj.thead;
      }
    },
    methods: {
      selectionChange(val) {
        this.$emit("update:selectIo", true);
        let data = JSON.parse(JSON.stringify(this.dynamicTags));
        val.forEach(item => {
          data.push(item);
        });
        for (let index = 0; index < data.length; index++) {
          for (let i = index + 1; i < data.length; i++) {
            if (data[index]._id === data[i]._id) {
              data.splice(i, 1);
            }
          }
        }
        this.dynamicTags = data;
      },
      handleClose(tag, index) {
        this.dynamicTags.splice(index, 1);
      },
      recursion(index, arr) {
        if (index <= arr.length - 1) {
          return index;
        } else {
          this.recursion(index - arr.length, arr);
        }
      },
      tagType(index, arr) {
        let type = ["success", "info", "warning", "danger"];
        if (index <= type.length - 1) {
          return type[index];
        } else {
          return type[this.recursion(index, type)];
        }
      }
    },
    created () {
      if (Object.keys(this.option).length > 0) {
        this.op = JSON.parse(JSON.stringify(this.option));
      }
    }
  };
</script>

<style scoped>

</style>