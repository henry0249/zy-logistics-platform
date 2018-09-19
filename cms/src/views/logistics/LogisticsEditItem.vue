<template>
  <my-form width="24%">
    <div class="jc jb">
      <my-form-item input v-if="type === 'read'" label="单号" size="mini" :disabled="niDisabled" v-model="logisticsData.no"></my-form-item>
      <my-form-item select v-if="type === 'read'" label="状态" size="mini" :disabled="stateDisabled" v-model="logisticsData.state" :options="field.Logistics.state.option"></my-form-item>
      <div style="width:24%">
        <my-select disabled :data.sync="logisticsData.handle" label="处理公司"></my-select>
      </div>
      <div style="width:24%">
        <my-select :type.sync="logisticsData.transportation" :data.sync="logisticsData[logisticsData.transportation]" disabled label="交通工具"></my-select>
      </div>
    </div>
    <div class="jc jb" style="margin:15px 0">
      <my-form-item number label="装货数量" size="mini" :disabled="niDisabled" v-model="logisticsData.loading"></my-form-item>
      <my-form-item number label="些货数量" size="mini" :disabled="niDisabled" v-model="logisticsData.landed"></my-form-item>
      <my-form-item number label="运费单价" size="mini" :disabled="niDisabled" v-model="logisticsData.price"></my-form-item>
      <my-form-item datetime label="出发时间" size="mini" :disabled="niDisabled" v-model="logisticsData.startAt"></my-form-item>
    </div>
    <div class="jc jb" style="margin:15px 0">
      <my-form-item datetime label="配送时间" size="mini" :disabled="niDisabled" v-model="logisticsData.distributionAt"></my-form-item>
      <my-form-item datetime label="送达时间" size="mini" :disabled="niDisabled" v-model="logisticsData.finishAt"></my-form-item>
      <div style="width:24%"></div>
      <div style="width:24%"></div>
    </div>
    <div class="jc jb" style="margin:15px 0">
      <my-form-item width="100%" input label="收货地址" size="mini" :disabled="niDisabled" v-model="logisticsData.areaInfo"></my-form-item>
    </div>
  </my-form>
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
      initialData: {
        type: Object,
        default () {
          return {};
        }
      },
      type: {
        type: String,
        default: 'read'
      }
    },
    data() {
      return {
        logisticsData: {
          no: '',
          state: 4,
          order: {},
          handle: ''
        },
        niDisabled: true,
        stateDisabled: false
      }
    },
    watch: {},
    methods: {
      sub() {
        this.$emit('sub', this.logisticsData);
      }
    },
    created() {
      if (Object.keys(this.initialData).length > 0) {
        this.logisticsData = JSON.parse(JSON.stringify(this.initialData));
        if (this.logisticsData.state === 5) {
          this.stateDisabled = true;
        } else {
          this.stateDisabled = false;
        }
      }
    }
  };
</script>

<style scoped>

</style>