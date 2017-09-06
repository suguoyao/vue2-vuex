<template>
  <div class="bcdata-box">
    <div style="width:100%;background-color:#fff;margin-top: 50%;text-align: center;"
         v-if="isAjax">
      <mu-circular-progress :size="40" :color="'474a4f'" :strokeWidth="5"/>
    </div>

    <div v-if="compayBusinessData.length>0" style="text-align:center;">
      <mu-row :gutter="true">
        <mu-col v-for="(val,key) in getBSTitle"
                :key="key" :width="key=='经营(业务)范围'?'100':'50'">
          <mu-list-item
            disableRipple>
            <mu-text-field :label="key" type="text"
                           :value="val"
                           multiLine
                           :rowsMax="10"
                           :fullWidth="true"
                           :labelClass="'labelClass'"
                           :underlineClass="'txtline'"
                           :inputClass="'inputClass'"
                           :iconClass="'error'"
                           :underlineShow="true"
                           :disabled="true"></mu-text-field>
          </mu-list-item>
        </mu-col>
      </mu-row>

      <mu-raised-button label="返回" class="demo-raised-button" @click="backDetails"></mu-raised-button>
    </div>

    <div class="empty" v-if="compayBusinessData.length==0&&!isAjax">
      <mu-icon value="sentiment_neutral" :size="80"></mu-icon>
      <mu-content-block :style="{'margin-bottom':'20px'}">查无此公司的工商信息</mu-content-block>
      <mu-raised-button label="返回" class="demo-raised-button" @click="backDetails"></mu-raised-button>
    </div>
  </div>
</template>
<style lang="scss">
  .bcdata-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px;
    background-color: #fff;
    .mu-item {
      padding: 0 !important;
    }

    .empty {
      text-align: center;
      margin-top: 50%;
    }

    .labelClass {
      color: #9e9e9e;
      font-weight: bold;
    }

    .inputClass {
      color: #000 !important;
      font-weight: bold !important;
      opacity: 1;
    }

    .txtline {
      /*background-color: orange !important;*/
      border: 1px solid #edeff2 !important;
    }

    .mu-text-field.has-label {
      min-height: 60px !important;
    }
  }
</style>
<script>
  import {mapState, mapGetters} from 'vuex'
  import bskey from '../../common/js/BSKEY'

  export default {
    name: 'businessData',
    data() {
      return {
        BSKEY: bskey
      }
    },
    computed: {
      ...mapState(['isAjax', 'compayBusinessData']),
      ...mapGetters(['getBSTitle'])
    },
    created() {
      this.$store.state.isAjax = true
      this.$store.dispatch('getBusinessDataByCRM', this.$route.query)
    },
    methods: {
      backDetails() {
        this.$router.back();
      }
    }
  }
</script>
