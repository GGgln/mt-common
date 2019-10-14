<template>
  <div id="MtClass_component" class="common-container">
    <div class="param_btn">
      <a-button type="primary" @click="editStatus = true" v-if="!editStatus">编辑</a-button>
      <div v-else>
        <a-button @click="cancelSave">取消</a-button>
        <a-button style="margin-left:20px;" type="primary" @click="save()">保存</a-button>
      </div>
    </div>
    <div class="class_content">
      <h2 class="title">班组排班</h2>
      <div class="class_container">
        <a-form :form="form" ref="form">
          <div class="item_class">
            <a-row :gutter="20" class="row_title">
              <a-col :span="5">
                <p>班组名称</p>
              </a-col>
              <a-col :span="7">
                <p>开始时间点</p>
              </a-col>
              <a-col :span="4">
                <p>持续时间</p>
              </a-col>
              <a-col :span="4">
                <p>间隔时间</p>
              </a-col>
            </a-row>
            <a-row :gutter="20" class="row">
              <a-col :span="5">
                <a-input placeholder="班组名称" />
              </a-col>
              <a-col :span="7">
                <a-date-picker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="开始时间"
                  style="width:100%"
                />
              </a-col>
              <a-col :span="5">
                <a-input-number :min="0" style="width:100%" placeholder="持续时间" />
              </a-col>
              <a-col :span="5">
                <a-input-number :min="0" style="width:100%" placeholder="间隔时间" />
              </a-col>
              <a-col :span="1">
                <a-icon type="minus-circle" />
              </a-col>
            </a-row>
            <a-row :gutter="20" class="row">
              <a-col :span="5">
                <a-input placeholder="班组名称" />
              </a-col>
              <a-col :span="7">
                <a-date-picker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="开始时间"
                  style="width:100%"
                />
              </a-col>
              <a-col :span="5">
                <a-input-number :min="0" style="width:100%" placeholder="持续时间" />
              </a-col>
              <a-col :span="5">
                <a-input-number :min="0" style="width:100%" placeholder="间隔时间" />
              </a-col>
              <a-col :span="1">
                <a-icon type="minus-circle" />
              </a-col>
            </a-row>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "mt-class",
  data() {
    return {
      editStatus: false,
      paramData: {}
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      // let url = `/api/commenParameter/getParameter?idParametersClass=${this.idParametersClass}`;
      // let params = { idParametersClass: this.idParametersClass };
      // request.get(url, params).then(res => {
      //   this.paramData = res.data;
      // });
    },

    cancelSave() {
      this.form.resetFields();
      this.editStatus = false;
    },
    save() {
      let self = this;
      let url = "/api/commenParameter/updateParameter";
      this.form.validateFields((err, value) => {
        console.log(value, err);
        if (!err) {
          let data = JSON.parse(JSON.stringify(self.paramData));
        }
      });
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>