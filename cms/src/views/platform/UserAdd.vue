<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <user-item :loadingText.sync="loadingText" sub-txt="确 定" title="添加用户" @sub="sub">
        <form-item slot="form" v-model="loadingText" :userObj.sync="userObj" :thead="thead" :data.sync="data" :platformArr="platformArr" :companyArr="companyArr" :userArr="userArr" :address="address"></form-item>
      </user-item>
    </div>
  </loading-box>
</template>

<script>
  import UserItem from './UserItem.vue';
  import FormItem from './FormItem.vue';
  export default {
    components: {
      UserItem,
      FormItem
    },
    data() {
      return {
        loadingText: '',
        userObj: {
          name: '',
          mobile: '',
          type: '',
          tag: [],
          email: '',
          balance: 0,
          platform: [],
          company: [],
          recommendedByUser: '',
          superior: '',
          parent: '',
          role: [],
          defaultAddress: '',
          address: [],
          area: [{
            value: []
          }]
        },
        platformArr: [],
        companyArr: [],
        userArr: [],
        address: [],
        data: [{
          default: false,
          contactName: '',
          area: [],
          name: '',
          contactMobile: ''
        }],
        thead: {
          default: {
            name: '默认地址',
            readOnly: true,
            slot: true,
          },
          contactName: {
            name: '联系人',
          },
          area: {
            name: '区域',
            readOnly: true,
            slot: true,
          },
          name: {
            name: '详细地址',
          },
          contactMobile: {
            name: '联系电话',
          }
        }
      }
    },
    watch: {
      'userObj.name' (val) {
        console.log(this.userObj);
      }
    },
    methods: {
      async sub() {
        console.log(1);
        if (this.userObj.mobile) {
          console.log(2);
          let io = true;
          try {
            console.log(3);
            this.loadingText = '添加中';
            let userop = {}
            for (const key in this.userObj) {
              if (this.userObj.hasOwnProperty(key)) {
                if (key === 'area') {
                  userop[key] = [];
                  let io = true
                  this.userObj[key].forEach(item => {
                    if (item.value.length > 0) {
                      userop[key].push(item.value[0])
                    } else {
                      io = false
                    }
                  });
                  if (!io) {
                    delete userop[key]
                  }
                } else if (this.userObj[key] === '' || this.userObj[key].length === 0) {} else {
                  userop[key] = this.userObj[key];
                }
              }
            }
            userop.model = 'user';
            userop.curdType = 'set';
            delete userop.defaultAddress
            console.log('userop', userop);
            for (const key in userop) {
              if (userop[key] === '' || userop[key].length === 0) {
                delete userop[key]
              }
            }
            let user = await this.$api.curd(userop)
            if (user) {
              for (let index = 0; index < this.data.length; index++) {
                let addressop = {}
                for (const key in this.data[index]) {
                  if (this.data[index].hasOwnProperty(key)) {
                    if (key === 'area') {
                      addressop[key] = this.data[index][key][this.data[index][key].length - 1]
                    } else {
                      addressop[key] = this.data[index][key]
                    }
                  }
                }
                addressop.model = "address";
                addressop.curdType = "set";
                if (this.userObj.company.length > 0) {
                  addressop.company = this.userObj.company;
                } else {
                  delete addressop.company
                }
                addressop.user = user._id;
                let address = await this.$api.curd(addressop);
                if (address && this.data[index].default) {
                  let updateUser = await this.$api.curd({
                    model: 'user',
                    curdType: 'update',
                    find: {
                      _id: user._id
                    },
                    update: {
                      defaultAddress: address._id
                    }
                  })
                };
                if (!address) {
                  io = false
                };
              }
            }
          } catch (error) {}
          this.loadingText = '';
          if (io) {
            this.$confirm("修改成功", "提示", {
                confirmButtonText: "留在本页面",
                cancelButtonText: "返回列表",
                type: "success "
              })
              .then(() => {
                this.$router.go(0);
              })
              .catch(() => {
                this.$router.go(-1);
              });
          }
        } else {
          this.$alert('手机号码必填', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        }
      },
      async getPlatform() {
        try {
          this.platformArr = await this.$api.curd({
            model: 'platform',
            curdType: 'find'
          })
        } catch (error) {}
      },
      async getCompany() {
        try {
          this.companyArr = await this.$api.curd({
            model: 'company',
            curdType: 'find'
          })
        } catch (error) {}
      },
      async getUser() {
        try {
          this.userArr = await this.$api.curd({
            model: 'user',
            curdType: 'find'
          })
        } catch (error) {}
      },
      async getAddress() {
        try {
          this.address = await this.$api.curd({
            model: 'address',
            curdType: 'find'
          })
        } catch (error) {}
      }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getPlatform();
      await this.getCompany();
      await this.getUser();
      await this.getAddress();
      this.loadingText = ''
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
</style>