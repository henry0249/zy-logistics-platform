<template>
  <div>
    <common-table v-if="show" :thead="thead" path="/stock/find" :option="op">
      <div slot="header" class="jc js">
        <my-form-item size="mini" style="padding-right:10px;" @change="inputChange" input label="库存单名称" placeholder="请输入库存单名称" width="25%" v-model="input"></my-form-item>
        <div style="width:25%">
          <my-select :disabled="disabled" label="选择公司" :data.sync="companyData" placeholder="选择公司" company></my-select>
        </div>
      </div>
      <template slot-scope="scope">
        <div title="点击查看详情" v-if="scope.prop === 'name'" class="pointer name-txt" @click="see(scope)">{{scope.row['name']}}</div>
        <div v-if="scope.prop === 'type'">{{field.Stock.type.option[scope.row.type]}}</div>
      </template>
  </common-table>
</div>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        show: true,
        disabled: false,
        input: '',
        companyData: {},
        op: {},
      }
    },
    computed: {
      thead() {
        if (this.sys) {
          return {
            name: {
              name: '库存单名称',
              readOnly: true,
              slot: true,
            },
            type: {
              name: '库存变化类型',
              readOnly: true,
              slot: true,
            },
            num: {
              name: '数量',
              readOnly: true,
            },
            'company.name': {
              name: '所属公司',
              readOnly: true,
            }
          }
        } else {
          return {
            name: {
              name: '库存单名称',
              readOnly: true,
              slot: true,
            },
            type: {
              name: '库存变化类型',
              readOnly: true,
              slot: true,
            },
            num: {
              name: '数量',
              readOnly: true,
            }
          }
        }
      }
    },
    watch: {
      company: {
        handler(val) {
          if (!this.sys) {
            this.$set(this.op, 'company', val._id);
            this.show = false;
            this.$nextTick(() => {
              this.show = true;
            })
          }
        },
        deep: true
      },
      companyData: {
        handler(val) {
          this.loadingText = '切换中';
          this.$set(this.op, 'company', val._id);
          this.loadingText = '';
        },
        deep: true
      }
    },
    methods: {
      inputChange(val) {},
      see(val) {
        this.$router.push({
          path: '/stock/edmit/' + val.row._id
        })
      }
    },
    created() {
      if (!this.sys) {
        this.disabled = true;
        this.companyData = this.company;
        this.$set(this.op, 'company', this.company._id);
      }
    }
  }
</script>

<style scoped>
  .name-txt {
    color: #42a5f5;
  }
  .name-txt:hover {
    text-decoration: underline;
  }
</style>