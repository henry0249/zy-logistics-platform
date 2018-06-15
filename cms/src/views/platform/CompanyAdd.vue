<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>添加公司</strong>
        </div>
        <my-form size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item class="form-right" input v-model="companyData.name" filterable label="公司名称">
            </my-form-item>
            <my-form-item class="form-right" input v-model="companyData.mobile" filterable label="手机号">
            </my-form-item>
            <my-form-item class="form-right" input v-model="companyData.tel" filterable label="公司固话">
            </my-form-item>
            <my-form-item @change="change" class="form-right" size="mini" label="公司类型" multiple collapse-tags select v-model="companyData.type" filterable :options="field.Company.type.option"></my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" :change-on-select="true" size="mini" v-model="companyData.area" area placeholder="选择区域" label="所在区域" />
            <my-form-item class="form-right" width="24%" input v-model="companyData.address" filterable label="公司地址">
            </my-form-item>
            <my-form-item class="form-right" select v-model="companyData.platform" label="所属平台" :options="platformArr">
            </my-form-item>
            <my-form-item select v-model="companyData.owner" label="主管理员" :options="userArr">
            </my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;" v-if="userArr.length>0">
            <my-form-item class="form-right" size="mini" label="管理员" multiple collapse-tags select v-model="companyData.admin" filterable :options="userArr"></my-form-item>
            <my-form-item class="form-right" size="mini" label="业务专员" multiple collapse-tags select v-model="companyData.salesman" filterable :options="userArr"></my-form-item>
            <my-form-item class="form-right" size="mini" label="单据文员" multiple collapse-tags select v-model="companyData.documentClerk" filterable :options="userArr"></my-form-item>
            <my-form-item size="mini" label="财务文员" multiple collapse-tags select v-model="companyData.financial" filterable :options="userArr"></my-form-item>
          </div>
          <my-form-item style="margin-top:20px;" switch v-model="companyData.self" filterable label="是否自营" active-text="是" inactive-text="否">
          </my-form-item>
          <div v-if="io" style="margin-top:20px;">车辆列表</div>
          <my-table v-if="io" style="margin-top:20px;" border index size="mini" :thead="tableHeader" edit :data.sync="tableList" op>
            <div slot="op" slot-scope="scope">
              <i v-if="tableList.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'],tableList)">
                <icon size="16px">icon-ec1</icon>
              </i>
              <i v-if="scope['index'] === tableList.length - 1" title="增加一个地区" class="pointer" @click="addAdr(tableList)">
                <icon size="16px">icon-54</icon>
              </i>
            </div>
            <template slot-scope="scope" v-if="scope.column.property === 'owner' || scope.column.property === 'type'">
              <my-form-item size="mini" v-if="scope.column.property === 'type'" multiple collapse-tags select v-model="scope.row[scope.column.property]" filterable :options="field.Truck.type.option"></my-form-item>
              <my-form-item size="mini" v-if="scope.column.property === 'owner'" select v-model="scope.row[scope.column.property]" filterable :options="userArr"></my-form-item>
            </template>
          </my-table>
          <div v-if="io" style="margin-top:20px;">船只列表</div>
          <my-table v-if="io" style="margin-top:20px;" border index size="mini" :thead="shipHeader" edit :data.sync="shipList" op>
            <div slot="op" slot-scope="scope">
              <i v-if="shipList.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'],shipList)">
                <icon size="16px">icon-ec1</icon>
              </i>
              <i v-if="scope['index'] === shipList.length - 1" title="增加一个地区" class="pointer" @click="addAdr(shipList)">
                <icon size="16px">icon-54</icon>
              </i>
            </div>
            <template slot-scope="scope" v-if="scope.column.property === 'owner' || scope.column.property === 'type'">
              <my-form-item size="mini" v-if="scope.column.property === 'type'" multiple collapse-tags select v-model="scope.row[scope.column.property]" filterable :options="field.Ship.type.option"></my-form-item>
              <my-form-item size="mini" v-if="scope.column.property === 'owner'" select v-model="scope.row[scope.column.property]" filterable :options="userArr"></my-form-item>
            </template>
          </my-table>
        </my-form>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">取 消</el-button>
        <el-button size="small" type="primary" @click="add">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        io:false,
        loadingText: "",
        companyData: {
          type: "",
          name: "",
          mobile: "",
          tel: "",
          auth: false,
          // qualification: {},
          self: false,
          platform: "",
          // setting: {},
          // info: {},
          owner: '',
          admin: [],
          salesman: [],
          documentClerk: [],
          financial: [],
          address: "",
          area: []
        },
        platformArr: [],
        userArr: [],
        admin: [],
        tableHeader: {
          no: {
            name: '车牌号'
          },
          name: {
            name: '名称'
          },
          type: {
            name: '类型',
            slot: true,
            readOnly: true,
          },
          owner: {
            name: '司机',
            slot: true,
            readOnly: true,
          }
        },
         shipHeader: {
          no: {
            name: '船号'
          },
          name: {
            name: '名称'
          },
          type: {
            name: '类型',
            slot: true,
            readOnly: true,
          },
          owner: {
            name: '司机',
            slot: true,
            readOnly: true,
          }
        },
        tableList: [{
              no: '',
              name: '',
              type: [],
              owner: [],
              _id:''
        }],
        shipList: [{
              no: '',
              name: '',
              type: [],
              owner: [],
              _id:''
        }],
      };
    },
    methods: {
      change(val){
        console.log(val);
        let io = false
        val.forEach(item => {
          if (item === 'logistics') {
            io = true
          }
        });
        this.io = io
      },
      delAdr(i,arr) {
        if (arr.length > 1) {
          arr.splice(i, 1);
        } else {
          this.$alert(`至少有一个`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              return;
            }
          });
        }
      },
      addAdr(arr) {
        let obj = JSON.parse(JSON.stringify(arr[arr.length - 1]));
        obj._id = ''
        arr.push(obj);
      },
      async add() {
        if (this.companyData.name && this.companyData.platform) {
          try {
            this.loadingText = "添加中";
            let res = await this.$api.curd({
              model: "company",
              curdType: "add",
              type: this.companyData.type,
              name: this.companyData.name,
              mobile: this.companyData.mobile,
              tel: this.companyData.tel,
              self: this.companyData.self,
              platform: this.companyData.platform,
              owner: this.companyData.owner,
              admin: this.companyData.admin,
              salesman: this.companyData.salesman,
              documentClerk: this.companyData.documentClerk,
              financial: this.companyData.financial,
              address: this.companyData.address,
              area: this.companyData.area[this.companyData.area.length - 1]
            });
            console.log(res);
            if (res) {
              let io = true;
              let op1 = this.tableList.length ===1&& !this.tableList[0].name && !this.tableList[0].no && !this.tableList[0].type && !this.tableList[0].owner
              let op2 = this.shipList.length ===1&& !this.shipList[0].name && !this.shipList[0].no && !this.shipList[0].type && !this.shipList[0].owner
              if (op1&& op2) {
              }else{
                for (let index = 0; index < this.tableList.length; index++) {
                  let setTruck = await this.$api.curd({
                    model:'truck',
                    curdType:'set',
                    company:res._id,
                    no:this.tableList[index].no,
                    name:this.tableList[index].name,
                    type:this.tableList[index].type,
                    owner:this.tableList[index].owner,
                  })
                  if (!setTruck) {
                    io = false
                 }
                }
                for (let index = 0; index < this.shipList.length; index++) {
                  let setShip = await this.$api.curd({
                    model:'ship',
                    curdType:'set',
                    company:res._id,
                    no:this.shipList[index].no,
                    name:this.shipList[index].name,
                    type:this.shipList[index].type,
                    owner:this.shipList[index].owner,
                  })
                  if (!setShip) {
                    io = false
                 }
                }
              }
              if (io) {
                this.$confirm("添加成功", "提示", {
                  confirmButtonText: "继续添加",
                  cancelButtonText: "返回列表",
                  type: "success "
                })
                .then(() => {
                  this.companyData = {
                    type: "",
                    name: "",
                    mobile: "",
                    tel: "",
                    auth: false,
                    // qualification: {},
                    self: false,
                    platform: "",
                    // setting: {},
                    // info: {},
                    owner: "",
                    admin: [],
                    salesman: [],
                    documentClerk: [],
                    financial: [],
                    address: "",
                    area: []
                  };
                })
                .catch(() => {
                  this.$router.go(-1);
                });
              }
              
            }
          } catch (error) {
            console.log(error);
          }
          this.loadingText = "";
        }

      },
      async getUser() {
        try {
          this.userArr = await this.$api.curd({
            model: "user",
            curdType: "find"
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
      }
    },
    async created() {
      this.loadingText = "加载中";
      await this.getUser();
      await this.getPlatform();
      this.loadingText = "";
    }
  };
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
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .form-right {
    margin-right: 20px;
  }
  .form-select-box {
    width: 24%;
    flex: 0 0 24%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>