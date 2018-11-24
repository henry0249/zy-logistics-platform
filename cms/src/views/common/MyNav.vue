<template>
  <div class="nav-box jc">
    <div class="nav-item jc js" :style="{color:data === key?'#fff':'',background:data === key?'#409eff':''}" v-for="(item,key) in options" :key="key" @click="select(item,key)">{{item.label}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      activeName: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        data: '',
      }
    },
    watch: {
      data(val, old) {
        if (old) {
          this.$emit('update:activeName', val);
        }
      }
    },
    methods: {
      classMethods(item, index) {
        let data = {};
        if (index === 0) data['no-left-border'] = true;
        if (this.data === item.key) data['no-border'] = true;
        return data;
      },
      select(item, key) {
        this.data = key;
        this.$emit('select', {
          item,
          key
        });
      },
    },
    created() {
      this.data = JSON.parse(JSON.stringify(this.activeName));
    }
  }
</script>

<style scoped>
  .nav-box {
    width: 100%;
    /* border-top: 1px solid #EBEEF5; */
    border-bottom: 1px solid #DCDFE6;
    padding-bottom: 5px;
  }
  .nav-item {
    padding: 0 15px;
    height: 51px;
    border-radius: 5px;
  }
</style>