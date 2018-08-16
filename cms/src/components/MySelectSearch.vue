<template>
<loading-box v-model="loadingText">
  <my-form class="flex ac" size="mini" width="24%">
    <template v-if="type === 'user'">
      <my-form-item label="用户名" v-model="option.user.name.$regex"></my-form-item>
      <my-form-item style="margin-left:15px" label="手机号" v-model="option.user.mobile.$regex"></my-form-item>
    </template>
    <template v-if="type === 'company'">
      <my-form-item select label="公司类型" v-model="option.company.type" :options="field.Company.type.option"></my-form-item>
      <my-form-item style="margin-left:15px" label="公司名称" v-model="option.company.name.$regex"></my-form-item>
      <my-form-item style="margin-left:15px" label="公司简称" v-model="option.company.nick.$regex"></my-form-item>
    </template>
    <template v-if="type === 'area'">
      <my-form-item label="省份" v-model="option.area.province" select :options="provinceArr" filterable :disabled="provinceArr.length===0" @change="provinceChange"></my-form-item>
      <my-form-item style="margin-left:15px" label="城市" v-model="option.area.city" select :options="cityArr" filterable :disabled="cityArr.length===0" @change="cityChange"></my-form-item>
      <my-form-item style="margin-left:15px" label="区县" v-model="option.area.county" select :options="countyArr" filterable :disabled="countyArr.length===0"></my-form-item>
      <my-form-item style="margin-left:15px" label="地址名称" v-model="option.area.name.$regex"></my-form-item>
    </template>
    <template v-if="type === 'goods'">
      <my-form-item label="名称" v-model="option.goods.name.$regex"></my-form-item>
      <my-form-item style="margin-left:15px" label="品牌" v-model="option.goods.brand" select :options="brandArr" filterable :disabled="brandArr.length===0"></my-form-item>
      <my-form-item style="margin-left:15px" label="分类" v-model="option.goods.category" select :options="categoryArr" filterable :disabled="categoryArr.length===0"></my-form-item>
    </template>
    <template v-if="type === 'truck'">
      <my-form-item label="车牌号" v-model="option.truck.no.$regex"></my-form-item>
    </template>
    <template v-if="type === 'ship'">
      <my-form-item label="船号" v-model="option.ship.no.$regex"></my-form-item>
    </template>
  </my-form>
</loading-box>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loadingText: "",
      option: {
        user: {
          name: {
            $regex: ""
          },
          mobile: {
            $regex: ""
          }
        },
        company: {
          name: {
            $regex: ""
          },
          nick: {
            $regex: ""
          },
          type: undefined
        },
        area: {
          name: {
            $regex: ""
          },
          province: "",
          city: "",
          county: ""
        },
        goods: {
          name: {
            $regex: ""
          },
          brand: "",
          category: ""
        },
        truck: {
          no: {
            $regex: ""
          }
        },
        ship: {
          no: {
            $regex: ""
          }
        }
      },
      provinceArr: [],
      cityArr: [],
      countyArr: [],
      categoryArr: [],
      brandArr: [],
      companyArr: []
    };
  },
  watch: {
    option: {
      handler: function(val) {
        let temp = JSON.parse(JSON.stringify(val[this.type]));
        let res = {};
        for (const key in temp) {
          if (temp[key]) {
            res[key] = temp[key];
          }
        }
        this.$emit("update:data", res);
      },
      deep: true
    }
  },
  methods: {
    async getArea(type) {
      if (this.type === "area") {
        this.loadingText = "加载中";
        try {
          let body = {
            type: type,
            limit: 0
          };
          if (type === "city" && this.option.area.province) {
            body.province = this.option.area.province;
          }
          if (type === "county") {
            if (this.option.area.province) {
              body.province = this.option.area.province;
            }
            if (this.option.area.city) {
              body.city = this.option.area.city;
            }
          }
          let res = await this.$ajax.post("/area/find", body);
          if (type === "province") {
            this.provinceArr = res;
          }
          if (type === "city") {
            this.cityArr = res;
          }
          if (type === "county") {
            this.countyArr = res;
          }
        } catch (error) {}
        this.loadingText = "";
      }
    },
    provinceChange(val) {
      this.getArea("city");
    },
    cityChange(val) {
      this.getArea("county");
    },
    async getGoodsData() {
      if (this.type === "goods") {
        this.loadingText = "加载中";
        try {
          this.brandArr = await this.$ajax.post(`/brand/find`, {
            limit: 0,
            sort: {
              createdAt: 1
            }
          });
          this.categoryArr = await this.$ajax.post(`/category/find`, {
            limit: 0,
            sort: {
              createdAt: 1
            }
          });
        } catch (error) {}
        this.loadingText = "";
      }
    }
  },
  mounted() {
    if (this.type === "area") {
      this.getArea("province");
    }
    if (this.type === "goods") {
      this.getGoodsData();
    }
  }
};
</script>

<style scoped>
</style>