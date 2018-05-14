<template>
  <div class="flex tree-li">
    <div class="flex tree-box">
      <p class="tree-title">{{model.data.menuName}}</p>
      <icon size="24" v-if="show" color="#000" @click.native="isFolder=!isFolder">{{isFolder?'icon-54':'icon-jian01'}}</icon>
    </div>
    <div style="maargin:0" v-show="open" v-if='show'>
      <items v-for='item in model.childTreeNode' :model='item' :key="item.id"></items>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'items',
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    components: {},
    data() {
      return {
        open: false,
        isFolder: false
      }
    },
    watch: {
      isFolder(val, oldVal) {
        if (val) {
          this.open = !val
        } else {
          this.open = !val
        }
        console.log(this.open);
      },
    },
    methods: {},
    created() {
      if (this.model.childTreeNode) {
        if (this.model.childTreeNode.length > 0) {
          this.isFolder = true
          this.show = true
        } else {
          this.isFolder = false
          this.show = false
        }
      } else {
        this.isFolder = false
        this.show = false
      }
      // this.isFolder = this.model.childTreeNode.length > 0 || !this.model.childTreeNode
      // this.show = this.model.childTreeNode.length > 0 || !this.model.childTreeNode
    }
  }
</script>
<style scoped>
  .tree-box {
    padding: 8px 5px;
    background: #fff;
    box-shadow: 0px 1px 10px #ccc;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .tree-li {
    margin: 40px 0;
    list-style: none;
    min-width: 32px;
    height: 40px;
  }
  .flex {
    display: inline-flex;
  }
  .col {
    flex-direction: column;
  }
  .row {
    flex-direction: row;
  }
  .tree-title {
    font-size: 16px;
    color: #000;
    margin: 0;
  }
</style>
