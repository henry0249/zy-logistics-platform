<template>
  <div style="width:200px;height:100px;background:#369;margin:100px" @click="$router.push({path:'/stock/ready_list/edit?type=out&_id=5bc0183c1e3bf2cd9f7b232e'})">
    11111111111111111
  </div>
</template>

<script>
  export default {
    methods: {
      async findUser(){
        let data = await this.$ajax.post('/role/set',{
          user:'5af167730974e45869086568',
          type:'sysAdmin'
        })
      }
    },
    created () {
    }
  }
</script>

<style scoped>
.c{
  position: relative
}
</style>