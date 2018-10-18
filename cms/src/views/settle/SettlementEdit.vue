<template>
  <loading-box v-model="loadingText">
    <div class="body-padding">
      <div class="flex ac" style="padding:20px 2px">
        <h2>{{company.name}}</h2>
        <div class="f1"></div>
        <div class="warning">账户余额: 387786</div>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="A公司">
          <div class="flex ac jb">
            <span>付款给A公司</span>
            <div style="padding:0 20px">应付: 100000</div>
            <div style="padding:0 20px">预付: 50000</div>
            <div style="padding:0 20px">已付: 20000</div>
            <div class="f1"></div>
            <div style="padding:0 10px">共10条</div>
            <el-button type="text">全选</el-button>
          </div>
          <div style="height:1px;background:#eee;margin:10px 0">
          </div>
          <div style="height:300px;overflow:auto;padding:0 2px" class="hide-scroll">
            <div v-for="o in 10" :key="o" class="flex ac" style="padding:10px 0">
              <el-checkbox>{{'订单 ' + o }}</el-checkbox>
              <div class="f1"></div>
              <div>{{o*10}}</div>
            </div>
          </div>
          <div style="height:1px;background:#eee;margin:20px 0">
          </div>
          <div class="flex jb">
            <div>
              已选: 0
            </div>
            <div>
              合计: 0
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="B公司">
          <div class="flex ac jb">
            <span>付款给B公司</span>
            <div style="padding:0 20px">应付: 100000</div>
            <div style="padding:0 20px">预付: 50000</div>
            <div style="padding:0 20px">已付: 20000</div>
            <div class="f1"></div>
            <div style="padding:0 10px">共10条</div>
            <el-button type="text">全选</el-button>
          </div>
          <div style="height:1px;background:#eee;margin:10px 0">
          </div>
          <div style="height:300px;overflow:auto;padding:0 2px" class="hide-scroll">
            <div v-for="o in 10" :key="o" class="flex ac" style="padding:10px 0">
              <el-checkbox>{{'订单 ' + o }}</el-checkbox>
              <div class="f1"></div>
              <div class="flex ac jb info">
                <div >
                  使用金额:
                </div>
                <div class="flex ac" style="padding:0 20px">
                  <el-checkbox>结算款</el-checkbox>
                </div>
                <div style="padding:0 20px">
                  <el-checkbox>预付款</el-checkbox>
                </div>
              </div>
              <div class="tr" style="width:70px">{{o*10}}</div>
            </div>
          </div>
          <div style="height:1px;background:#eee;margin:20px 0">
          </div>
          <div class="flex jb">
            <div>
              已选: 0
            </div>
            <div>
              合计: 0
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </loading-box>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      businessTrains: []
    };
  },
  methods: {
    getAccountList() {
      this.loadingText = "加载中";
      try {
        this.businessTrains = [];
        this.businessTrains = this.$ajax.post("/businessTrains/find", {
          company: this.company._id,
          populate: [
            {
              path: "receivedCompany"
            }
          ]
        });
      } catch (error) {}
      this.loadingText = "";
    }
  },
  mounted() {
    this.getAccountList();
  }
};
</script>

<style scoped>
</style>