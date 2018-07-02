<template>
  <div style="width:100%;height:calc(70vh - 160px)">
    <el-alert :title="value instanceof Array?'已选用户':'已选用户(只能选一个用户)'" type="info" :closable="false" style="margin:15px 0"></el-alert>
    <div style="padding:0 10px 10px 10px;border:1px solid #dcdfe6;border-radius: 4px;box-sizing: border-box;height:100px;overflow: auto;">
      <el-tag style="margin:10px 5px 0 0;" size="mini" v-for="tag in tagValue" :key="tag.id" closable type="info" @close="close(tag)">
        {{tag.name}}
      </el-tag>
    </div>
    <el-alert title="全部用户" type="info" :closable="false" style="margin:15px 0"></el-alert>
    <div>
      <my-table size="mini" border index height="calc(70vh - 160px - 140px - 100px)" :select.sync="select" selection v-model="loadingText" :thead="thead" :data="data" :loadmore="loadmore">
        <div class="search-box" slot="header">
          <el-input size="mini" placeholder="请输入姓名或手机号" v-model="input">
            <div slot="append" class="pointer" @click="search">搜 索</div>
          </el-input>
        </div>
      </my-table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      loadingText: {
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      tagValue: {
        type: Array,
        default () {
          return []
        }
      },
      thead: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        data: [],
        select: [],
        input: ''
      }
    },
    watch: {
      async dialogVisible(val) {
        if (val) {
          await this.getData()
        }
      },
      select(val) {
        if (this.value) {
          val.forEach(item => {
            this.tagValue.push({
              _id: item._id,
              name: item.name,
            })
          });
          for (let index = 0; index < this.tagValue.length; index++) {
            for (let i = index + 1; i < this.tagValue.length; i++) {
              if (this.tagValue[i]._id === this.tagValue[index]._id) {
                this.tagValue.splice(i, 1)
              }
            }
          }
        } else {
          this.tagValue = []
          this.tagValue.push({
            _id: val[val.length - 1]._id,
            name: val[val.length - 1].name,
          })
          console.log(this.tagValue[0].name, this.tagValue[0]._id);
          this.$emit('update:tagValue', this.tagValue)
        }
      }
    },
    methods: {
      search() {},
      async loadmore() {
        return await this.$ajax.post("/user/find", {
          limit: 1,
          skip: this.data.length,
          $or: [{
              name: {
                $regex: this.input
              }
            },
            {
              mobile: {
                $regex: this.input
              }
            }
          ]
        });
      },
      close(tag) {
        this.tagValue.splice(this.tagValue.indexOf(tag), 1);
      },
      async getData() {
        try {
          this.loadingText = '加载中';
          this.data = await this.$api.curd({
            model: 'user',
            curdType: 'find',
            company: this.$route.params._id,
            limit: 1,
            skip: 0
          })
        } catch (error) {}
        this.loadingText = '';
      }
    },
    async created() {
      await this.getData()
    }
  }
</script>

<style scoped>
  .search-box {
    width: 300px;
    margin-bottom: 15px;
  }
</style>