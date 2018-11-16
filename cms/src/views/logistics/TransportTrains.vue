<template>
  <div>
    <List v-if="!$route.params._id" state="salesmanManager"></List>
    <Edit v-if="$route.params._id" newState="tradeClerk">
    </Edit>
  </div>
</template>

<script>
  import List from "./List.vue";
  import Edit from "./Edit.vue";
  export default {
    components: {
      List,
      Edit
    }
  };
</script>

<style scoped>

</style>