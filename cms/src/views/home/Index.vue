<template>
  <div class="flex g-index">
    <div class="tl" style="background:#fff;flex:1;min-height:100vh">
      <div v-sticky="{stickyTop:40}" class="flex ac" style="background:#fff;padding:10px;border-bottom:1px solid #eee;color:#757575">
        <strong style="color:#424242">最新需求</strong>
        <div class="f1"></div>
        <div style="padding:0 10px">水泥</div>
        <div style="padding:0 10px">砂石</div>
        <div style="padding:0 10px">板材</div>
        <div style="padding:0 10px">钢筋</div>
        <div style="padding:0 10px">化工</div>
      </div>
    </div>
    <div v-sticky="{stickyTop:40}" style="background:#fff;width:20%;height:400px;margin-left:20px">
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import MyHeader from '../common/Header.vue';
  export default {
    components: {
      MyHeader
    },
    methods: {
      async test() {
        // let res = await axios.post('https://m.yixiutech.com/sql/aggregate', {
        //   collection: 'User',
        //   $idmatch:{
        //     parent: {
        //       $in:['5ad21852ab85e142eaef9276']
        //     },
        //   },
        //   option: [{
        //     $group: {
        //       _id: "$_id"
        //     }
        //   }]
        // })
        // let res = await axios.post('https://m.yixiutech.com/sql/find',{
        //   collection:'User',
        //   parent:{
        //     $exists:true
        //   }
        // })
        let res = await this.$ajax.post('/user/aggregate', {
          $idmatch: {
            _id: '5ae0529578c02537f96c7ade',
          },
          option: [{
            $match: {
              mobile: '18877571464'
            }
          }, {
            $group: {
              _id: "$_id"
            }
          }]
        })
        console.log(res);
      }
    }
  }
</script>

<style scoped>
  .g-index {
    min-height: 100vh;
    padding: 0 5%;
    background:#f5f5f5;
    padding-top: 20px
  }
</style>