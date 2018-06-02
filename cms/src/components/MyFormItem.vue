<template>
  <div class="flex ac g-form-item" :style="{width:(width || $parent.width)||'100%'}">
    <slot name="label">
      <div class="tf1" v-if="label" :style="{width:labelWidth || $parent.labelWidth,fontSize:fontSize}">
        {{label}}
      </div>
    </slot>
    <div class="f1">
      <slot>
        <el-select ref="select" style="width:100%" v-if="$attrs.select!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change">
          <el-option v-for="item in json2arr($attrs.options)" :key="item._id||item.value || item.id" :label="item.name || item.label" :value="item._id||item.value">
          </el-option>
        </el-select>
        <el-input style="width:100%" v-if="$attrs.input!==undefined" v-model="value" v-bind="$attrs" :size="size||$parent.size"></el-input>
        <el-input-number style="width:100%" v-if="$attrs.number!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-input-number>
        <el-switch v-if="$attrs.switch!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-switch>
        <el-time-select style="width:100%" v-if="$attrs.time!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-time-select>
        <el-date-picker style="width:100%" v-if="$attrs.date!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size"></el-date-picker>
        <el-date-picker style="width:100%" v-if="$attrs.datetime!==undefined" v-model="data" v-bind="$attrs" :size="size||$parent.size" type="datetime"></el-date-picker>
        <el-color-picker style="width:100%" v-if="$attrs.color!==undefined" v-model="data"></el-color-picker>
        <el-rate v-if="$attrs.rate!==undefined" v-model="data"></el-rate>
        <el-checkbox v-if="$attrs.checkbox!==undefined" v-model="data"></el-checkbox>
        <el-cascader style="width:100%" v-if="$attrs.cascader!==undefined" :options="$attrs.options" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="change"></el-cascader>
        <el-cascader style="width:100%" v-if="area!==undefined" :options="areaData" v-model="data" v-bind="$attrs" :size="size||$parent.size" @change="areaChange"></el-cascader>
      </slot>
    </div>
  </div>
</template>

<script>
import { pca, pcaa } from "area-data";
import streetData from "./street.js";
import MyForm from "./MyForm";
export default {
  extends: MyForm,
  props: ["value", "label", "level", "area"],
  created() {
    let defaultDataOptions = {
      select: "",
      input: "",
      number: 0,
      switch: false,
      time: "",
      date: "",
      datetime: "",
      color: "",
      rate: 0,
      cascader: [],
      area: []
    };
    for (const key in defaultDataOptions) {
      if (this.$attrs.hasOwnProperty(key)) {
        this.data = defaultDataOptions[key];
      }
    }
    if (this.area !== undefined) {
      this.data = [];
    }
  },
  data() {
    return {
      data: "",
      areaData: []
    };
  },
  watch: {
    data(val) {
      this.$emit("input", val);
    },
    level(val) {
      this.setAreaData();
    }
  },
  computed: {
    fontSize() {
      let option = {
        large: "15px",
        medium: "14px",
        small: "13px",
        mini: "12px"
      };
      if (this.labelSize) {
        return this.labelSize;
      } else {
        return option[this.size || this.$parent.size] || "15px";
      }
    }
  },

  methods: {
    change(val) {
      this.$emit("change", val);
    },
    areaChange(val) {
      let res = {};
      let last = 'province';
      if (val[0]) {
        res.province = {
          key: Number(val[0]),
          name: pca["86"][val[0]]
        };
      }
      if (val[1]) {
        res.city = {
          key: Number(val[1]),
          name: pca[val[0]][val[1]]
        };
        last = 'city';
      }
      if (val[2]) {
        res.county = {
          key: Number(val[2]),
          name: pcaa[val[1]][val[2]]
        };
        last = 'county';
      }
      if (val[3]) {
        res.township = {
          key: Number(val[3]),
          name: streetData[val[2]][val[3]]
        };
        last = 'township';
      }
      let areaType = [];
      if (this.is("json", this.area)) {
        val.forEach(item => {
          for (const key in this.field.Area.type.option) {
            if (this.area.hasOwnProperty(key)) {
              this.area[key].forEach(areaItem => {
                if (this.is("json", areaItem) && Number(item) === areaItem.key) {
                  res[key].key = Number(item);
                  res[key]._id = areaItem._id;
                }
                if (!this.is("json", areaItem) && Number(item) === Number(areaItem)) {
                  res[key]._id = areaItem;
                  res[key].key = Number(item);
                }
              });
            }
          }
        });
      }
      res.last = res[last];
      this.$emit("change", res);
    },
    setAreaData() {
      if (this.area !== undefined) {
        let area = this.area;
        this.areaData = [];
        for (const provinceKey in pca["86"]) {
          let city = [];
          if (this.level !== undefined) {
            let level = Number(this.level);
            for (const cityKey in pca[provinceKey]) {
              let district = [];
              for (const districtKey in pcaa[cityKey]) {
                let street = [];
                for (const streetKey in streetData[districtKey]) {
                  if (this.is("json", this.area)) {
                    if (area.township) {
                      let pushStreetFlag = false;
                      area.township.forEach(item => {
                        if (this.is("json", item)) {
                          if (item.key === Number(streetKey)) {
                            pushStreetFlag = true;
                          }
                        }
                        if (item === Number(streetKey)) {
                          pushStreetFlag = true;
                        }
                      });
                      if (pushStreetFlag) {
                        street.push({
                          value: streetKey,
                          label: streetData[districtKey][streetKey]
                        });
                      }
                    }
                  } else {
                    street.push({
                      value: streetKey,
                      label: streetData[districtKey][streetKey]
                    });
                  }
                }
                let streetItem = {
                  value: districtKey,
                  label: pcaa[cityKey][districtKey]
                };
                if (street.length > 0 && level >= 3) {
                  streetItem.children = street;
                }
                if (level >= 2) {
                  if (this.is("json", this.area)) {
                    if (area.county) {
                      let pushDistrictFlag = false;
                      area.county.forEach(item => {
                        if (this.is("json", item)) {
                          if (item.key === Number(districtKey)) {
                            pushDistrictFlag = true;
                          }
                        }
                        if (item === Number(districtKey)) {
                          pushDistrictFlag = true;
                        }
                      });
                      if (pushDistrictFlag) {
                        district.push(streetItem);
                      }
                    }
                  } else {
                    district.push(streetItem);
                  }
                }
              }
              let districtItem = {
                value: cityKey,
                label: pca[provinceKey][cityKey]
              };
              if (district.length > 0) {
                districtItem.children = district;
              }
              if (level >= 1) {
                if (this.is("json", this.area)) {
                  if (area.city) {
                    let pushCityFlag = false;
                    area.city.forEach(item => {
                      if (this.is("json", item)) {
                        if (item.key === Number(cityKey)) {
                          pushCityFlag = true;
                        }
                      }
                      if (item === Number(cityKey)) {
                        pushCityFlag = true;
                      }
                    });
                    if (pushCityFlag) {
                      city.push(districtItem);
                    }
                  }
                } else {
                  city.push(districtItem);
                }
              }
            }
          }
          let cityItem = {
            value: provinceKey,
            label: pca["86"][provinceKey]
          };
          if (city.length > 0) {
            if (this.level !== undefined && Number(this.level) >= 0) {
              cityItem.children = city;
            }
          }
          if (this.is("json", this.area)) {
            if (area.province) {
              let pushProvinceFlag = false;
              area.province.forEach(item => {
                if (this.is("json", item)) {
                  if (item.key === Number(provinceKey)) {
                    pushProvinceFlag = true;
                  }
                }
                if (item === Number(provinceKey)) {
                  pushProvinceFlag = true;
                }
              });
              if (pushProvinceFlag) {
                this.areaData.push(cityItem);
              }
            }
          } else {
            this.areaData.push(cityItem);
          }
        }
      }
    }
  },
  mounted() {
    this.setAreaData();
    this.$nextTick(() => {
      this.data = this.value;
    });
  }
};
</script>

<style scoped>
.g-form-item {
  color: #606266;
}
</style>