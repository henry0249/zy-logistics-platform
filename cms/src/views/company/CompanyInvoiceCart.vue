<template>
  <loading-box>
    <div class="jc" style="font-size:18px;padding:15px 0">{{newData.type}}</div>
    <div class="jb">
      <my-form-item size="mini" date v-model="newData.openDate" label="开票日期" :picker-options="pickerOptions"></my-form-item>
      <my-form-item size="mini" date v-model="newData.recordDate" label="录单日期" :picker-options="pickerOptions"></my-form-item>
      <my-form-item size="mini" v-model="newData.recordDate" label="单据编号"></my-form-item>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
    },
    data() {
      return {
        newData: {},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        }
      }
    },
    methods: {},
    created() {
      if (Object.keys(this.data).length > 0) {
        let data = JSON.parse(JSON.stringify(this.data));
        let date = new Date();
        this.$set(data, 'recordDate', date);
        this.newData = data;
      }
    }
  }
</script>

<style scoped>
.border{
  border:1px
}
</style>