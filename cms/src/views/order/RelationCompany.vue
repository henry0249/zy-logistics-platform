<template>
  <div>
    <el-tooltip v-if="tip" effect="dark" content="仅可从本公司关联的公司中选择" placement="top">
      <my-form-item size="mini" v-model="currentCompany" select :options="list" :disabled="$attrs.disabled" :label="$attrs.label" @change="change">
      </my-form-item>
    </el-tooltip>
    <my-form-item v-else size="mini" v-model="currentCompany" select :options="list" :disabled="$attrs.disabled" :label="$attrs.label" @change="change">
    </my-form-item>
  </div>
</template>

<script>
export default {
  props: {
    tip: {
      type: Boolean,
      default: true
    },
    order: {
      type: [Object],
      default() {
        return {};
      }
    },
    data: {
      type: [Number, String, Array, Object],
      default: ""
    },
    append: {
      type: [Object, String],
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      list: [],
      currentCompany: ""
    };
  },
  watch: {
    append(val) {
      console.log(val);
    }
  },
  methods: {
    setlist() {
      if (!(this.order._id && this.order.handle && this.order.handle._id)) {
        return;
      }
      this.list = [];
      let businessRelationCompany = this.order.handle.businessRelationCompany;
      let transportTrainsRelationCompany = this.order.handle
        .transportTrainsRelationCompany;
      let accountRelationCompany = this.order.handle.accountRelationCompany;
      let mySet = new Set();
      if (this.$attrs.business !== undefined) {
        if (
          this.order.goods &&
          this.order.goods._id &&
          this.order.goods.manufacturer &&
          this.order.goods.manufacturer._id
        ) {
          mySet.add(this.order.goods.manufacturer);
        }
        if (
          this.order.goods &&
          this.order.goods._id &&
          this.order.goods.company &&
          this.order.goods.company._id
        ) {
          mySet.add(this.order.goods.company);
        }
        businessRelationCompany.forEach(item => {
          if (!mySet.has(item)) {
            mySet.add(item);
          }
        });
      }
      if (this.$attrs.transport !== undefined) {
        transportTrainsRelationCompany.forEach(item => {
          if (!mySet.has(item)) {
            mySet.add(item);
          }
        });
      }
      if (this.$attrs.account !== undefined) {
        accountRelationCompany.forEach(item => {
          if (!mySet.has(item)) {
            mySet.add(item);
          }
        });
      }
      if (this.append && this.append._id) {
        if (!mySet.has(this.append)) {
          mySet.add(this.append);
        }
      }
      this.list = [...mySet];
    },
    change(val) {
      let currentData = {};
      this.list.forEach(item => {
        if (val === item._id) {
          currentData = item;
        }
      });
      this.$emit("update:data", val);
      this.$emit("change", currentData);
    }
  },
  mounted() {
    if (this.data) {
      if (this.data._id) {
        this.currentCompany = this.data._id;
      } else {
        this.currentCompany = this.data;
      }
    }
    this.setlist();
  }
};
</script>

<style scoped>
</style>