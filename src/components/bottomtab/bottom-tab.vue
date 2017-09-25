<template>
  <mu-bottom-nav :value="$route.name"
                 shift
                 @change="handleChange"
                 class="bottom-tab"
                 v-if="$route.name=='home'||$route.name=='discover'">

    <mu-bottom-nav-item value="home"
                        title="名片夹"
                        icon="contacts"/>

    <!--<mu-bottom-nav-item value="discover"-->
                        <!--title="我"-->
                        <!--icon="person"/>-->

  </mu-bottom-nav>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'bottomTab',
    data() {
      return {
        bottomNav: 'home'
      }
    },
    computed: {
      ...mapState(['search', 'details'])
    },
    methods: {
      // 点击按钮
      handleChange(val) {
        console.log(this.currPage);
        this.bottomNav = val
        // 路由跳转至当前点击的页面
        this.$router.push(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bottom-tab {
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
  }
</style>
