<template>
  <div>
    <mu-list v-if="!isAjax&&nowMessageList">
      <div v-for="(item,index) in nowMessageList"
           :class="[{swipeleft:isSwipe[index]},'wrap']"
           ref="child"
           :key="index">
        <mu-list-item :title="item.friend.name"
                      :describeLine="2"
                      :disableRipple="true"
                      class="list-item">
          <mu-avatar :src="item.friend.avatar" slot="leftAvatar"/>
          <span slot="describe">
        <span style="color: rgba(0, 0, 0, .87)">{{item.list[item.list.length - 1].message}}</span>
        </span>

          <!--时间与待处理-->
          <div class="item-right"
               slot="right">
            <!--获取到当前聊天队列，最后一条内容的time-->
            <span class="time">{{item.list[item.list.length - 1].time}}</span>
            <!--数据条数-->
            <!--数据需求是为字符串-->
            <mu-badge :content="`${item.list.length}`" color="orange"/>
          </div>
        </mu-list-item>

        <!--阻止时间冒泡-->
        <div class="delete"
             @click.stop="removeMsg(item._id)">删除
        </div>
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
    overflow: hidden;
    .swipeleft {
      transform: translateX(-20%);
    }
    .wrap {
      width: 125%;
      background-color: #fff;
      overflow: hidden;
      transition: all .2s linear;
      height: 70px;
      .list-item {
        width: 80%;
        float: left;
        /*height: 10vh;*/
        transition: all .2s linear;
        .mu-avatar {
          height: 30px;
          border-radius: 0;
          img {
            border-radius: 0;
          }
        }
      }
      .delete {
        width: 20%;
        /*height: 10vh;*/
        height: 100%;
        float: right;
        display: block;
        /*line-height: 10vh;*/
        line-height: 70px;
        color: #fff;
        text-align: center;
        background-color: #ff1744;
      }
      .item-right {
        position: relative;
        .time {
          position: absolute;
          display: inline-block;
          top: -10px;
          left: -16px;
        }
        .mu-badge {
          display: inline-block;
          position: absolute;
          top: 0;
          left: -10px;
          border-radius: 5px;
        }
      }
    }
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
        isSwipe: [false, false, false],
        delDialog: false
      }
    },
    computed: {
      ...mapGetters(['nowMessageList']),
      ...mapState(['isAjax'])
    },
    methods: {
      ...mapMutations(['removeMessage']),
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
      setTimeout(() => {
        // 判断是否存在信息列表
        if (this.$refs.child) {
          this.$refs.child.forEach((el, index) => {
            let x, y, X, Y, swipeX, swipeY
            // 监听触摸事件
            el.addEventListener('touchstart', e => {
              x = e.changedTouches[0].pageX
              y = e.changedTouches[0].pageY
              swipeX = true
              swipeY = true
              this.isSwipe = [false, false, false]
            })

            el.addEventListener('touchmove', e => {
              X = event.changedTouches[0].pageX
              Y = event.changedTouches[0].pageY
              if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                // 阻止默认事件
                e.stopPropagation()
                // 右滑
                if (X - x > 10) {
                  e.preventDefault()
                  this.isSwipe.splice(index, 1, false)
                }
                if (x - X > 10) {
                  e.preventDefault()
                  this.isSwipe.splice(index, 1, true)
                }
                swipeY = false
              }
              if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false
              }
            })
          })
        }
      }, 1000);
    }
  }
</script>
