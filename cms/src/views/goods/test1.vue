<template>
  <div class="flex cascader-box" :style="{width:(width || $parent.width)||'100%'}">
    <i :title="label" v-if="label" class="label-txt" :style="{fontSize,height:''}">{{label}}</i>
    <el-cascader :size="$attrs.size || 'mini'" style="width:'calc(100% - 60px)'" v-model="data" :options="$attrs.options || []" v-bind="$attrs"></el-cascader>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: [Object, Array],
        default () {
          return {}
        }
      },
      width: {
        type: [Number, String],
        default: '100%'
      },
      label: {
        type: String,
        default: ''
      }
    },
    computed: {
      data() {
        
      },
      fontSize() {
        let size = null;
        if (typeof(this.$attrs.size) === 'string') {
          size = this.$attrs.size
        } else if (typeof(this.$attrs.size) === 'number') {
          size = this.$attrs.size + 'px'
        }
        return size || '12px'
      }
    },
    methods: {},
    created() {}
  }
</script>

<style scoped>
.cascader-box{
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
  .label-txt {
    display: inline-block;
    width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
  }
</style>