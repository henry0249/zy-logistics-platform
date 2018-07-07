<template>
  <loading-box class="company-box" v-model="value">
    <my-table index size="mini" edit :thead="thead" :data.sync="data" v-bind="$attrs">
      <template slot="header">
            <slot name="header" v-if="header"></slot>
            <div v-else class="flex company-header-box">
              <div class="search-box">
                <el-input  size="mini" placeholder="请输入内容" v-model="input">
                  <div slot="append" @click="search">搜 索</div>
                </el-input>
              </div>
              <div class="add-box">
                <el-button type="primary" size="mini"  @click="add">添 加</el-button>
              </div>
            </div>
</template>
<template slot-scope="scope">
  <div title="点击查看详情" style="width:100%;height:20px;" :class="scope.row['name']?'pointer name-txt':'pointer name-txt1'" v-if="scope.column.property === 'name'" @click="op(scope)">
      {{scope.row['name']?scope.row['name']:'--'}}
    <i v-if="scope.column.property === 'name'&&!scope.row['name']" class="el-icon-edit pointer name-icon"></i>
  </div>
  <slot v-else :row="scope.row" :column="scope.column" :index="scope.index" name="tem"></slot>
</template>
    </my-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Boolean],
        default: ''
      },
      thead: {
        type: Object,
        default () {
          return {}
        }
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      header: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data() {
      return {
        input: ''
      }
    },
    computed: {
      con() {
        let con = scope.column.property === 'name' || scope.column.property === 'type'
        for (const key in this.thead) {
          if (this.thead.hasOwnProperty(key)) {
            if (this.thead[key].slot) {}
          }
        }
        return
      }
    },
    methods: {
      add() {
        this.$emit('add')
      },
      search() {
        this.$emit('search', this.input);
      },
      op(val) {
        this.$emit('op', val.row._id);
      }
    }
  }
</script>

<style scoped>
  .company-header-box {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    border-bottom: 1px solid #d6d6d6;
    box-sizing: border-box;
  }
  .name-txt {
    color: #42a5f5;
  }
  .name-icon {
    width: 100%;
    height: 100%;
    display: none;
  }
  .name-icon:hover {
    color: #42a5f5;
    /* display: none; */
  }
  .name-txt:hover {
    text-decoration: underline;
  }
  .name-txt1:hover .name-icon{
    display: block;
  }
</style>