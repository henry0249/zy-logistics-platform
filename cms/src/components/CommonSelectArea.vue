<template>
  <div class="fex jc js">
    <my-form-item style="padding-right:10px;" @change="proChange" label="选择省" filterable width="33%" size="mini" placeholder="选择省" v-model="province" :options="provinceArr" select></my-form-item>
    <my-form-item style="padding-right:10px;" :disabled="cityDisabled" label="选择市" @change="cityChange" filterable v-loading="cityLoading" width="33%" size="mini" placeholder="选择市" v-model="city" :options="cityArr" select></my-form-item>
    <my-form-item @change="countyChange" :disabled="countyDisabled" label="选择县" v-loading="countyLoading" filterable width="33%" size="mini" placeholder="选择县" v-model="county" :options="countyArr" select></my-form-item>
  </div>
</template>

<script>
export default {
  props: {
    areaData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      province: "",
      provinceArr: [],
      city: "",
      cityArr: [],
      county: "",
      countyArr: [],
      cityDisabled: true,
      countyDisabled: true,
      cityLoading: false,
      countyLoading: false
    };
  },
  watch: {
    province(val) {
      if (val) {
        this.cityDisabled = false;
      }
    },
    city(val) {
      if (val) {
        this.countyDisabled = false;
      }
    }
  },
  methods: {
    countyChange(val) {
      let obj = JSON.parse(JSON.stringify(this.areaData));
      obj.county = val;
      this.$emit("update:areaData", obj);
    },
    async cityChange(val) {
      let obj = JSON.parse(JSON.stringify(this.areaData));
      obj.city = val;
      this.$emit("update:areaData", obj);
      let op = {
        model: "area",
        curdType: "find",
        type: "county",
        city: val
      };
      await this.getCounty(op);
    },
    async proChange(val) {
      let obj = JSON.parse(JSON.stringify(this.areaData));
      obj.province = val;
      this.$emit("update:areaData", obj);
      let op = {
        model: "area",
        curdType: "find",
        type: "city",
        province: val
      };
      await this.getCity(op);
    },
    async getProvince() {
      try {
        this.provinceArr = await this.$api.curd({
          model: "area",
          curdType: "find",
          type: "province"
        });
      } catch (error) {}
    },
    async getCity(op) {
      try {
        this.cityLoading = true;
        this.cityArr = await this.$api.curd(op);
      } catch (error) {}
      this.cityLoading = false;
    },
    async getCounty(op) {
      try {
        this.countyLoading = true;
        this.countyArr = await this.$api.curd(op);
      } catch (error) {}
      this.countyLoading = false;
    }
  },
  async created() {
    await this.getProvince();
  }
};
</script>

<style scoped>
</style>