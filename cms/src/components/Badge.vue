<template>
  <div class="g-badge">
    <slot></slot>
    <div v-if="num!=undefined && Number(num)>0" class="c-badge">
      {{num|big}}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      num: {
        type: [Number,String],
        default: ''
      },
    },
    filters: {
      big(val){
        if (Number(val)>999) {
          return '999+'
        }else{
          return val
        }
      }
    }
  }
</script>

<style scoped>
.g-badge{
  display: inline-block;
  position: relative;
}
.c-badge{
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  border-radius: 100vw;
  background: #FF5722;
  box-shadow: 0 0 10px #FF5722;
  color: #fff;
  transform: translateX(40%) translateY(-40%) scale(.8)
}
</style>