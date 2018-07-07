<template>
  <div style="width:100%;height:530px;overflow: hidden;">
    <h2 style=" text-align: center">{{label}}</h2>
    <el-alert :title="io?'已选用户':'已选用户(只能选一个用户)'" type="info" :closable="false" style="margin:15px 0"></el-alert>
    <div style="padding:0 10px 10px 10px;border:1px solid #dcdfe6;border-radius: 4px;box-sizing: border-box;height:100px;overflow: auto;">
      <el-tag style="margin:10px 5px 0 0;" size="mini" v-if="tags.length > 0" v-for="tag in tags" :key="tag.id" closable type="info" @close="close(tag)">
        {{tag.name?tag.name:tag.mobile}}
      </el-tag>
    </div>
    <el-alert title="全部用户" type="info" :closable="false" style="margin:15px 0"></el-alert>
    <div v-if="!loadingText">
      <my-table size="mini" border index height="250px" :select.sync="select" selection v-model="loadingText" :thead="thead" :data="data" :loadmore="loadmore">
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
      op: {
        type: Object,
        default () {
          return {}
        }
      },
      io: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      thead: {
        type: Object,
        default () {
          return {}
        }
      },
      newsValue: {
        type: Array,
        default () {
          return []
        }
      },
      startValue: {
        type: Array,
        default () {
          return []
        }
      },
      admin: {
        type: [String, Object, Array],
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        data: [],
        tags: [],
        select: [],
        input: '',
        loadingText: ''
      }
    },
    watch: {
      async input(val) {
        if (val === '') {
          await this.getData()
        }
      },
      tags(val) {
        this.$emit('update:startValue', val);
      },
      async dialogVisible(val) {
        console.log('val', val);
        if (val) {
          await this.getData()
        }
      },
      select(val) {
        if (val.length === 0) {} else {
          if (this.io) {
            val.forEach(item => {
              this.tags.push({
                _id: item._id,
                mobile: item.mobile,
                name: item.name,
              })
            });
            for (let index = 0; index < this.tags.length; index++) {
              for (let i = index + 1; i < this.tags.length; i++) {
                if (this.tags[i]._id === this.tags[index]._id) {
                  this.tags.splice(i, 1)
                }
              }
            }
          } else {
            this.tags.length = 0;
            this.tags.push({
              _id: val[val.length - 1]._id,
              mobile: val[val.length - 1].mobile,
              name: val[val.length - 1].name,
            })
          }
        }
      }
    },
    methods: {
      close(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      async loadmore() {
        let op = {};
        if (Object.keys(this.op).length > 0) {
          for (const key in this.op) {
            op[key] = this.op[key]
          }
        }
        op.skip = this.data.length;
        op.limit = 10;
        op.$or = [{
            name: {
              $regex: this.input
            }
          },
          {
            mobile: {
              $regex: this.input
            }
          }
        ];
        return await this.$ajax.post("/user/find", op);
      },
      async search() {
        try {
          this.loadingText = '加载中';
          let op = {};
          if (Object.keys(this.op).length > 0) {
            for (const key in this.op) {
              op[key] = this.op[key]
            }
          }
          op.$or = [{
              name: {
                $regex: this.input
              }
            },
            {
              mobile: {
                $regex: this.input
              }
            }
          ];
          op.model = 'user';
          op.curdType = 'find';
          op.limit = 10;
          op.skip = 0;
          this.data = await this.$api.curd(op)
        } catch (error) {}
        this.loadingText = '';
      },
      async getData() {
        try {
          this.loadingText = '加载中';
          let op = {};
          if (Object.keys(this.op).length > 0) {
            for (const key in this.op) {
              op[key] = this.op[key]
            }
          }
          op.model = 'user';
          op.curdType = 'find';
          op.limit = 10;
          op.skip = 0;
          this.data = await this.$api.curd(op)
        } catch (error) {}
        this.loadingText = '';
      }
    },
    async created() {
      this.tags = JSON.parse(JSON.stringify(this.newsValue));
      await this.getData();
    }
  }
</script>

<style scoped>
  .search-box {
    width: 300px;
    margin-bottom: 15px;
  }
</style>