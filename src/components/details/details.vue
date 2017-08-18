<template>
  <div></div>
</template>
<style>

</style>
<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'details',
    data() {
      return {}
    },
    computed: {
      ...mapState(['activeId'])
    },
    methods: {},
    created() {
      console.log('activeId',this.activeId);
    }
  }
</script>
