<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <user-item :loadingText.sync="loadingText" sub-txt="确 定" title="添加用户">
        <my-form slot="form" size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
          <div class="flex form-box">
            <my-form-item class="form-right" input v-model="userObj.name" filterable label="用户名称"></my-form-item>
            <my-form-item class="form-right" input v-model="userObj.mobile" filterable label="手机号"></my-form-item>
            <my-form-item class="form-right" input v-model="userObj.type" filterable label="类型"></my-form-item>
            <my-form-item input v-model="userObj.email" filterable label="邮箱"></my-form-item>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" input v-model="userObj.balance" filterable label="账户余额"></my-form-item>
            <my-form-item class="form-right" size="mini" label="平台" multiple collapse-tags select v-model="userObj.platform" filterable :options="platformArr"></my-form-item>
            <my-form-item class="form-right" size="mini" label="公司" multiple collapse-tags select v-model="userObj.company" filterable :options="companyArr"></my-form-item>
            <div class="flex edmit-tag" style="flex:0 0 24%;">
              <i style="width:60px;fontSize:12px;">标签</i>
              <el-tag size="mini" style="margin-right:10px;" :key="tag" v-for="tag in userObj.tag" closable :disable-transitions="false" @close="handleClose(userObj.tag,tag)">
                {{tag}}
              </el-tag>
              <el-input style="width:60px" size="mini" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(userObj.tag)" @blur="handleInputConfirm(userObj.tag)">
              </el-input>
              <el-button size="mini" v-else class="button-new-tag" @click="showInput">添加</el-button>
            </div>
          </div>
          <div class="flex form-box" style="margin-top:20px;">
            <my-form-item class="form-right" size="mini" label="推荐人" select v-model="userObj.recommendedByUser" filterable :options="userArr"></my-form-item>
            <my-form-item class="form-right" size="mini" label="上级" select v-model="userObj.superior" filterable :options="userArr"></my-form-item>
            <my-form-item class="form-right" size="mini" label="父级" select v-model="userObj.parent" filterable :options="userArr"></my-form-item>
            <my-form-item size="mini" label="角色" multiple collapse-tags select v-model="userObj.role" filterable :options="field.User.role.option"></my-form-item>
          </div>
          <div style="margin-top:20px;">地址列表</div>
          <my-table style="margin-top:20px;" border index size="mini" :thead="thead" edit :data.sync="data" op>
            <div slot="op" slot-scope="scope">
              <i v-if="data.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'],data)">
                <icon size="16px">icon-ec1</icon>
              </i>
              <i v-if="scope['index'] === data.length - 1" title="增加一个地区" class="pointer" @click="addAdr(data)">
                <icon size="16px">icon-54</icon>
              </i>
            </div>
            <template slot-scope="scope" v-if="scope.column.property === 'owner' || scope.column.property === 'type'">
              <my-form-item size="mini" v-if="scope.column.property === 'type'" multiple collapse-tags select v-model="scope.row[scope.column.property]" filterable :options="field.Ship.type.option"></my-form-item>
              <my-form-item size="mini" v-if="scope.column.property === 'owner'" select v-model="scope.row[scope.column.property]" filterable :options="userArr"></my-form-item>
            </template>
          </my-table>
        </my-form>
      </user-item>
    </div>
  </loading-box>
</template>

<script>
  import UserItem from './UserItem.vue';
  export default {
    components: {
      UserItem,
    },
    data() {
      return {
        loadingText: '',
        inputVisible: false,
        inputValue: "",
        userData: {},
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
          role:[],
          defaultAddress: '',
          address: [],
        },
        platformArr: [],
        companyArr: [],
        userArr: [],
        address: [],
        data:[{
          default:false,
          contactName:'',
          area:'[]',
          name:'',
          contactMobile:''
        }],
        thead:{
          default:{
            name:'默认地址',
            readOnly:true,
            slot:true,
          },
          contactName:{
            name:'联系人',
          },
          area:{
            name:'区域',
            readOnly:true,
            slot:true,
          },
          name:{
            name:'详细地址',
          },
          contactMobile:{
            name:'联系电话',
          }
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
      handleInputConfirm(options) {
        let inputValue = this.inputValue;
        if (inputValue) {
          options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
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
  .form-right {
    margin-right: 20px;
  }
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .edmit-tag {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>