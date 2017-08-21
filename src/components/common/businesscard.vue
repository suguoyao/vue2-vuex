<template>
  <div>
    <mu-list-item :title="item.new_name"
                  :describeLine="2"
                  :disableRipple="true"
                  class="list-item"
                  @click.stop="showDetails(item.new_cardid)">
      <mu-avatar :src="''" slot="leftAvatar"/>
      <span slot="describe">
        <span style="color: rgba(0, 0, 0, .87)">{{item.new_comp}}</span>
        </span>

    </mu-list-item>

    <div class="card-menu">
      <mu-icon-menu slot="right" icon="more_vert" tooltip="操作">
        <mu-menu-item title="电话"/>
        <mu-menu-item title="同步联系人"/>
        <mu-menu-item title="分组"/>
        <mu-menu-item title="删除"/>
      </mu-icon-menu>
    </div>

    <mu-divider inset/>
  </div>
</template>

<style lang="scss">
  .list-item {
    width: 100%;
    float: left;
    /*height: 10vh;*/
    transition: all .2s linear;
    background-color: #fff;
    .mu-avatar {
      height: 30px;
      border-radius: 0 !important;
      img {
        border-radius: 0;
      }
    }
  }

  .card-menu {
    position: absolute !important;
    right: 10px !important;
  }
</style>

<script>
  import {mapMutations} from 'vuex'

  export default {
    name: 'businessCard',
    props: {
      item: {
        type: Object,
        default: null
      }
    },
    data() {
      return {}
    },
    methods: {
      ...mapMutations(['getActiveId', 'viewDetail']),
      showDetails(id) {
        this.viewDetail()
        this.getActiveId({activeId: id})
        this.$router.push({path: 'details', query: {id: id}})
      }
    }
  }
</script>
