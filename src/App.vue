<template>
  <div id="app">
    <!--头部-->
    <!--<div class="container-top">-->
    <!--<top-nav></top-nav>-->
    <!--</div>-->

    <!--内容-->
    <div class="container-content">
      <!--<div class="patch"></div>-->
      <router-view></router-view>
      <div class="patch"></div>
    </div>

    <!--底部tabs-->
    <div class="container-bottom">
      <bottom-tab class="tab"></bottom-tab>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import topNav from './components/topnav/top-nav'
  import bottomTab from './components/bottomtab/bottom-tab'

  export default {
    name: 'app',
    components: {
      topNav,
      bottomTab
    }
  }
</script>

<style lang="scss">
  #app {
    .container-top {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 10%;
      z-index: 101;
    }

    .container-content {
      width: 100%;
      /*background-color: #fff;*/
      .patch {
        position: relative;
        width: 100%;
        height: 10vh;
      }
    }

    .container-bottom {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 1;
      width: 100%;
      /*height: 10%;*/
      overflow: hidden;
      .tab {
        /*background-color: #fff;*/
      }
    }
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
