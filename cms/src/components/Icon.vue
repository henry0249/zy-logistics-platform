<template>
  <i v-if="!svg" ref="icon" class="iconfont" :class="iconName()" :style="style">
      <slot></slot>
    </i>
  <svg :style="style" ref="svgIcon" v-else class="icon" aria-hidden="true">
      <use :xlink:href="'#'+iconName()"></use>
      <slot></slot>
    </svg>
</template>

<script>
export default {
  props: {
    svg: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    size: {
      type: [String, Number],
      default: ""
    }
  },
  computed: {
    style() {
      let size = this.size;
      if (
        size.indexOf("px") > -1 ||
        size.indexOf("rem") > -1 ||
        size.indexOf("vh") > -1 ||
        size.indexOf("vw") > -1
      ) {
      } else {
        size += "px";
      }
      return {
        color: this.color,
        fontSize: "" + size
      };
    }
  },
  methods: {
    iconName() {
      let val = this.name || this.slotName;
      if (val.indexOf("icon-") > -1) {
        return val;
      }
      return "icon-" + val;
    },
    getSlotName() {
      this.slotName = this.$slots.default[0].text;
      if (!this.svg) {
        this.$refs.icon.innerHTML = "";
      }
    }
  },
  data() {
    return {
      slotName: ""
    };
  },
  mounted() {
    this.getSlotName()
  },
  updated(){
    this.getSlotName()
  }
};
</script>

<style scoped>

</style>