<template>
  <loading-box v-model="loadingText">
    <div class="flex ac jb">
      <div style="width:33%">
        <div class="flex ac jb">
          <div class="blue">
            <i class="el-icon-menu el-icon--right"></i>当前库存
          </div>
          <div class="info">
            <i class="el-icon-time el-icon--right"></i>更新于<span style="color:#ccc">{{stock.updateAt|formatTime}}</span>
          </div>
        </div>
        <div class="flex ac jb" style="padding:15px 15%">
          <div>
            <el-tooltip effect="dark" content="损耗" placement="top">
              <i class="el-icon-remove-outline danger pointer" style="font-size:18px" @click="add('decrease')"></i>
            </el-tooltip>
          </div>
          <div class="info" :style="{fontSize:stockFontSize}">
            {{stock.new || 0}}
          </div>
          <div>
            <el-tooltip effect="dark" content="增益" placement="top">
              <i class="el-icon-circle-plus-outline success pointer" @click="add('increase')" style="font-size:18px"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="flex ac jb" style="padding:0 1px">
          <div class="line"></div>
          <div class="pointer blue" @click="add('in')">入库</div>
          <div class="line"></div>
          <div class="pointer danger" @click="add('out')">出库</div>
          <div class="line"></div>
          <div class="pointer warning" @click="add('check')">盘点</div>
          <div class="line"></div>
        </div>
      </div>
      <div style="width:66%">
      </div>
    </div>
  </loading-box>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      stock:{}
    };
  },
  watch: {
    company: {
      handler(val) {},
      deep: true
    }
  },
  computed:{
    stockFontSize(){
      let num = stock.new || 0;
      for (let i = 0; i < 5; i++) {
        
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
</style>