<template>
  <div class="flex add-warp" v-loading="loading">
    <div class="flex add-header">
      <span>添加商品</span>
    </div>
    <div class="add-content">
      <div class="add-list-box">
        <div class="flex add-list">
          <div class="flex list-box" v-for="item in keyArr1" :key="item.id">
            <span class="flex add-span">{{item.keyValue}}</span>
            <el-input v-model="item.value" :placeholder="`请输入${item.keyValue}`" style="flex:1;margin-right:20px"></el-input>
          </div>
        </div>
        <div class="flex add-list">
          <div class="flex list-box" v-for="item in keyArr2" :key="item.id">
            <span class="flex add-span">{{item.keyValue}}</span>
            <el-select v-model="item.value" :placeholder="'请选择'+item.keyValue" style="flex:1;margin-right:20px">
              <el-option v-for="v in item.options" :key="v.id" :label="v.label" :value="v.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex add-list">
          <div class="flex list-box" v-for="item in keyArr3" :key="item.id">
            <span class="flex add-span">{{item.keyValue}}</span>
            <el-switch @change="switchChange" v-model="item.value" :active-text="item.options[0]" :inactive-text="item.options[1]">>
            </el-switch>
          </div>
        </div>
        <div class="flex add-list" style="margin-bottom:10px;">
          <div class="flex list-box" v-for="item in keyArr4" :key="item.id" style="width:calc(50% - 10px)">
            <span class="flex add-span">{{item.keyValue}}</span>
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-if="item.type == 'textarea'" v-model="item.value" :placeholder="'请输入'+item.keyValue" style="flex:1;margin-right:20px"></el-input>
            <div class="flex arr-box" v-else-if="item.type == 'Arr'" style="flex:1">
              <el-tag style="margin:5px 0 0 5px" :key="tag" v-for="tag in item.options" closable :disable-transitions="false" @close="handleClose(item.options,tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(item.options)" @blur="handleInputConfirm(item.options)">
              </el-input>
              <el-button v-else class="button-new-tag" style="margin:5px 0 0 5px" size="small" @click="showInput">添加新标签</el-button>
            </div>
          </div>
        </div>
      </div>
      <my-table index size="mini" edit :thead="tableTeader" :data.sync="tableList">
        <template slot-scope="scope" v-if="scope.column.property === 'address'">
                <el-cascader size="mini" placeholder="试试搜索：指南" :options="cityData" filterable v-model="scope.row[scope.column.property]" change-on-select></el-cascader>
</template>
      </my-table>
    </div>
    <div class="add-footer">
      <el-button size="mini" @click="$router.go(0)">取 消</el-button>
      <el-button size="mini" type="success" @click="sub">提 交</el-button>
    </div>
  </div>
</template>

<script>
  import cityData from "../common/cityData.js";
  import {
    keyArr1,
    keyArr2,
    keyArr3,
    keyArr4,
    tableTeader
  } from "./add.js";
  export default {
    data() {
      return {
        loading: false,
        inputVisible: false,
        inputValue: "",
        keyArr4,
        keyArr3,
        keyArr2,
        keyArr1,
        cityData,
        tableTeader: {
          address: {
            name: "地区",
            options: [],
            readOnly: true
          },
          factory: {
            name: "出厂价"
          },
          sell: {
            name: "销售价"
          },
          transport: {
            name: "运输价"
          }
        },
        tableList: [{
          address: [],
          factory: "2",
          sell: "3",
          transport: "4"
        }]
      };
    },
    computed: {
      length() {
        return this.price.length;
      }
    },
    methods: {
      delAdr(i) {
        console.log(i);
        if (this.price.length > 1) {
          this.price.splice(i, 1);
        } else {
          this.$alert(`至少有一个地区`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              return;
            }
          });
        }
      },
      addAdr() {
        let obj = {
          address: {
            key: "address",
            keyValue: "地区",
            type: "select",
            value: null,
            options: cityData
          },
          factory: {
            key: "factory",
            keyValue: "出厂价",
            type: "input",
            value: null
          },
          sell: {
            key: "sell",
            keyValue: "销售价",
            type: "input",
            value: null
          },
          transport: {
            key: "transport",
            keyValue: "运输价",
            type: "input",
            value: null
          }
        };
        this.price.push(obj);
      },
      sub() {
        console.log(this.keyArr3);
        let obj = {};
        this.keyArr1.forEach(item => {
          if (item.value) {
            obj[item.key] = item.value;
          }
        });
        this.keyArr2.forEach(item => {
          if (item.value) {
            obj[item.key] = item.value;
          }
        });
        this.keyArr3.forEach(item => {
          if (item.value) {
            obj[item.key] = item.value;
          }
        });
        this.keyArr4.forEach(item => {
          if (item.value) {
            obj[item.key] = item.value;
          }
        });
      },
      switchChange(val) {
        console.log(val);
      },
      handleInputConfirm(options) {
        let inputValue = this.inputValue;
        if (inputValue) {
          options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
        console.log(options);
      },
      handleClose(options, tag) {
        options.splice(options.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      changeKeyData() {
        let i = 0;
        if (Object.keys(this.company).length <= 0) {
          for (let index = 0; index < this.keyArr2.length; index++) {
            if (this.keyArr2[index].key === "company.name") {
              i = index;
            }
          }
        } else if (Object.keys(this.platform).length <= 0) {
          for (let index = 0; index < this.keyArr2.length; index++) {
            if (this.keyArr2[index].key === "platform.name") {
              i = index;
            }
          }
        }
        this.keyArr2.splice(i, 1);
      },
      async getData() {
        this.loading = true;
        for (let index = 0; index < this.keyArr2.length; index++) {
          if (this.keyArr2[index].key === "platform.name") {
            let platform = this.platform;
            platform.label = this.platform.name;
            platform.value = this.platform._id;
            this.keyArr2[index].options.push(platform);
          } else if (this.keyArr2[index].key === "company.name") {
            let company = this.company;
            company.label = this.company.name;
            company.value = this.company._id;
            this.keyArr2[index].options.push(company);
          } else if (this.keyArr2[index].key == "mfrs.name") {
            try {
              let res = await this.$api.curd({
                model: "company",
                curdType: "find",
                type: {
                  $in: ["shipper"]
                }
              });
              res.forEach(resItem => {
                res.label = resItem.name;
                res.value = resItem._id;
                this.keyArr2[index].options.push(res);
              });
            } catch (error) {
              console.log(error);
            }
          } else if (this.keyArr2[index].key == "saleState") {} else {
            let key = this.keyArr2[index].key.split(".");
            try {
              let res = await this.$api.curd({
                model: key[0],
                curdType: "find"
              });
              console.log("ress", res);
              res.forEach(resItem => {
                resItem.label = resItem.name;
                resItem.value = resItem._id;
                this.keyArr2[index].options.push(resItem);
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
        console.log(this.keyArr2);
        this.loading = false;
      }
    },
    async created() {
      this.changeKeyData();
      await this.getData();
    }
  };
</script>

<style scoped>
  .add-warp {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .add-header {
    height: 36px;
    width: calc(100% - 40px);
    border-bottom: 1px solid #ccc;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  .add-content {
    flex: 1;
    /* width: calc(100% - 120px); */
    height: calc(100vh - 51px - 45px - 40px);
    width: calc(100% - 40px);
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .add-list-box {
    width: calc(100% - 120px);
    margin: 0 auto;
  }
  .list-box {
    width: 33.3%;
    min-height: 40px;
    float: left;
    margin: 10px 0;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add-span {
    width: 100px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .add-list {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .arr-box {
    flex: 1;
    height: 96px;
    /* margin-right: 43px; */
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    box-sizing: border-box;
    border: 1px solid #ccc;
    overflow: auto;
    border-radius: 4px;
  }
  .list-box:last-child {
    /* align-self: flex-start; */
  }
  .add-address-box {
    width: 100%;
    height: 200px;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    position: relative;
    /* border-top: 1px solid #ccc; */
  }
  .input-new-tag {
    width: 80px;
    margin: 5px 0 0 5px;
  }
  .icon-box {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
  .add-footer {
    width: calc(100% - 40px);
    height: 40px;
  }
</style>