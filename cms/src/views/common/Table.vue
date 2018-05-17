<template>
  <div :style="boxStyle">
    <el-table :data="tableList" style="width: 100%" :height="heightValue">
      <el-table-column v-for="(item,index) in tableHeader" :key="index" :prop="item.key" :label="item.keyValue" :width="item.width>0?item.width:''">
        <div slot-scope="scope">
          <el-tag v-if="item.type == 'Arr'" type="success" disable-transitions v-for="(v,i) in scope.row.tag" :key="i" style="margin-right:3px;">{{v}}</el-tag>
          <div v-if="!item.type">{{scope.row[item.key]}}</div>
        </div>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <div slot-scope="scope">
          <slot :scope="scope.row"></slot>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      tableHeader: {
        type: Array,
        default () {
          return []
        }
      },
      tableList: {
        type: Array,
        default () {
          return []
        }
      },
      boxStyle: {
        type: [Object, String],
        default () {
          return {}
        }
      },
      heightValue: {
        type: [Object, String],
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        num: 0,
        io: false,
      }
    },
    mounted() {
      let tabel = document.getElementsByClassName('el-table__body-wrapper')[0]
      tabel.addEventListener('scroll', (e) => {
        let scrollHeight = tabel.scrollHeight
        let clientHeight = tabel.clientHeight
        let scrollTop = tabel.scrollTop
        if (scrollHeight == clientHeight + scrollTop) {
          if (this.io == false) {
            this.num++
          }
          this.io = true
          this.$emit('scrollMore', this.num)
          this.io = false
        }
      })
    }
  }
</script>

<style scoped>

</style>