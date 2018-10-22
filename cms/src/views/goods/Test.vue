<template>
  <div>
    <!-- <div style="width:200px;height:100px;background:#369;margin:100px" @click="$router.push({path:'/stock/ready_list/edit?type=out&_id=5bc0183c1e3bf2cd9f7b232e'})">
      11111111111111111
    </div>
    <input type="button" name="anniu2" @click='copyUrl' value="复制URL地址">
    <i v-copy="'hahahhaa'">hahahhaa</i> -->
    <common-select-by-code size="mini" label="啦啦啦啦啦啦啦啦啦啦"></common-select-by-code>
  </div>
</template>

<script>
  export default {
    methods: {
      async findUser() {
        let data = await this.$ajax.post('/role/set', {
          user: '5af167730974e45869086568',
          type: 'sysAdmin'
        })
      },
      copyUrl() {
        // var clipBoardContent = this.location.href;
        window.clipboardData.setData("Text", 'clipBoardContent');
        alert("复制成功!");
      }
    },
    created() {}
  }
</script>

<style scoped>
.c{
  position: absolute;
  opacity: 0
}
</style>