<template>
  <div class="group-list">
    <mu-list>
      <mu-sub-header>已有分组</mu-sub-header>
      <mu-divider/>
      <mu-list-item title="最近30天查看">
        <!--<mu-icon value="chat_bubble" slot="right"/>-->
      </mu-list-item>
      <mu-divider/>
      <mu-list-item title="合作伙伴">
      </mu-list-item>
      <mu-list-item title="最近新增名片">
      </mu-list-item>
      <mu-list-item title="未分组">
      </mu-list-item>
    </mu-list>

    <div class="add">
      <mu-float-button icon="add" class="demo-float-button"/>
    </div>
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
  }
</style>
<script>

</script>
