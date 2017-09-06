<template>
  <div class="mine-container">
    <mu-list>
      <mu-list-item title="我的分组" :to="'group'">
        <mu-icon slot="left" value="people"/>
        <mu-icon slot="after" value="keyboard_arrow_right"/>
      </mu-list-item>
      <mu-divider inset/>
      <!--<mu-list-item title="我的收藏">-->
        <!--<mu-icon slot="left" value="star"/>-->
        <!--<mu-icon slot="after" value="keyboard_arrow_right"/>-->
      <!--</mu-list-item>-->
      <!--<mu-divider inset/>-->
      <mu-list-item title="个人资料">
        <mu-icon slot="left" value="assignment_ind"/>
        <mu-icon slot="after" value="keyboard_arrow_right"/>
      </mu-list-item>
      <mu-divider inset/>
      <mu-list-item title="设置">
        <mu-icon slot="left" value="settings"/>
        <mu-icon slot="after" value="keyboard_arrow_right"/>
      </mu-list-item>
    </mu-list>

    <!--<div class="container-bottom">-->
      <!--<bottom-tab class="tab"></bottom-tab>-->
    <!--</div>-->
  </div>
</template>
<style scoped>
  .mine-container {
    background-color: #fff;
  }
</style>
<script>
  import bottomTab from '../../components/bottomtab/bottom-tab'

  export default {
    name: 'discover',
    components: {
      bottomTab
    }
  }
</script>
