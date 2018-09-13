<template>
  <div>
  </div>
</template>

<script>
  export default {
    methods: {
      test() {
        let n = 999;
        let nAdd = function() {
          n += 1;
        };
        function f2() {
          console.log(n);
        }
        return f2;
      }
    },
    created() {
      var result = this.test();
      result()
    }
  };
</script>

<style scoped>

</style>