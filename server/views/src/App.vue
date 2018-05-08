<template>
  <component :is="component" />
</template>

<script>
let views = {
  index: () => import("./views/index/App.vue"),
  login: () => import("./views/login/App.vue"),
  notfound: () => import("./views/notfound/App.vue")
};
export default {
  name: "App",
  data() {
    return {
      views: views
    };
  },
  computed: {
    component() {
      let componentName = location.pathname
        .replace("/views/", "")
        .replace(".html", "");
        
      if (componentName === '/') {
        return "login";
      }

      if (this.views[componentName]) {
        return componentName;
      }

      return "notfound";
      
    }
  },
  components: views
};
</script>

<style>

</style>
