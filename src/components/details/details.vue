<template>
  <div style="background-color: #fff">
    <div class="gridlist">
      <mu-grid-list class="gridlist-demo">
        <mu-grid-tile titlePosition="bottom" actionPosition="right" :rows="2" :cols="2">
          <img :src="'./static/images/sugars.jpeg'"/>
          <span slot="title">姓名</span>
          <span slot="subTitle"><b>公司名公司名公司名公司名</b></span>
          <mu-flat-button :label="isEdit?'保存':'编辑'" :labelClass="'flat-label'"
                          :icon="isEdit?'assignment_turned_in':'border_color'" slot="action"
                          @click="editInfo"/>
        </mu-grid-tile>
      </mu-grid-list>
    </div>

    <div class="fieldlist">
      <mu-text-field hintText="姓名" type="text" icon="person"
                     value="Sugars苏哥"
                     :fullWidth="true"
                     :inputClass="'field-input'"
                     :underlineClass="'underline'"
                     :underlineFocusClass="'underlineFocus'"
                     :errorColor="'error'"
                     :iconClass="'error'"
                     :underlineShow="isEdit"
                     :disabled="!isEdit"/>
      <br/>
      <mu-text-field hintText="公司" type="text" icon="domain"
                     value="北京雨花石云计算科技股份有限公司"
                     :fullWidth="true"
                     :inputClass="'field-input'"
                     :underlineClass="'underline'"
                     :underlineFocusClass="'underlineFocus'"
                     :errorColor="'error'"
                     :iconClass="'error'"
                     :underlineShow="isEdit"
                     :disabled="!isEdit"/>
      <br/>
      <mu-text-field hintText="邮箱" type="email" icon="email"
                     value="sugars.su@celnet.com.cn"
                     :fullWidth="true"
                     :inputClass="'field-input'"
                     :underlineClass="'underline'"
                     :underlineFocusClass="'underlineFocus'"
                     :errorColor="'error'"
                     :iconClass="'error'"
                     :underlineShow="isEdit"
                     :disabled="!isEdit"/>
      <br/>
      <mu-text-field hintText="手机" type="tel" icon="phone"
                     value="13823695205"
                     :fullWidth="true"
                     :inputClass="'field-input'"
                     :underlineClass="'underline'"
                     :underlineFocusClass="'underlineFocus'"
                     :errorColor="'error'"
                     :iconClass="'error'"
                     :underlineShow="isEdit"
                     :disabled="!isEdit"/>
      <br/>
      <mu-text-field hintText="简介" multiLine :rows="3" :rowsMax="6" icon="comment"
                     value="hahahaha"
                     :fullWidth="true"
                     :inputClass="'field-input'"
                     :underlineClass="'underline'"
                     :underlineFocusClass="'underlineFocus'"
                     :errorColor="'error'"
                     :iconClass="'error'"
                     :underlineShow="isEdit"
                     :disabled="!isEdit"/>
      <br/>
    </div>

    <div class="options">
      <mu-tabs>
        <mu-tab value="tab1" icon="contact_phone" title="同步联系人"/>
        <mu-tab value="tab2" icon="group_add" title="分组"/>
        <mu-tab value="tab3" icon="contacts" title="存入通讯录"/>
      </mu-tabs>
    </div>
  </div>
</template>
<style>
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
  }

  .field-input {
    color: #000 !important;
    font-weight: normal !important;
    opacity: 1;
  }

  .underline {
    background-color: #000 !important;
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
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'details',
    data() {
      return {
        editIcon: 'border_color',
        isEdit: false
      }
    },
    computed: {
      ...mapState(['activeId', 'details'])
    },
    methods: {
      editInfo() {
        this.isEdit = !this.isEdit
      }
    },
    created() {
      console.log('activeId', this.activeId);
    }
  }
</script>
