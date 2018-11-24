<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>车船管理</strong>
        </div>
        <Ship v-if="!loadingText" :startData="startShipObj" :isLogistics="true" :data.sync="shipObj"></Ship>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <div>
          <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        </div>
        <el-button size="small" type="primary" @click="sub">修 改</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import Ship from '../sys/company/CompanyShip.vue';
  export default {
    components: {
      Ship
    },
    data() {
      return {
        loadingText: '',
        startShipObj: {},
        shipObj: {},
        shipRemoveObj: {}
      }
    },
    methods: {
      async sub() {
        try {
          this.loadingText = '修改中...';
          for (const key in this.shipObj) {
            let updateArr = [];
            let data = JSON.parse(JSON.stringify(this.data[key]));
            if (this.data[key].length > 0) {
              for (let n = 0; n < this.data[key].length; n++) {
                for (let index = 0; index < this.shipObj[key].length; index++) {
                  if (this.shipObj[key][index]._id === this.data[key][n]._id) {
                    updateArr.push(this.data[key][n]);
                  }
                }
              }
              if (updateArr.length > 0) {
                for (let index = 0; index < updateArr.length; index++) {
                  for (let i = 0; i < this.shipObj[key].length; i++) {
                    if (this.shipObj[key][i]._id === updateArr[index]._id) {
                      let name = 'updateShip';
                      if (key === 'truck') name = 'updateTruck';
                      let res = await this.$api.company[name]({
                        find: {
                          _id: this.shipObj[key][i]._id
                        },
                        update: {
                          name: this.shipObj[key][i].name,
                          no: this.shipObj[key][i].no,
                          owner: this.shipObj[key][i].owner,
                          type: this.shipObj[key][i].type
                        }
                      });
                    }
                  }
                }
                let delArr = [];
                let copyData = JSON.parse(JSON.stringify(this.data[key]));
                copyData.forEach((dataItem, index) => {
                  let delIo = false;
                  updateArr.forEach((upItem, i) => {
                    if (upItem._id === dataItem._id) {
                      delIo = true;
                      return;
                    }
                  });
                  if (delIo) {
                    copyData.splice(index, 1);
                  }
                });
                if (copyData.length > 0) {
                  for (let i = 0; i < copyData.length; i++) {
                    let delShip = await this.$ajax.post(
                      "/" + key + "/delete?_id=" + copyData[i]._id
                    );
                  }
                }
              } else {
                if (this.data[key].length > 0) {
                  for (let index = 0; index < this.data[key].length; index++) {
                    let name = 'deleteTruck';
                    if (key === 'ship') name = 'deleteShip';
                    let res = await this.$api.company[name]({
                      _id: this.data[key][index]._id
                    });
                  }
                }
              }
              for (let index = 0; index < this.shipObj[key].length; index++) {
                if (!this.shipObj[key][index]._id) {
                  let name = 'addTruck';
                  if (key === 'ship') name = 'addShip';
                  let addShip = await this.$api.company[name]({
                    name: this.shipObj[key][index].name,
                    no: this.shipObj[key][index].no,
                    owner: this.shipObj[key][index].owner,
                    type: this.shipObj[key][index].type,
                    company: this.company._id
                  });
                }
              }
            } else {
              if (this.shipObj[key].length > 0) {
                for (let index = 0; index < this.shipObj[key].length; index++) {
                  let name = 'addTruck';
                  if (key === 'ship') name = 'addShip';
                  let res = await this.$api.company[name]({
                    name: this.shipObj[key][index].name,
                    no: this.shipObj[key][index].no,
                    owner: this.shipObj[key][index].owner,
                    type: this.shipObj[key][index].type,
                    company: _id
                  });
                }
              }
            }
          }
        } catch (error) {}
        this.loadingText = '';
        await this.getData();
      },
      async getTruc() {
        let _id = this.sys ? this.$route.params._id : this.company._id;
        let truckData = await this.$api.company.getTruck({
          limit: 0,
          company: _id,
          populate: [{
            path: "owner"
          }]
        });
        if (truckData.length > 0) {
          let data = [];
          truckData.forEach(item => {
            data.push(item._id);
          });
          this.$set(this.startShipObj, "truck", truckData);
        } else {
          this.$set(this.startShipObj, "truck", []);
        }
      },
      async getShip() {
        let _id = this.sys ? this.$route.params._id : this.company._id;
        let shipData = await this.$api.company.getShip({
          limit: 0,
          company: _id,
          populate: [{
            path: "owner"
          }]
        });
        if (shipData.length > 0) {
          let data = [];
          shipData.forEach(item => {
            data.push(item._id);
          });
          this.$set(this.startShipObj, "ship", shipData);
        } else {
          this.$set(this.startShipObj, "ship", []);
        }
      },
      async getData() {
        try {
          this.loadingText = '加载中...';
          await this.getTruc();
          await this.getShip();
        } catch (error) {}
        this.loadingText = '';
      }
    },
    async created() {
      await this.getData();
      this.data = JSON.parse(JSON.stringify(this.startShipObj));
    }
  }
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>