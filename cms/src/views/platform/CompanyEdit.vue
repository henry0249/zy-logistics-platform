<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <company-edit-item :companyType="type" :ship="ship" :truck="truck" :platformArr="platformArr" :loadingText.sync="loadingText" @sub="sub" :data="data"></company-edit-item>
    </div>
  </loading-box>
</template>

<script>
  import CompanyEditItem from './CompanyEditItem.vue';
  export default {
    components: {
      CompanyEditItem
    },
    data() {
      return {
        loadingText: '',
        data: {},
        platformArr: [],
        userArr: [],
        truck: [],
        ship: [],
        type: false,
      }
    },
    methods: {
      async sub(val) {
        console.log(val);
        try {
          this.loadingText = '更新中';
          let res = await this.$api.curd({
            model: 'company',
            curdType: 'update',
            find: {
              _id: this.$route.params._id
            },
            update: {
              name: val.data.name,
              address: val.data.address,
              admin: val.data.admin,
              area: val.data.area[val.data.area.length - 1],
              documentClerk: val.data.documentClerk,
              financial: val.data.financial,
              mobile: val.data.mobile,
              owner: val.data.owner,
              platform: val.data.platform,
              salesman: val.data.salesman,
              self: val.data.self,
              tel: val.data.tel,
              type: val.data.type,
              nick: val.data.nick,
              code: val.data.code,
            }
          });
          if (res) {
            let io = true;
            for (let index = 0; index < val.truck.length; index++) {
              if (!val.truck[index].name || !val.truck[index].type || !val.truck[index].owner) {} else {
                if (!val.truck[index]._id) {
                  let addTruck = await this.$api.curd({
                    model: 'truck',
                    curdType: 'set',
                    name: val.truck[index].name,
                    type: val.truck[index].type,
                    owner: val.truck[index].owner,
                    no: val.truck[index].no,
                    company: this.$route.params._id
                  })
                  if (!addTruck) {
                    io = false
                  }
                } else {
                  let updateTruck = await this.$api.curd({
                    model: 'truck',
                    curdType: 'update',
                    find: {
                      _id: val.truck[index]._id
                    },
                    update: {
                      no: val.truck[index].no,
                      name: val.truck[index].name,
                      type: val.truck[index].type,
                      owner: val.truck[index].owner,
                      company: this.$route.params._id
                    }
                  })
                  if (!updateTruck) {
                    io = false
                  }
                }
              }
            }
            for (let index = 0; index < val.ship.length; index++) {
              if (!val.ship[index].name || !val.ship[index].type || !val.ship[index].owner) {} else {
                if (!val.ship[index]._id) {
                  let addship = await this.$api.curd({
                    model: 'ship',
                    curdType: 'set',
                    name: val.ship[index].name,
                    type: val.ship[index].type,
                    owner: val.ship[index].owner,
                    no: val.ship[index].no,
                    company: this.$route.params._id
                  })
                  if (!addship) {
                    io = false
                  }
                } else {
                  let updateship = await this.$api.curd({
                    model: 'ship',
                    curdType: 'update',
                    find: {
                      _id: val.ship[index]._id
                    },
                    update: {
                      no: val.ship[index].no,
                      name: val.ship[index].name,
                      type: val.ship[index].type,
                      owner: val.ship[index].owner,
                      company: this.$route.params._id
                    }
                  })
                  if (!updateship) {
                    io = false
                  }
                }
              }
            }
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
          }
        } catch (error) {}
        this.loadingText = ''
      },
      async getShip() {
        try {
          this.ship = await this.$api.curd({
            model: 'ship',
            curdType: 'find',
            company: this.$route.params._id,
            populate: [{
              path: 'owner'
            }]
          })
          if (this.ship.length === 0) {
            this.ship = [{
              no: '',
              name: '',
              type: [],
              owner: [],
              _id: ''
            }]
          }
          console.log('this.ship', this.ship);
        } catch (error) {}
      },
      async getTruck() {
        try {
          this.truck = await this.$api.curd({
            model: 'truck',
            curdType: 'find',
            company: this.$route.params._id,
            populate: [{
              path: 'owner'
            }]
          })
          if (this.truck.length === 0) {
            this.truck = [{
              no: '',
              name: '',
              type: [],
              owner: [],
              _id: '',
            }]
          }
          console.log('this.truck', this.truck);
        } catch (error) {}
      },
      async getData() {
        try {
          let res = await this.$api.curd({
            model: 'company',
            curdType: 'findOne',
            _id: this.$route.params._id,
            populate: [{
              path: 'area'
            }, {
              path: 'owner'
            }, {
              path: 'admin'
            }, {
              path: 'salesman'
            }, {
              path: 'documentClerk'
            }, {
              path: 'financial'
            }]
          })
          this.data = res
          res.type.forEach(item => {
            if (item === 'logistics') {
              this.type = true;
            }
          });
          let arr = []
          for (const key in this.field.Area.type.option) {
            if (this.field.Area.type.option.hasOwnProperty(key)) {
              if (this.data.area.type === key) {
                arr.push(this.data.area._id)
              } else {
                arr.push(this.data.area[key])
              }
            }
          }
          this.data.area = arr
          console.log('this.data', this.data);
        } catch (error) {
          console.log(error);
        }
      },
      async getUser() {
        try {
          this.userArr = await this.$api.curd({
            model: "user",
            curdType: "find",
          });
          console.log(this.userArr);
        } catch (error) {}
      },
      async getPlatform() {
        try {
          this.platformArr = await this.$api.curd({
            model: "platform",
            curdType: "find"
          });
          console.log(this.platformArr);
        } catch (error) {}
      },
    },
    async created() {
      this.loadingText = '加载中'
      await this.getData();
      // await this.getUser();
      await this.getPlatform();
      await this.getTruck();
      await this.getShip();
      this.loadingText = '';
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
</style>