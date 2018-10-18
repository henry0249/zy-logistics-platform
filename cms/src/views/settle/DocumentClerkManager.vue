<template>
  <div>
    <List v-if="!$route.params._id" state="documentClerkManager"></List>
    <Edit v-if="$route.params._id" new-state="financial" business transport business-settle transport-settle>
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