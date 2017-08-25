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

    <!--<mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh()"/>-->
    <div style="margin-top: 50%;text-align: center" v-if="isAjax">
      <mu-circular-progress :size="40" :color="'474a4f'" :strokeWidth="5"/>
    </div>

    <div>
      <mu-list v-if="!isAjax&&businessCardList">
        <ul id="list" ref="content">
          <li v-for="(value,key) in bcsSortList" class="sort-item">
            <div :id="key" class="sort-head" :ref="`key_${key}`">
              <mu-sub-header>{{key}}</mu-sub-header>
            </div>
            <business-card v-for="(item,index) in value"
                           :key="index"
                           :item="item">
            </business-card>
          </li>
        </ul>

        <!--检索-->
        <div class="initial-bar" :style="{'height':barHeight+'px'}" ref="nav" @touchstart="handleTouchStart">
          <ul class="initial-inner">
            <li class="initial-item" @click.stop="toPs(i)" v-for="i in bcInitialList">{{i}}</li>
          </ul>
        </div>
      </mu-list>

      <div class="indicator" v-show="moving">{{ currentIndicator }}</div>
    </div>

    <mu-dialog :open="delDialog" title="提示" @close="closeDel">
      确定删除此条信息吗？
      <mu-flat-button slot="actions" @click="closeDel" default label="取消"/>
      <mu-flat-button slot="actions" primary @click="closeDel" label="确定"/>
    </mu-dialog>
  </div>
</template>
<style lang="scss">
  .bc-box {
    position: relative;
    /*padding-top: 10vh;*/
    padding-top: 56px;
  }

  .initial-bar {
    position: fixed;
    /*top: 50%;*/
    top: 56px;
    right: 0;
    bottom: 0;
    font-size: 11px;
    line-height: 1.2;
    /*right: 8px;*/
    width: 13px;
    background-color: #474a4f;
    max-height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    /*-webkit-transform: translate3d(0, -50%, 0);*/
    /*transform: translate3d(0, -50%, 0);*/
    z-index: 999;
    .initial-inner {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      margin: 0;
      max-height: 100%;
    }
    li {
      display: block;
      font-size: 12px;
      font-weight: bold;
      color: #fff;
      text-align: center;
      margin: 3px auto;
    }
  }

  .indicator {
    position: fixed;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 50px;
    background-color: rgba(0, 0, 0, .7);
    border-radius: 5px;
    color: #fff;
    font-size: 22px;
    z-index: 10000;
  }

  .mu-list {
    position: relative;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    user-select: none;
    margin-right: 13px;
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
        group: '1',
        barHeight: document.documentElement.clientHeight - 112,
        sections: [],
        indicatorTime: null,
        moving: false,
        firstSection: null,
        currentIndicator: '',
        navOffsetX: 0
      }
    },
    computed: {
      ...mapGetters(['nowMessageList', 'bcInitialList', 'bcsSortList']),
      ...mapState(['isAjax', 'businessCardList'])
    },
    created() {
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
      },
      toPs(i) {
        window.scrollTo(0, this.$refs['key_' + i][0].offsetTop)
      },
      handleTouchStart(e) {
        let listItems = this.$refs.content.getElementsByTagName('li');
        if (listItems.length > 0) {
          this.firstSection = listItems[0];
        }
        this.sections = listItems;

        if (e.target.tagName !== 'LI') {
          return;
        }
        this.navOffsetX = e.changedTouches[0].clientX;
        this.scrollList(e.changedTouches[0].clientY);
        if (this.indicatorTime) {
          clearTimeout(this.indicatorTime);
        }
        this.moving = true;
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleTouchEnd);
      },
      handleTouchMove(e) {
        e.preventDefault();
        this.scrollList(e.changedTouches[0].clientY);
      },
      handleTouchEnd() {
        this.indicatorTime = setTimeout(() => {
          this.moving = false;
          this.currentIndicator = '';
        }, 500);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
      },
      scrollList(y) {
        let currentItem = document.elementFromPoint(this.navOffsetX, y);
        if (!currentItem || !currentItem.classList.contains('initial-item')) {
          return;
        }
        this.currentIndicator = currentItem.innerText;
        let targets = [];
        for (let i = 0; i < this.sections.length; i++) {
          if (this.sections[i].firstChild.innerText.trim() === currentItem.innerText) {
            targets.push(this.sections[i])
          }
        }
        let targetDOM;

        if (targets.length > 0) {
          targetDOM = targets[0];
          window.scrollTo(0, document.getElementById(currentItem.innerText).offsetTop)
        }
      }
    },
    mounted() {
      this.trigger = this.$el
    }
  }
</script>
