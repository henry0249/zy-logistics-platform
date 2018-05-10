<template>
  <div style="width:100%;height:100%">
    <List :keyArr="UserKey"></List>
  </div>
</template>

<script>
  import UserKey from '../common/UserKey';
  import List from '../common/List';
  export default {
    components: {
      List,
    },
    data() {
      return {
        UserKey,
      }
    }
  }
</script>

<style scoped>

</style>