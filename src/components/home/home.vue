<template>
  <div>
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <div style="margin-top: 30px;text-align: center" v-if="isAjax">
      <mu-circular-progress :size="40" :color="'474a4f'" :strokeWidth="5"/>
    </div>
    <mu-list v-if="!isAjax&&businessCardList">
      <div>
        <mu-list-item v-for="(item,index) in businessCardList"
                      :key="index"
                      :title="item.new_name"
                      :describeLine="2"
                      :disableRipple="false"
                      class="list-item">
          <mu-avatar :src="''" slot="leftAvatar"/>
          <span slot="describe">
        <span style="color: rgba(0, 0, 0, .87)">{{item.new_comp}}</span>
        </span>

          <!--时间与待处理-->
          <!--<div class="item-right"
               slot="right">
            &lt;!&ndash;获取到当前聊天队列，最后一条内容的time&ndash;&gt;
            <span class="time">{{item.list[item.list.length - 1].time}}</span>
            &lt;!&ndash;数据条数&ndash;&gt;
            &lt;!&ndash;数据需求是为字符串&ndash;&gt;
            <mu-badge :content="`${item.list.length}`" color="orange"/>
          </div>-->

          <mu-icon-menu slot="right" icon="more_vert" tooltip="操作">
            <mu-menu-item title="电话"/>
            <mu-menu-item title="同步联系人"/>
            <mu-menu-item title="分组"/>
            <mu-menu-item title="删除"/>
          </mu-icon-menu>
        </mu-list-item>

        <!--阻止时间冒泡-->
        <!--<div class="delete"-->
        <!--@click.stop="removeMsg(item._id)">删除-->
        <!--</div>-->
      </div>
    </mu-list>

    <mu-dialog :open="delDialog" title="提示" @close="closeDel">
      确定删除此条信息吗？
      <mu-flat-button slot="actions" @click="closeDel" default label="取消"/>
      <mu-flat-button slot="actions" primary @click="closeDel" label="确定"/>
    </mu-dialog>
  </div>
</template>
<style lang="scss">
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
</style>
<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  // 后续会将滑动封装至子组件
  //  import swipeDelete from './swipeDelete'

  export default {
    name: 'message',
    data() {
      return {
        delDialog: false,
        refreshing: false,
        trigger: null
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
      ...mapMutations(['removeMessage']),
      refresh() {
        this.refreshing = true
        setTimeout(() => {
          this.refreshing = false
        }, 2000)
      },
      closeDel() {
        this.delDialog = false
      },
      showDel() {
        this.delDialog = true
      },
      removeMsg(_id) {
        this.removeMessage({_id})
      }
    },
    created() {
//      this.$store.dispatch('getAllData', this).then(() => {
//        console.log('getAllData success');
//      })

    }
  }
</script>
