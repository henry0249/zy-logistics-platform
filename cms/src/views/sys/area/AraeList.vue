<template>
  <div>
    <my-table size="mini" height="100vh - 50px"  index selection :loadmore="loadmore" :thead="thead" :data.sync="data">
      
    </my-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        thead: {
          key:'行政编码',
        },
        data:[]
      }
    },
    methods: {
      loadmore() {
        
      }
    },
  }
</script>

<style scoped>

</style>