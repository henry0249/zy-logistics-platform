<template>
  <loading-box class="js">
    <template class="jc jb" v-for="(item,index) in data">
      <el-card class="f1" v-bind="$attrs" :key="index">
        <div slot="header">
          <slot name="header">
            <div class="jb">
              <div>              
                <span>{{item.title}}</span>
                <span :class="(index + 1)%2 === 0?'danger':'blue'">{{item.name}}</span>
              </div>
            </div>
          </slot>
        </div>
        <slot>
          <div class="jb">
            <my-form-item size="mini" v-model="item.account" label="账户：" placeholder="请输入银行卡号" @change="accountChange"></my-form-item>
          </div>
          <div class="jb" style="margin-top:15px;">
            <my-form-item size="mini" label="账户：" v-model="item.account" placeholder="请输入银行卡号"></my-form-item>
          </div>
        </slot>
      </el-card>
      <div class="jc icon-right" v-if="index !== data.length - 1" :key="`icon${index}`">
        <icon>icon-jiantou</icon>
        <icon>icon-jiantou</icon>
      </div>
    </template>
  </loading-box>
</template>

<script>
  // bodyStyle 设置 body 的样式
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {};
    },
    computed: {},
    methods: {
      accountChange(val){
        console.log(val);
        this.getBank(val);
      },
      async getBank(val){
        try {
          this.bank = await this.$ajax.post('/bankcardinfo',{
            cardNo:val
          })
        } catch (error) {
          
        }
      }
    },
    async created() {
      // await this.$ajax.get('/bankcardinfo?cardNo=6212262201023557228')
    }
  };
</script>

<style scoped>
  .icon-right {
    padding: 0 20px;
  }
  span{
    font-size: 12px;
  }
</style>