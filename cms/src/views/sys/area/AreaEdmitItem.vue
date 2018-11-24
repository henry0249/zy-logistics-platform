<template>
  <div class="g-order-create">
    <div class="g-order">
      <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
        <strong>{{type === 'add'?'添加地区':'地区详情'}}</strong>
      </div>
      <common-alert style="margin:15px 0">地区信息</common-alert>
      <my-form size="mini" width="24%" style="margin:15px 0">
        <div class="flex jb">
          <my-form-item input v-model="startData.key" filterable label="行政编码"></my-form-item>
          <my-form-item multiple collapse-tags select v-model="startData.province" label="省" :options="provinceArr"></my-form-item>
          <my-form-item multiple collapse-tags select v-model="startData.city" label="市" :options="cityArr"></my-form-item>
          <my-form-item multiple collapse-tags select v-model="startData.county" label="县" :options="countyArr"></my-form-item>
        </div>
        <div class="flex jb" style="margin-top:15px;">
        </div>
      </my-form>
    </div>
    <div class="tr" style="margin-top:30px">
      <el-button size="small" @click="$router.go(-1)">返 回</el-button>
      <el-button size="small" type="primary" @click="sub">{{type === 'add'?'添加':'修改'}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: "edit"
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      startData: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        areaData: {
          key: "",
          province: "",
          city: "",
          county: "",
          name: ""
        },
        provinceArr: [],
        cityArr: [],
        countyArr: [],
      };
    },
    methods: {
      sub() {
        this.$emit("sub", this.areaData);
      },
      async getAreaByType(type) {
        return await this.$api.sys.getArea({
          type,
          populate: [{
              path: "province"
            },
            {
              path: "city"
            },
            {
              path: "county"
            }
          ]
        });
      }
    },
    async created() {
      try {
        this.provinceArr = await this.getAreaByType('province');
        this.cityArr = await this.getAreaByType('city');
        this.countyArr = await this.getAreaByType('county');
      } catch (error) {}
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
</style>