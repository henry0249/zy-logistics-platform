<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div v-if="!loadingText" class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>用户详情</strong>
        </div>
        <my-form v-if="!loadingText" slot="form" size="mini" width="24%" style="margin:15px 0">
          <el-alert title="用户信息" type="info" :closable="false" style="margin:15px 0"></el-alert>
          <user-form-item :areaArr.sync="areaArr" :startObj="startObj" @changeArea="changeArea" :userObj.sync="userObj" v-model="loadingText" :startAreaArr="startAreaArr" :platformArr="platformArr" :companyArr="companyArr" :userArr="userArr"></user-form-item>
          <el-alert title="地址列表" type="info" :closable="false" style="margin:15px 0"></el-alert>
          <user-area-table v-model="loadingText" :startUserObj="startObj" :userObj="userObj" :thead="thead" :data.sync="data" :newAreaArr="newAreaArr" :getAreaOp="getAreaOp"></user-area-table>
        </my-form>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.push({path:`/platform/user_account_edmit/${$route.params._id}`})">账户管理</el-button>
        </div>
        <div>
          <el-button size="small" @click="back()">返 回</el-button>
          <el-button size="small" type="primary" @click="sub" :disabled="disabled">修 改</el-button>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import UserFormItem from './UserFormItem.vue';
  import UserAreaTable from './UserAreaTable.vue';
  import UserAccount from './UserAccount.vue';
  export default {
    components: {
      UserFormItem,
      UserAreaTable,
      UserAccount
    },
    data() {
      return {
        io: false,
        disabled: true,
        newAreaArr: [],
        areaArr: [],
        startAreaArr: [],
        getAreaOp: {},
        loadingText: '',
        startObj: {},
        userObj: {},
        platformArr: [],
        companyArr: [],
        userArr: [],
        address: [],
        accountArr: [],
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
      areaArr: {
        handler(val) {
          this.disabled = false;
        },
        deep: true
      },
      userObj: {
        handler(val) {
          let userKeyArr = ['name', 'mobile', 'email', 'type', 'tag', 'platform', 'company', 'role', 'recommendedByUser', 'superior', 'parent'];
          userKeyArr.forEach(item => {
            console.log(item, val[item], this.startObj[item]);
            console.log(val[item] === this.startObj[item]);
            if (val[item] !== this.startObj[item]) {
              this.disabled = false;
              return
            }
          });
          this.io = true;
          console.log(this.disabled);
        },
        deep: true
      }
    },
    methods: {
      async getArea(_id, index) {
        try {
          let res = await this.$api.curd({
            model: 'area',
            curdType: 'findOne',
            _id,
            populate: [{
              path: 'province'
            }, {
              path: 'city'
            }, {
              path: 'county'
            }]
          })
          if (typeof(index) === 'number') {
            this.newAreaArr.splice(index, 1, {
              _id: res._id,
              name: res.name
            })
          } else {
            this.newAreaArr.push({
              _id: res._id,
              name: res.name
            })
          }
        } catch (error) {}
      },
      async changeArea(val) {
        console.log(val);
        this.getAreaOp = Object.assign({}, this.getAreaOp, {
          event: val.event,
          index: val.index
        });
        // this.loadingText = '加载中';
        await this.getArea(val.event[3], val.index);
        // this.loadingText = '';
      },
      async sub() {
        console.log(this.userObj, this.data);
        if (this.userObj.mobile) {
          let io = true;
          try {
            this.loadingText = '更新中';
            let userop = {};
            let userObj = {};
            let userKeyArr = ['name', 'mobile', 'email', 'type', 'tag', 'platform', 'company', 'role', 'recommendedByUser'];
            userop.find = {
              _id: this.$route.params._id
            };
            userop.update = {};
            userKeyArr.forEach(item => {
              if (this.userObj[item]) {
                if (item === 'recommendedByUser') {
                  userop.update[item] = this.userObj[item][0]._id
                } else {
                  userop.update[item] = this.userObj[item];
                }
              }
            });
            userop.update.area = this.areaArr;
            userop.model = 'user';
            userop.curdType = 'update';
            console.log('userop', userop);
            let user = await this.$api.curd(userop);
            if (user) {
              let userAddress = []
              for (let index = 0; index < this.data.length; index++) {
                let addressop = {};
                let addressKeyArr = ['default', 'contactName', 'area', 'name', 'contactMobile'];
                addressop.model = "address";
                if (this.data[index]._id) {
                  addressop.curdType = "update";
                  addressop.update = {};
                  addressop.find = {
                    _id: this.data[index]._id
                  }
                  addressKeyArr.forEach(item => {
                    addressop.update[item] = this.data[index][item];
                  });
                } else {
                  addressKeyArr.forEach(item => {
                    addressop[item] = this.data[index][item];
                  });
                  addressop.curdType = "set";
                  addressop.company = this.userObj.company;
                  addressop.user = user._id;
                }
                console.log('addressop', addressop);
                let address = await this.$api.curd(addressop);
                if (this.data[index]._id) {
                  userAddress.push(this.data[index]._id)
                } else {
                  userAddress.push(address._id)
                }
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
              if (userAddress.length > 0) {
                let updateUserAddress = await this.$api.curd({
                  model: 'user',
                  curdType: 'update',
                  find: {
                    _id: this.$route.params._id
                  },
                  update: {
                    address: userAddress
                  }
                })
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
          console.log('userArr', this.userArr);
        } catch (error) {}
      },
      async getAddress() {
        try {
          this.data = await this.$api.curd({
            model: 'address',
            curdType: 'find'
          })
          if (this.data.length === 0) {
            this.data = [{
              default: false,
              contactName: '',
              area: [],
              name: '',
              contactMobile: ''
            }]
          }
        } catch (error) {}
      },
      async getAccount() {
        try {
          this.accountArr = await this.$api.curd({
            model: 'account',
            curdType: 'find',
            user: this.$route.params._id
          })
        } catch (error) {}
      },
      async getData() {
        try {
          this.startObj = await this.$api.curd({
            model: 'user',
            curdType: 'findOne',
            _id: this.$route.params._id,
            populate: [{
              path: 'area'
            }, {
              path: 'recommendedByUser'
            }]
          })
          console.log('this.startObj.area', this.startObj);
          this.startObj.area.forEach(item => {
            let obj = {
              value: []
            }
            obj.value.push(item.province);
            obj.value.push(item.city);
            obj.value.push(item.county);
            obj.value.push(item._id);
            this.startAreaArr.push(obj)
          });
          console.log('this.startAreaArr', this.startAreaArr);
          console.log('startObj', this.startObj);
        } catch (error) {}
      }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getData();
      await this.getPlatform();
      await this.getCompany();
      // await this.getUser();
      await this.getAddress();
      for (let index = 0; index < this.startObj.area.length; index++) {
        await this.getArea(this.startObj.area[index])
      }
      this.loadingText = ''
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>