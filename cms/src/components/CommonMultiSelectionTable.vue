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
    <common-table size="mini" height="50vh - 50px" selection @selection-change="selectionChange" style="margin-top:10px;padding:0px;width:100%;" :path="path" :thead="thead"></common-table>
  </div>
</template>

<script>
export default {
  props: {
    keyData: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      maxHeight: "",
      dynamicTags: []
    };
  },
  watch: {
    dynamicTags:{
      handler(val){
        this.$emit('update:data',val)
      },
      deep:true
    }
  },
  computed: {
    path() {
      return "/" + this.keyData.key + "/find";
    },
    thead() {
      return this.keyData.obj.thead;
    }
  },
  methods: {
    selectionChange(val) {
      let data = JSON.parse(JSON.stringify(this.dynamicTags));
      val.forEach(item => {
        data.push(item);
      });
      for (let index = 0; index < data.length; index++) {
        for (let i = index + 1; i < data.length; i++) {
          if (data[index]._id === data[i]._id) {
            data.splice(i,1);
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
  mounted() {
  },
  created() {
    console.log(this.keyData);
  }
};
</script>

<style scoped>
</style>