<template>
  <div>
    <my-form size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
      <div class="flex form-box">
        <my-form-item class="form-right" input v-model="companyData.name" filterable label="公司名称"></my-form-item>
      </div>
    </My-form>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" @click="$router.go(-1)">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">修 改</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loadingText:{
        type:String,
        default:''
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {};
    },
    computed: {
      companyData() {
        let obj = {
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
          area: ""
        };
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (key === 'platform') {
              console.log('platform----------');
              console.log('key',key);
              console.log('this.data[key]._id',this.data[key]._id);
              obj[key] = this.data[key]._id
              console.log('obj[key]',obj[key]);
            } else {
              obj[key] = this.data[key]
            }
          }
        }
        return obj
      }
    },
    methods: {
      sub() {
        console.log(this.data);
        this.$emit('update:loadingText','')
        this.$emit("sub", this.companyData);
      }
    }
  };
</script>

<style scoped>
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .form-right {
    margin-right: 20px;
  }
</style>