<template>
  <div class="js elevation-8" style="border-radius:5px;">
    <div class="f1 jc col-flex">
      <div>最新库存:{{data.stock}}</div>
      <div>最新时间：{{data.createdAt}}</div>
    </div>
    <div class="jc" style="width:70px;border-left:1px solid #ccc;">
      <div v-if="show" class="pointer" @click="show = false">操作</div>
      <div v-if="!show">
        <div class="jb" style="margin-bottom:5px;border:1px solid #ccc">
          <i class="el-icon-minus"></i>
          <i class="el-icon-plus" @click="add"></i>
        </div>
        <el-button size="mini" type="success">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data () {
      return {
        show:true
      }
    },
    methods: {
      add(){
        let data = JSON.parse(JSON.stringify(this.data));
        data.stock += 1;
        this.$emit('update:data',data);
      }
    }
  }
</script>

<style scoped>
</style>