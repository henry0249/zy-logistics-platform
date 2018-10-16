<template>
  <div>
    <List v-if="!$route.params._id" state="logisticsClerk"></List>
    <Edit v-if="$route.params._id"></Edit>
  </div>
</template>

<script>
  import List from "./LogisticsList.vue";
  import Edit from "./DistributionEdit.vue";
  export default {
    components: {
      List,
      Edit
    }
  };
</script>

<style scoped>

</style>