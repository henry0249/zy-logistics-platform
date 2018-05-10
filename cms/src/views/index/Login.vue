<template>
  <div class="g-login col-flex jc" v-bg-img="bgImg">
    <div class="g-login-box elevation-24">
      <div class="flex">
        <div class="box-img">
          <img :src="boxImg" alt="">
          <div style="margin:6px 5px">
            <div style="padding-top:10px;font-size:20px">
              中源物流
            </div>
            <div style="margin:10px 0;width:20px;height:1px;background:#fff">
            </div>
          </div>
          <div style="padding-top:5px">
            <button v-ripple class="my-index-btn">一站式物流平台</button>
          </div>
        </div>
        <div class="col-flex" style="min-width:280px">
          <router-view style="padding:20px 40px;flex:1" ></router-view>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgImg:
        "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-04-25-500600773_banner.jpg",
      boxImg:
        "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-04-25-9619470c930836d7f3a9b9ff8136acb2.png"
    };
  }
};
</script>

<style scoped>
.g-login {
  height: 100vh;
  width: 100vw;
}
.g-login-box {
  background: #fff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.box-img {
  color: #fff;
  padding: 50px 40px;
  background-image: linear-gradient(
    45deg,
    #ff9a9e 0%,
    #fad0c4 99%,
    #fad0c4 100%
  );
}
.box-img img {
  width: 200px;
}
.my-index-btn{
  outline:none;
  border: 1px solid #fff;
  color: #fff;
  background: transparent;
  line-height: 30px;
  border-radius: 30px;
  padding: 0 10px;
  font-size: 15px
}
</style>