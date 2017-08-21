<template>
  <div class="search">
    <mu-appbar :zDepth="0">

      <mu-icon-button icon="arrow_back"
                      slot="left"
                      @click="backHome"/>

      <mu-text-field class="appbar-search-field"
                     slot="default"
                     hintText="搜索"
                     v-model="keyword"
                     :underlineFocusClass="'search-underline'"
                     :inputClass="'search-input'"/>
      <mu-icon-button icon="search"
                      slot="right"
                      @click="search"/>
    </mu-appbar>

    <mu-list>
      <mu-sub-header>{{searchInfo}}</mu-sub-header>
      <div v-for="(item,index) in results">
        <business-card :key="index" :item="item">
        </business-card>
      </div>
    </mu-list>
  </div>
</template>
<style>
  .search-underline {
    background-color: orange !important;
  }

  .search-input {
    color: #fff !important;
    line-height: 1;
  }
</style>
<script>
  import {mapState, mapMutations} from 'vuex'
  import businessCard from '../common/businesscard'

  export default {
    data() {
      return {
        searchInfo: '在输入框中，输入关键词搜索相关名片',
        keyword: '',
        results: []
      }
    },
    components: {
      businessCard
    },
    computed: {
      ...mapState(['businessCardList'])
    },
    methods: {
      ...mapMutations(['showSearch']),
      backHome() {
        this.showSearch()
        this.$router.push('home')
      },
      search() {
        let kw = this.keyword
        if (kw.length > 0) {
          this.businessCardList.filter(item => {
            if (item.new_name !== null && item.new_name.indexOf(kw) > -1) {
              this.results.push(item)
            }
          })
          this.searchInfo = '共找到' + this.results.length + '条记录'
        }
      }
    }
  }
</script>
