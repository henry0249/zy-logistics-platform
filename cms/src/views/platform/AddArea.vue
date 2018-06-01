<template>
  <div class="" v-loading="loading">
    <my-form size="mini" width="24%" style="margin:15px 0">
      <div class="flex form-box">
        <my-form-item class="form-right" @change="change" select v-model="area.type" filterable label="精确级别" :options="field.Area.type.option">
        </my-form-item>
        <my-form-item class="form-right" input v-model="area.key" filterable label="编码">
        </my-form-item>
        <my-form-item class="form-right" input v-model="area.name" filterable label="名称">
        </my-form-item>
        <my-form-item class="form-right" @change="change" select v-model="area.type" filterable label="省" :options="field.Area.type.option">
        </my-form-item>
        <my-form-item class="form-right" @change="change" select v-model="area.type" filterable label="市" :options="field.Area.type.option">
        </my-form-item>
        <my-form-item class="form-right" @change="change" select v-model="area.type" filterable label="县" :options="field.Area.type.option">
        </my-form-item>
        <my-form-item class="form-right" @change="change" select v-model="area.type" filterable label="乡" :options="field.Area.type.option">
        </my-form-item>
      </div>
    </my-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        area: {
          type: '',
          name: '',
          key: null,
          // province: {
          //   name: '',
          //   key: null,
          // },
          // city: {
          //   name: '',
          //   key: null,
          // },
          // county: {
          //   name: '',
          //   key: null,
          // },
          // township: {
          //   name: '',
          //   key: null,
          // },
          // stree: {
          //   name: '',
          //   key: null,
          // }
        }
      }
    },
    methods: {
      async change(val) {
        let areaKey = ['province', 'city', 'county', 'township', 'stree']
        let i = 0
        for (let index = 0; index < areaKey.length; index++) {
          if (val === areaKey[index]) {
            i = index
          }
        }
        if (i === 0) {} else {
          this.loading = true
          for (let index = 0; index < i + 1; index++) {
            if (index === i) {} else {
              try {
                let res = await this.$api.curd({
                  model: 'area',
                  curdType: 'find',
                  type: areaKey[index]
                })
                if (res.length === 0) {
                  this.$alert(`请先添加${areaKey[index]}`, '提示', {
                    confirmButtonText: '确定',
                  })
                  this.loading = false
                  return
                }
              } catch (error) {}
            }
          }
          this.loading = false
        }
      },
    }
  }
</script>

<style scoped>
  .form-box {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .form-right {
    margin: 10px 8px 0 0
  }
</style>