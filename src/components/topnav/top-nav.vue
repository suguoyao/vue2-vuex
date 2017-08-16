<template>
  <div>
    <mu-appbar :zDepth="0">
      <!--左边头像-->
      <mu-avatar slot="left" :src="avatar" :size="35"/>

      <!--标题-->
      <div slot="default" class="title">
        <div class="title-item">
          {{headerTitle}}
        </div>
      </div>


      <!--右边搜索Icon-->
      <mu-icon slot="right" value="search"></mu-icon>

    </mu-appbar>
  </div>
</template>

<style lang="scss" scoped>
  .mu-avatar {
    margin-left: 12px;
  }

  .title {
    padding-right: 12px;
    .title-item {
      margin: 0 auto;
      width: 48%;
      height: 34px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #f4f4f6;
      border-radius: 4px;
      font-weight: 500;
      /*background: #fff;*/
      color: #fff;
    }
  }
</style>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'topNav',
    computed: mapState({
      avatar: state => state.data.self.avatar,
      headerTitle: 'headerTitle'
    })
  }
</script>
