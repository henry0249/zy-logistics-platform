
<template>
  <div>
    <!-- <div @click="clickMethods">ghghghg</div> -->
    <Test @test="test"></Test>
  </div>
</template>

<script>
  import Test from './goods/Test.vue';
  export default {
    components: {
      Test
    },
    methods: {
      clickMethods() {
        console.log('11111');
      },
      test() {
        this.$on('test', function(msg) {
          console.log(msg)
        })
      }
    }
  }
</script>

<style scoped>

</style>