<template>
  <div class="jc js" style="flex-wrap: wrap">
    <div :style="{'margin':'0 10px 10px 0',padding:'5px 10px',fontSize:fontSize,border:'1px solid #EBEEF5','box-sizing':'border-box',' border-radius':'4px'}" v-for="(item,index) in newData" :key="index">
      <span>{{item.no || item.name || item.nick || item.mobile}}</span>
      <i class="el-icon-error pointer del" :title="title" @click="delTag(index)"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startData: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    fontSize: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      newData: []
    };
  },
  watch: {
    newData: {
      handler(val) {
        this.$emit("update:data", val);
      },
      deep: true
    }
  },
  computed: {
    title() {
      return "删除该" + this.$parent.getKey().obj.name;
    }
  },
  methods: {
    delTag(index) {
      this.newData.splice(index, 1);
      this.$emit("update:data", this.newData);
    }
  },
  created() {
    this.newData = JSON.parse(JSON.stringify(this.startData));
    for (let index = 0; index < this.newData.length; index++) {
      for (let i = index + 1; i < this.newData.length; i++) {
        if (this.newData[index]._id === this.newData[i]._id) {
          this.newData.splice(i, 1);
        }
      }
    }
  }
};
</script>

<style scoped>
.del {
  color: #c0c4cc;
  margin-left: 5px;
}
.del:hover {
  color: #909399;
}
</style>