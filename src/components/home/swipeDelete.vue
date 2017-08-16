<template>
  <div @click="clickitem">
    <slot ref="child"></slot>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script>
  export default {
    name: 'swipeDelete',
    methods: {
      clickitem() {
        this.emit('clickitem');
        console.log(this.$refs.child);
      }
    }
  }
</script>
