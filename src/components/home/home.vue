<template>
  <div class="bc-box">
    <div class="top-bar">
      <mu-appbar :zDepth="0">
        <!--左边头像-->
        <!--<mu-avatar slot="left" :src="avatar" :size="35"/>-->
        <mu-icon slot="left" value="camera_alt" color="skyblue"></mu-icon>

        <!--标题-->
        <div slot="default" class="title">
          <!--<div class="title-item">-->
          <!--{{headerTitle}}-->
          <!--</div>-->
          <mu-dropDown-menu :value="group"
                            @change="handleChange"
                            :autoWidth="true"
                            labelClass="group"
                            underlineClass="group-underline">
            <mu-menu-item value="1" title="全部"/>
            <mu-menu-item value="2" title="最近30天查看"/>
            <mu-menu-item value="3" title="最近新增名片"/>
            <mu-menu-item value="4" title="未分组"/>
            <mu-menu-item value="5" title="客户"/>
            <mu-menu-item value="6" title="合作伙伴"/>
          </mu-dropDown-menu>
        </div>


        <!--右边搜索Icon-->
        <mu-icon slot="right" value="search" @click="goSearch"></mu-icon>

      </mu-appbar>
    </div>

    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh()"/>
    <div style="margin-top: 50%;text-align: center" v-if="isAjax">
      <mu-circular-progress :size="40" :color="'474a4f'" :strokeWidth="5"/>
    </div>
    <mu-list v-if="!isAjax&&businessCardList">
      <div>
        <!--<mu-list-item v-for="(item,index) in businessCardList"
                      :key="index"
                      :title="item.new_name"
                      :describeLine="2"
                      :disableRipple="true"
                      class="list-item">
          <mu-avatar :src="''" slot="leftAvatar"/>
          <span slot="describe">
        <span style="color: rgba(0, 0, 0, .87)">{{item.new_comp}}</span>
        </span>

          <mu-icon-menu slot="right" icon="more_vert" tooltip="操作">
            <mu-menu-item title="电话"/>
            <mu-menu-item title="同步联系人"/>
            <mu-menu-item title="分组"/>
            <mu-menu-item title="删除"/>
          </mu-icon-menu>
        </mu-list-item>-->
        <business-card v-for="(item,index) in businessCardList"
                       :key="index"
                       :item="item">
        </business-card>

      </div>
    </mu-list>

    <mu-dialog :open="delDialog" title="提示" @close="closeDel">
      确定删除此条信息吗？
      <mu-flat-button slot="actions" @click="closeDel" default label="取消"/>
      <mu-flat-button slot="actions" primary @click="closeDel" label="确定"/>
    </mu-dialog>

    <!--<div class="container-bottom">-->
      <!--<bottom-tab class="tab"></bottom-tab>-->
    <!--</div>-->
  </div>
</template>
<style lang="scss">
  .bc-box {
    position: relative;
    padding-top: 10vh;
  }

  .mu-list {
    position: relative;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    user-select: none;
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
  }

  .mu-refresh-control {
    color: #474a4f !important;
  }

  .mu-circle-spinner {
    border-color: #474a4f !important;
  }

  .top-bar {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .title {
    /*padding-right: 12px;*/
    text-align: center;
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

  .group {
    color: #fff !important;
  }

  .group-underline {
    background-color: transparent !important;
  }
</style>
<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import businessCard from '../common/businesscard'
  import bottomTab from '../../components/bottomtab/bottom-tab'


  export default {
    name: 'message',
    components: {
      businessCard,
      bottomTab
    },
    data() {
      return {
        delDialog: false,
        refreshing: false,
        trigger: null,
        group: '1'
      }
    },
    computed: {
      ...mapGetters(['nowMessageList']),
      ...mapState(['isAjax', 'businessCardList'])
    },
    mounted() {
      this.trigger = this.$el
    },
    methods: {
      ...mapMutations(['removeMessage', 'showSearch']),
      refresh() {
        this.refreshing = true
        setTimeout(() => {
          this.refreshing = false
        }, 2000)
      },
      handleChange(value) {
        this.group = value
      },
      goSearch() {
        this.showSearch();
        this.$router.push('search')
      },
      closeDel() {
        this.delDialog = false
      },
      showDel() {
        this.delDialog = true
      }
    },
    created() {
//      this.$store.dispatch('getAllData', this).then(() => {
//        console.log('getAllData success');
//      })

    }
  }
</script>
