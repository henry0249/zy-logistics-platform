<template>
  <common-table stripe path="/company/find" :thead="thead" :option="option">
    <div slot="header" class="jc js">
      <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input placeholder="请输入公司名称或别称" width="240px" v-model="input"></my-form-item>
      <my-form-item width='300px' label="公司类型" @change="typeChange" style="padding-right:10px;" size="mini" multiple collapse-tags placeholder="选择公司类型" v-model="typeData" :options="field.Company.type.option" select></my-form-item>
    </div>
    <template slot-scope="scope">
      <i title="点击查看详情" class="pointer name-txt" v-if="scope.prop === 'name'" @click="see({type:'read',value:scope})">{{scope.row['name']}}</i>
      <div v-if="scope.prop === 'area'">{{areaText(scope.row['area'])}}</div>
    </template>
  </common-table>
</template>

<script>
  export default {
    data() {
      return {
        option: {
          populate: [{
            path: 'area',
            populate: [{
              path: 'province'
            }, {
              path: 'city'
            }, {
              path: 'county'
            }]
          }]
        },
        input: '',
        typeData: [],
        thead: {
          name: {
            name: '公司名称',
            readOnly: true,
            slot: true,
          },
          nick: {
            name: '公司别称',
            readOnly: true
          },
          code: {
            name: '编号',
            readOnly: true
          },
          mobile: {
            name: '手机号码',
            readOnly: true
          },
          tel: {
            name: '固话',
            readOnly: true
          },
          area: {
            name: '区域',
            readOnly: true,
            slot: true
          }
        }
      }
    },
    methods: {
      areaText(val) {
        let str = '';
        if (val) {
          if (val.province) {
            str += val.province.name
          }
          if (val.city) {
            str += val.city.name
          }
          if (val.county) {
            str += val.county.name
          }
          if (val.name) {
            str += val.name
          }
        }
        return str;
      },
      typeChange(val) {
        if (val.length > 0) {
          this.$set(this.option, 'type', {
            $in: val
          })
        }else {
          delete this.option.type
        }
      },
      inputChange(val) {
        if (val) {
          this.$set(this.option, '$or', [{
              name: {
                $regex: val
              }
            },
            {
              nick: {
                $regex: val
              }
            }
          ])
        }else {
          delete this.option.$or
        }
      },
      see(val) {
        this.$router.push({
          path:'/sys/company/edmit/' + val.value.row._id
        })
      }
    }
  }
</script>

<style scoped>
  .goods-box {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>