<template>
  <div class="group-list">
    <mu-list>
      <mu-sub-header>已有分组</mu-sub-header>

      <div v-for="(item,index) in groupList">
        <mu-divider/>

        <mu-list-item :title="item.new_name" class="list-item">

        </mu-list-item>

        <div class="card-menu">
          <mu-icon-menu slot="right" icon="more_vert" tooltip="操作" @itemClick="option(index)">
            <mu-menu-item title="重命名" @click="renameGroup(item)"/>
            <mu-menu-item title="删除" @click="delGroup(index)"/>
          </mu-icon-menu>
        </div>
      </div>

    </mu-list>

    <div class="add" @click.stop="showGroup">
      <mu-float-button icon="add" class="demo-float-button"/>
    </div>


    <mu-dialog :open="dialog" @close="close">
      <mu-text-field class="appbar-search-field"
                     type="text"
                     v-model="groupName"
                     :fullWidth="true"
                     slot="default"
                     hintText="请输入分组的名字"/>
      <mu-flat-button slot="actions" @click="close" default label="取消"/>
      <mu-flat-button slot="actions" default @click="addGroup" label="确定"/>
    </mu-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .group-list {
    background-color: #fff;
  }

  .add {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 999;
  }
</style>
<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        dialog: false,
        groupName: '',
        type: '',
        currGroup: null
      }
    },
    computed: {
      ...mapState(['groupList'])
    },
    methods: {
      showGroup() {
        this.type = 'add'
        this.dialog = true
      },
      addGroup() {
        if (this.type == 'add') {
          this.groupList.push(this.groupName)
        } else {
          this.groupList[this.currGroup] = this.groupName
        }
        this.groupName = ''
        this.dialog = false
      },
      delGroup(index) {
        this.groupList.splice(index, 1)
      },
      renameGroup(groupName) {
        this.type = 'rename'
        this.groupName = groupName
        this.dialog = true
      },
      close(reason) {
        this.currGroup = null
        this.groupName = ''
        this.dialog = false
      },
      option(index) {
        this.currGroup = index
      }
    }
  }
</script>
