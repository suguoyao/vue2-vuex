<template>
  <mu-bottom-nav :value="bottomNav"
                 shift
                 @change="handleChange"
                 class="bottom-tab">

    <mu-bottom-nav-item value="home"
                        title="Home"
                        icon="chat_bubble_outline"
                        :iconClass="[ isActive[0]&&'color-b' ]"
                        :titleClass="[ isActive[0]&&'color-b' ]"/>

    <mu-bottom-nav-item value="friends"
                        title="Friends"
                        icon="people"
                        :iconClass="[ isActive[1]&&'color-b' ]"
                        :titleClass="[ isActive[1]&&'color-b' ]"/>

    <mu-bottom-nav-item value="discover"
                        title="Discover"
                        icon="explore"
                        :activeClass="'color-black'"/>

  </mu-bottom-nav>
</template>

<script>
  export default {
    name: 'bottomTab',
    data() {
      return {
        bottomNav: 'home'
      }
    },
    computed: {
      // 关于样式设置完全可以用覆盖的形式，这里只是没事找事罢了
      isActive() {
        let arr = ['home', 'friends', 'discover']
        let x = []
        x[arr.indexOf(this.bottomNav)] = true
        return x
      }
    },
    methods: {
      // 点击按钮
      handleChange(val) {
        this.bottomNav = val
        // 路由跳转至当前点击的页面
        this.$router.push(val)
        // 点击更换页面标题
        this.$store.commit('changeTitle', {title: val})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bottom-tab {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
