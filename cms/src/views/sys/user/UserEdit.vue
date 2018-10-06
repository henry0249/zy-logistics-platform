<template>
  <user-edit-item v-if="!loadingText" type="edit" :startData="startData" v-model="loadingText">
  </user-edit-item>
</template>

<script>
import UserEditItem from './UserEditItem';
export default {
  components: {
    UserEditItem
  },
  data() {
    return {
      loadingText:'',
      startData: {}
    };
  },
  methods: {
    async getData() {
      try {
        this.startData = await this.$api.curd({
          model: "user",
          curdType: "findOne",
          populate: [
            {
              path: "area"
            },
            {
              path: "recommendedByUser"
            },
            {
              path: "superior"
            },
            {
              path: "parent"
            }
          ],
          _id: this.$route.params._id
        });
      } catch (error) {}
    }
  },
  async created() {
    this.loadingText = '加载中';
    await this.getData();
    this.loadingText = '';
  }
};
</script>

<style scoped>
</style>