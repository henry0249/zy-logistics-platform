<template>
  <div>
    <List v-if="!$route.params._id" state="tradeClerk"></List>
    <Edit v-if="$route.params._id" newState="dispatcher" business>
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