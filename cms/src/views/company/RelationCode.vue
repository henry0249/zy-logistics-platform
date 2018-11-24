<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>关联代码</strong>
        </div>
        <div class="op jc">
          <el-button size="mini" type="primary" plain @click="dialogTableVisible = true">生成关联代码</el-button>
        </div>
        <div>
          <my-table :thead="thead" :data.sync="relationCodeData" op border size="mini" opWidth="60px">
            <div slot="op" slot-scope="scope" class="jc jb">
              <i title="确定" class="el-icon-check pointer success" v-if="!scope.row.io" @click="sub(scope.row,scope.index)"></i>
              <i v-else title="修改" class="el-icon-edit pointer blue" style="margin-right:5px;" @click.stop="modify(scope)"></i>
              <remove-check title="删除" @remove="remove(scope)"></remove-check>
            </div>
            <div slot-scope="scope">
              <input v-if="scope.prop === 'value'" class="pointer link" title="点击复制" @click="copyCode($event,scope.row[scope.prop])" type="text" ref="input" v-model="scope.row[scope.prop]" readonly style="background:none;border:none;width:63px;margin-right:5px;">
              <div v-if="scope.prop === 'type'">
                <my-form-item size="mini" v-if="!scope.row.io" v-model="scope.row[scope.prop]" select :options="field.RelationCode.type.option"></my-form-item>
                <div style="font-size:12px;" v-else>{{field.RelationCode.type.option[scope.row[scope.prop]]}}</div>
              </div>
              <div v-if="scope.prop === 'createdAt'">{{scope.row[scope.prop] | formatTime}}</div>
              <div class="danger" v-if="scope.prop === 'relation'" style="font-size:12px;">{{ scope.row[scope.prop].length || 0 }}</div>
              <div v-if="scope.prop === 'expirationAt'">
                <my-form-item v-if="!scope.row.io" size="mini" datetime v-model="scope.row[scope.prop]"></my-form-item>
                <div style="font-size:12px;" v-else>{{scope.row[scope.prop] | formatTime}}</div>
              </div>
            </div>
          </my-table>
        </div>
      </div>
      <el-dialog title="生成关联代码" :visible.sync="dialogTableVisible">
        <div class="jc jb">
          <my-form-item width="48%" label="关联类型" size="mini" v-model="setDate.type" select :options="field.RelationCode.type.option"></my-form-item>
          <my-form-item width="48%" label="有效期至" size="mini" datetime v-model="setDate.expiration"></my-form-item>
        </div>
        <div style="width:100%;margin-top:20px;" class="jc">
          <i class="el-icon-info" style="color:#C0C4CC"> {{tipText}}</i>
        </div>
        <div slot="footer" class="dialog-footer jb">
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="setCode">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </loading-box>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: "",
        relationCodeData: [],
        dialogTableVisible: false,
        modifyData: {},
        setDate: {
          type: "common",
          expiration: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        thead: {
          value: {
            name: "代码值",
            slot: true,
            readOnly: true
          },
          type: {
            name: "关联类型",
            slot: true,
            readOnly: true
          },
          createdAt: {
            name: "创建时间",
            slot: true,
            readOnly: true
          },
          relation: {
            name: "使用公司数量",
            slot: true,
            readOnly: true
          },
          expirationAt: {
            name: "有效期至",
            slot: true,
            readOnly: true
          }
        }
      };
    },
    watch: {
      relationCodeData: {
        handler(val) {},
        deep: true
      }
    },
    computed: {
      tipText() {
        let data = {
          common: "可用于全部关联",
          business: "只可用于贸易链关联",
          transport: "只可用于物流链关联",
          account: "只可用于账户链关联"
        };
        return data[this.setDate.type];
      }
    },
    methods: {
      modify(val) {
        let data = val.row;
        this.relationCodeData = JSON.parse(JSON.stringify(this.initData));
        this.relationCodeData.splice(val.index, 1, data);
        this.$set(this.relationCodeData[val.index], "io", false);
        this.relationCodeData.forEach((item, index) => {
          this.$set(
            this.relationCodeData[index],
            "expirationAt",
            new Date(item.expirationAt)
          );
        });
        this.modifyData = this.relationCodeData[val.index];
      },
      async remove(val) {
        try {
          this.loadingText = "删除中...";
          let del = await this.$api.company.deleteRelationCode({
            _id: val.row._id
          });
        } catch (error) {}
        this.loadingText = "";
        await this.getRelationCode();
      },
      copyCode(event, val) {
        event.target.select();
        document.execCommand("Copy");
        this.$message.success("复制成功！");
      },
      proving(row) {
        let proving = true;
        if (!row.type) {
          this.$message.warn("类型不能为空！");
          return (proving = false);
        } else if (!row.expirationAt) {
          this.$message.warn("有效期至能为空！");
          return (proving = false);
        } else if (
          new Date(row.expirationAt).getTime() -
          new Date(row.createdAt).getTime() <
          0
        ) {
          this.$message.warn("有效期至不能小于创建时间");
          return (proving = false);
        }
        return proving;
      },
      async sub(row, index) {
        if (this.proving(row)) {
          if (
            this.initData[index].type !== row.type ||
            new Date(this.initData[index].expirationAt).getTime() !==
            new Date(row.expirationAt).getTime()
          ) {
            try {
              this.loadingText = "修改中...";
              let update = {
                type: row.type
              };
              this.$set(
                update,
                "expiration",
                new Date(row.expirationAt).getTime() -
                new Date(row.createdAt).getTime()
              );
              await this.$api.company.updateRelationCode({
                find: {
                  _id: row._id
                },
                update
              });
            } catch (error) {}
            this.loadingText = "";
            await this.getRelationCode();
          } else {
            this.$set(this.relationCodeData[index], "io", true);
          }
        }
      },
      async getRelationCode() {
        try {
          this.loadingText = "加载中...";
          let res = await this.$api.company.getRelationCode({
            company: this.company._id
          });
          let data = [];
          res.forEach(item => {
            let obj = item;
            this.$set(
              obj,
              "expirationAt",
              new Date(new Date(obj.createdAt).getTime() + obj.expiration)
            );
            this.$set(obj, "io", true);
            data.push(obj);
          });
          this.relationCodeData = data;
          this.initData = JSON.parse(JSON.stringify(data));
        } catch (error) {}
        this.loadingText = "";
      },
      async setCode() {
        try {
          this.dialogTableVisible = false;
          this.loadingText = "添加中...";
          let res = await this.$api.company.addRelationCode({
            company: this.company._id,
            type: this.setDate.type,
            expiration: new Date(
              new Date(this.setDate.expirationAt).getTime() - new Date().getTime()
            )
          });
        } catch (error) {}
        this.loadingText = "";
        await this.getRelationCode();
      }
    },
    async created() {
      await this.getRelationCode();
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 0 1% 1% 1%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
    position: relative;
  }
  .op {
    position: absolute;
    top: 31px;
    height: 33px;
    right: 31px;
  }
  .titleText {
    width: 60px;
    font-size: 12px;
  }
</style>