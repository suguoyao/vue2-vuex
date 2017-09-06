<template>
  <div class="card-result" style="background-color: #fff">
    <div class="gridlist">
      <mu-grid-list class="gridlist-demo">
        <mu-grid-tile titlePosition="bottom" actionPosition="right" :rows="2" :cols="2">
          <img :src="'./static/images/sugars.jpeg'"/>
          <!--<img :src="scanResult.new_title"/>-->
          <span slot="title">分组</span>
          <span slot="subTitle"><b>{{currSelGroup}}</b></span>
          <mu-flat-button v-show="!saving" label="保存" labelClass="flat-label"
                          icon="border_color" slot="action"
                          @click="saveInfo()"></mu-flat-button>
          <!--<mu-flat-button v-show="true" :label="isEdit?'保存':'编辑'" :labelClass="'flat-label'"-->
          <!--:icon="isEdit?'assignment_turned_in':'border_color'" slot="action"-->
          <!--@click="isEdit?saveInfo():editInfo()"></mu-flat-button>-->
          <mu-flat-button v-show="!saving" :label="'放弃'" :labelClass="'flat-label'"
                          icon="clear" slot="action"
                          @click="cancelSave"></mu-flat-button>
          <mu-circular-progress v-show="saving" slot="action" :size="30"
                                style="margin-right: 10px"></mu-circular-progress>
        </mu-grid-tile>
      </mu-grid-list>
    </div>

    <div class="fieldlist">
      <mu-list-item v-for="(val,key) in getDetailsTitle" :key="key" disableRipple>
        <mu-text-field :hintText="'请输入'+BSKEY[key].split('-')[0]"
                       :icon="BSKEY[key].split('-')[1]"
                       :type="BSKEY[key].split('-')[2]"
                       :value="val"
                       v-model="scanResult[key]"
                       multiLine
                       :rowsMax="10"
                       :fullWidth="true"
                       :inputClass="'field-input'"
                       :underlineClass="'underline'"
                       :underlineFocusClass="'underlineFocus'"
                       :errorColor="'error'"
                       :iconClass="'error'"
                       :underlineShow="isEdit"
                       :disabled="!isEdit"
                       :errorText="val.length>0?'':'这是必填项'"
                       :required="true"></mu-text-field>
      </mu-list-item>
    </div>


    <div class="options" v-show="true">
      <mu-tabs>
        <!--<mu-tab value="tab1" icon="contact_phone" title="同步联系人"></mu-tab>-->
        <mu-tab value="tab2" icon="group_add" title="选择分组" @click="showGroup"></mu-tab>
        <!--<mu-tab value="tab3" icon="contacts" title="存入通讯录"></mu-tab>-->
      </mu-tabs>
    </div>


    <!--保存确认弹窗-->
    <mu-dialog :open="dialog"
               @close="closeDialog"
               title="确认信息"
               dialogClass="result-dialog"
               bodyClass="result-dialog-body"
               :scrollable="true">
      <mu-menu>
        <mu-menu-item :title="'分组: '+currSelGroup" :disableFocusRipple="true"></mu-menu-item>
        <mu-menu-item v-for="(val,key) in getDetailsTitle"
                      :title="BSKEY[key].split('-')[0]+': ' + val"
                      :key="key"
                      :disableFocusRipple="true">

        </mu-menu-item>
      </mu-menu>
      <mu-flat-button primary label="确定并保存" @click="save" slot="actions"></mu-flat-button>
      <mu-flat-button default label="取消" @click="closeDialog" slot="actions"></mu-flat-button>
    </mu-dialog>

    <!--分组选择弹框-->
    <mu-dialog :open="groupDialog"
               @close="closeGroup"
               title="选择分组"
               dialogClass="result-dialog"
               bodyClass="result-dialog-body"
               :scrollable="true">
      <mu-menu>
        <mu-menu-item v-for="(item,index) in groupList"
                      :title="item.new_name"
                      :key="index"
                      :disableFocusRipple="true"
                      @click="selectGroup(item)">

        </mu-menu-item>
      </mu-menu>
      <mu-flat-button default label="关闭" @click="closeGroup" slot="actions"></mu-flat-button>
    </mu-dialog>
  </div>
</template>
<style lang="scss">
  .result-dialog {
    max-height: 409px !important;
  }

  .result-dialog-body {
    max-height: 279px !important;
  }

  .mu-flat-button-primary {
    color: #2196f3 !important;
  }

  .gridlist {
    /*display: flex;*/
    /*flex-wrap: wrap;*/
    /*justify-content: space-around;*/
    margin-bottom: 10px;
  }

  .flat-label {
    color: #fff !important;
    font-weight: bold;
  }

  .fieldlist {
    padding: 0 15px 81px 0;
    background-color: #fff;
    .mu-item {
      padding: 0 !important;
    }
    .mu-icon-button {
      position: absolute !important;
      top: 0;
      right: 0;
      float: right;
      color: #2196f3;
    }
  }

  .fr-btn {
    float: right;
  }

  .field-input {
    color: #000 !important;
    font-weight: normal !important;
    opacity: 1;
  }

  .underline {
    background-color: rgba(0, 0, 0, .4) !important;
  }

  .underlineFocus {
    background-color: orange !important;
  }

  .error {
    color: #000;
  }

  .options {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
</style>
<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import bskey from '../../common/js/BSKEY'
  import MuListItem from "../../../node_modules/muse-ui/src/list/listItem.vue";

  export default {
    components: {MuListItem},
    name: 'details',
    data() {
      return {
        details: {},
        editIcon: 'border_color',
        isEdit: true,
        BSKEY: bskey,
        dialog: false,
        saving: false,
        groupDialog: false,
        currSelGroup: '未分组',
        currSelGroupId: 0
      }
    },
    created() {
      let sr = JSON.parse(localStorage.getItem('scanResult'))

      this.currSelGroup = this.$store.state.currGroup === "全部" ? '未分组' : this.$store.state.currGroup
      this.currSelGroupId = this.$store.state.currGroupId

      if (sr) {
        this.$store.dispatch('getGroupList')
        this.$store.commit('getCardScanResult', {results: sr})
      }
    },
    watch: {
      details(oldVal, newVal) {
        console.log(oldVal, newVal);
      }
    },
    computed: {
      ...mapState(['activeId', 'scanResult', 'groupList', 'isAjax', 'currGroupId', 'currGroup']),
      ...mapGetters(['getDetailsTitle', 'getCardDetailGroupName'])
    },
    methods: {
      editInfo() {
        this.isEdit = true
      },
      saveInfo() {
        let result = this.scanResult
        let hasEmpty = false;

        Object.keys(result).forEach(key => {
          if (result[key] == '' || result[key] == null) {
            hasEmpty = true
          }
        })

        if (this.currSelGroupId == 0) {
          hasEmpty = true
        }

        if (!hasEmpty) {
          this.dialog = true
        } else {
          this.$store.commit('showToast', {msg: '请将信息补充完整'})
        }

        console.log('currSelGroupId', this.currSelGroupId)
        console.log('result', this.scanResult)
      },
      cancelSave() {
        this.$router.replace('home')
      },
      save() {
        this.dialog = false
        this.saving = true
        this.$store.dispatch('saveCardResult', {
          cardResult: this.getDetailsTitle,
          groupid: this.currSelGroupId
        })
        console.log(this.$store.state.scanResult);
//        this.saving = false
      },
      closeDialog() {
        this.dialog = false
      },
      selectGroup(item) {
        this.currSelGroup = item.new_name
        this.currSelGroupId = item.new_groupid
        this.$store.state.scanResult._new_group_value = item.new_groupid
        this.groupDialog = false
      },
      showGroup() {
        this.groupDialog = true
      },
      closeGroup() {
        this.groupDialog = false
      },
    }
  }
</script>
