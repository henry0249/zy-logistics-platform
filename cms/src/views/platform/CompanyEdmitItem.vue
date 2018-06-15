<template>
  <div>
    <div class="g-order">
      <div v-if="!loadingText" class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>公司详情</strong>
      </div>
      <my-form size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
        <div class="flex form-box">
          <my-form-item class="form-right" input v-model="companyData.name" filterable label="公司名称">
          </my-form-item>
          <my-form-item class="form-right" input v-model="companyData.mobile" filterable label="手机号">
          </my-form-item>
          <my-form-item class="form-right" input v-model="companyData.tel" filterable label="公司固话">
          </my-form-item>
          <div class="flex form-select-box">
            <div style="width: 60px; font-size: 12px;">公司类型</div>
            <el-select style="flex:1;" size="mini" filterable collapse-tags v-model="companyData.type" multiple placeholder="请选择">
              <el-option v-for="(value, key) in field.Company.type.option" :key="key" :label="value" :value="key">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex form-box" style="margin-top:20px;" v-if="platformArr.length>0">
          <my-form-item class="form-right" filterable :change-on-select="true" v-model="companyData.area" area placeholder="选择区域" label="公司地址"></my-form-item>
          <my-form-item class="form-right" input v-model="companyData.address" filterable label="详细地址">
          </my-form-item>
          <my-form-item class="form-right" filterable select v-model="companyData.platform" label="所属平台" :options="platformArr">
          </my-form-item>
          <my-form-item select v-model="companyData.owner" filterable label="主管理员" :options="userArr">
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
        <div v-if="companyType" style="margin-top:20px;">车辆列表</div>
        <my-table v-if="companyType" style="margin-top:20px;" border index size="mini" :thead="tableHeader" edit :data.sync="tableList" op>
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
        <div v-if="companyType" style="margin-top:20px;">船只列表</div>
        <my-table v-if="companyType" style="margin-top:20px;" border index size="mini" :thead="shipHeader" edit :data.sync="shipList" op>
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
      <el-button size="small" @click="back()">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">修 改</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loadingText: {
        type: String,
        default: ''
      },
      truck: {
        type: Array,
        default () {
          return []
        }
      },
      ship: {
        type: Array,
        default () {
          return []
        }
      },
      companyType: {
        type: Boolean,
        default:false
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      platformArr: {
        type: Array,
        default () {
          return [];
        }
      },
      userArr: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        companyData: {
          name: "",
          type: 0,
          mobile: "",
          tel: "",
          self: false,
          platform: "",
          owner: "",
          admin: [],
          salesman: [],
          documentClerk: [],
          financial: [],
          address: "",
          area: []
        },
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
        tableList: [],
        shipList: []
      };
    },
    watch: {
      loadingText(val, old) {
        if (val === '') {
          console.log('valdata', this.data);
          for (const key in this.companyData) {
            if (this.companyData.hasOwnProperty(key)) {
              this.companyData[key] = this.data[key]
            }
          }
          this.tableList = JSON.parse(JSON.stringify(this.truck));
          console.log('this.ship',this.ship);
          this.shipList = JSON.parse(JSON.stringify(this.ship));
        }
      }
    },
    methods: {
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
      sub() {
        this.$emit('update:loadingText', '');
        let io = true
        this.tableList.forEach(item => {
          if (!item.no||!item.name||!item.type||!item.owner) {
            io = false
          }
        });
         this.shipList.forEach(item => {
          if (!item.no||!item.name||!item.type||!item.owner) {
            io = false
          }
        });
        if (io) {
          this.$emit("sub", {
            data: this.companyData,
            truck: this.tableList,
            ship:this.shipList
          });
        }else{
          this.$alert('车或船的名称、牌号、类型、司机不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        }

      }
    },
    mounted() {
      for (const key in this.companyData) {
        if (this.companyData.hasOwnProperty(key)) {
          this.companyData[key] = this.data[key]
        }
      }
      this.tableList = JSON.parse(JSON.stringify(this.truck));
      this.shipList = JSON.parse(JSON.stringify(this.ship));
    }
  };
</script>

<style scoped>
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
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .form-select-box {
    width: 24%;
    flex: 0 0 24%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>