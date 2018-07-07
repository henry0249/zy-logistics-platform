<template>
  <div style="width:100%;border:1px solid #ccc;box-sizing:border-box;">
    <div style="height:35px;width:100%;">{{data.title}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default(){
          return {
            palyDate:'2018.01.01',
            id:'',
            title:'退款单',
            date:'2018.01.01',
            refunder:'用户1',
            receivabler:'用户2',
            zhanghu1:'',
            zhanghu2:'',
            zhanghu3:'',
            zhanghu4:'',
            kaihuhang1:'',
            kaihuhang2:'',
            bigValue:'',
            value:'',
            base:''
          }
        } 
      },
    },
  }
</script>

<style scoped>

</style>