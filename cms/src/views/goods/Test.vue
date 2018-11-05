<template>
  <div>
    <!-- <div style="width:200px;height:100px;background:#369;margin:100px" @click="$router.push({path:'/stock/ready_list/edit?type=out&_id=5bc0183c1e3bf2cd9f7b232e'})">
                    11111111111111111
                  </div>
                  <input type="button" name="anniu2" @click='copyUrl' value="复制URL地址"> -->
    <!-- <i v-copy="'hahahhaa'">hahahhaa</i> -->
    <!-- <common-select-by-code check size="mini" label="啦啦啦啦啦啦啦啦啦啦"></common-select-by-code> -->
    <!-- <bank-cart :data.sync="data" style="width:100%"></bank-cart> -->
    <!-- <text-dropdown v-model="value" :color="['#E6A23C','#409EFF']" :options="option"></text-dropdown> -->
    <i @click="go">11111111{{testComputed}}</i>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [{
          title: '付款方',
          name: 'A公司',
          account: '',
          bank: ''
        }, {
          title: '收款方',
          name: 'B公司',
          account: '',
          bank: ''
        }],
        value: 0,
        option: {
          0: '用户',
          1: '公司'
        }
      }
    },
    computed: {
      testComputed() {
        return this.$route.query.io;
      }
    },
    methods: {
      go() {
        this.$router.push({
          path: '/goods/test/child',
          query: {
            num: 1,
            io: true
          }
        })
      },
      async findUser() {
        let data = await this.$ajax.post('/role/set', {
          user: '5af167730974e45869086568',
          type: 'sysAdmin'
        })
      },
      copyUrl() {
        window.clipboardData.setData("Text", 'clipBoardContent');
        alert("复制成功!");
      },
      test() {
        return {
          test1: () => {
            console.log('test1');
          },
          test2: () => {
            console.log('test2');
          }
        }
      }
    },
    created() {
      this.test().test1()
    }
  }
</script>

<style scoped>
  .c {
    position: absolute;
    opacity: 0
  }
</style>