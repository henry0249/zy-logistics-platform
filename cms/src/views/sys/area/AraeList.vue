<template>
  <common-table border :thead="thead" path="/area/find" :option="option">
    <template slot-scope="scope">
        <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'key'" @click="see(scope)">{{scope.row['key']}}</i>
    </template>
  </common-table>
</template>

<script>
  export default {
    data() {
      return {
        option:{
          populate:[
            {path:'province'},
            {path:'city'},
            {path:'county'},
          ],
          type:'township'
        },
        thead: {
          key:{
            name:'行政编码',
            slot:true
          },
          'province.name':{
            name:'省'
          },
          'city.name':{
            name:'市'
          },
          'county.name':{
            name:'县'
          },
          name:{
            name:'乡/镇'
          }
        },
      }
    },
    methods: {
      see(val){
        console.log(val);
        this.$router.push({
          path:'/sys/area/edmit/' + val.row._id
        })
      }
    },
  }
</script>

<style scoped>
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>