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

    <div style="margin-top: 50%;text-align: center" v-if="isAjax">
      <mu-circular-progress :size="40" :color="'474a4f'" :strokeWidth="5"></mu-circular-progress>
    </div>

    <mu-list v-if="!isAjax">
      <mu-sub-header>{{searchInfo}}</mu-sub-header>
      <div v-for="(item,index) in searchResult">
        <business-card :key="index" :item="item">
        </business-card>
      </div>
    </mu-list>

    <mu-dialog :open="delDialog" title="提示" @close="closeDel">
      确定删除此名片吗？
      <mu-flat-button slot="actions" @click="closeDel" default label="取消"/>
      <mu-flat-button slot="actions" primary @click="del" label="确定"/>
    </mu-dialog>
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
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import businessCard from '../common/businesscard'

  export default {
    data() {
      return {
        searchInfo: '在输入框中，输入关键词搜索相关名片',
        keyword: '',
        results: [],
        delDialog: false
      }
    },
    components: {
      businessCard
    },
    computed: {
      ...mapState(['businessCardList', 'isAjax', 'searchResult']),
      ...mapGetters(['getCardBySearch'])
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

          this.$store.state.isAjax = true
          this.$store.dispatch('searchCards', {keyword: kw})
//          this.$store.commit('getSearchKeyword', {keyword: kw})
//          this.searchInfo = '共找到' + this.$store.state.searchResult.length + '条记录'
        }
      },
      closeDel() {
        this.delDialog = false
      },
      showDel(id) {
        this.cId = id
        this.delDialog = true
      },
      del() {
        console.log(this.cId);
        this.$store.state.isAjax = true
        this.$store.dispatch('delCard', {id: this.cId})
        this.delDialog = false
      },
    }
  }
</script>
