<template>
  <div>
    <List v-if="!$route.params._id" state="logisticsClerk"></List>
    <Edit v-if="$route.params._id" new-state="documentClerk" business transport>
    </Edit>
  </div>
</template>

<script>
  import List from "../order/List.vue";
  import Edit from "../order/Edit.vue";
  export default {
    components: {
      List,
      Edit
    }
  };
</script>

<style scoped>

</style>