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
              <a-col :span="5">
                <p>持续时间</p>
              </a-col>
              <a-col :span="5">
                <p>间隔时间</p>
              </a-col>
            </a-row>
            <div v-if="scheduleList.length>0">
              <a-row :gutter="20" class="row" v-for="(el,i) in scheduleList" :key="i">
                <a-col :span="5">
                  <a-form-item>
                    <a-input
                      placeholder="班组名称"
                      :disabled="!editStatus"
                      v-decorator="[`scheduleList[${i}].groupDesc`,{initialValue:el.groupDesc,rules: [{required:true,message:`请输入班组名称`}]}]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item>
                    <a-date-picker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="开始时间"
                      style="width:100%"
                      :disabled="!editStatus || i>0"
                      v-decorator="[`scheduleList[${i}].startTimeStr`,{initialValue: el.startTimeStr?moment(el.startTimeStr, 'YYYY-MM-DD HH:mm'):el.startTimeStr,rules: [{required:true,message:`请选择开始时间`}]}]"
                      @change="changeStartTime"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                    <a-input-number
                      :min="1"
                      style="width:100%"
                      placeholder="持续时间"
                      :disabled="!editStatus"
                      @change="changeContinueHours"
                      v-decorator="[`scheduleList[${i}].continueHours`,{initialValue:el.continueHours,rules: [{required:true,message:`请输入持续时间`}]}]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                    <a-input-number
                      :min="0"
                      style="width:100%"
                      placeholder="间隔时间"
                      :disabled="!editStatus"
                      v-decorator="[`scheduleList[${i}].restHours`,{initialValue:el.restHours,rules: [{required:true,message:`请输入间隔时间`}]}]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="1">
                  <a-icon type="minus-circle" v-if="editStatus" @click="removeLoopClass(i,el)" />
                </a-col>
              </a-row>
            </div>
            <div class="no_data" v-else>暂无班组排班</div>
          </div>
          <div class="btn_add" v-if="editStatus">
            <a-button type="primary" icon="plus" @click="openModal">添加班组</a-button>
          </div>
        </a-form>
      </div>
    </div>
    <a-modal
      title="是否要恢复已删除班组？"
      v-model="modalVisible"
      width="450px"
      okText="直接新增"
      @ok="addClass()"
    >
      <a-table
        size="small"
        class="table_blue"
        :columns="columns"
        :dataSource="classList"
        :pagination="false"
        rowKey="groupId"
      >
        <div slot="operation" slot-scope="text,record,index">
          <a-button type="primary" @click="renewClass(index,record)" size="small">恢复</a-button>
          <a-popconfirm title="确定要删除吗?" @confirm="() => removeClass(record)">
            <a-button size="small">删除</a-button>
          </a-popconfirm>
        </div>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import request from "../utils/request";
import util from "../utils/util";
import moment from "moment";
const columns = [
  {
    title: "班组名称",
    dataIndex: "groupDesc",
    scopedSlots: { customRender: "groupDesc" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: "120px"
  }
];
const dataClass = {
  groupDesc: "",
  startTimeStr: null,
  continueHours: "",
  restHours: ""
};
export default {
  name: "mt-class",
  data() {
    return {
      columns,
      editStatus: false,
      scheduleList: [],
      classList: [],
      modalVisible: false
    };
  },
  props: {
    baseUrl: {
      type: String,
      default: "/mtCommonApi"
    },
 
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {
    this.initClassSchedule();
    this.initClassList();
  },
  methods: {
    moment,
    // 获取排班列表
    initClassSchedule() {
      let url = `${this.baseUrl}/Service/API/V1/CHP/Group/getGroupInfoList`;
      request.get(url).then(res => {
        this.scheduleList = res.data;
        this.$forceUpdate();
      });
    },
    // 获取班组列表
    initClassList() {
      let url = `${this.baseUrl}/Service/API/V1/CHP/Group/getClassGroupList`;
      request.get(url).then(res => {
        this.classList = res.data;
      });
    },
    removeLoopClass(index, el) {
      let scheduleList = this.form.getFieldValue("scheduleList");
      scheduleList.splice(index, 1);
      this.scheduleList.splice(index, 1);
      this.form.setFieldsValue({ scheduleList });
      this.updateScheduleList();
    },
    removeClass(data) {
      let url = `${this.baseUrl}/Service/API/V1/CHP/Group/deleteClassGroup`;
      request.post(url, data).then(res => {
        this.initClassList();
      });
    },
    insertClass(data) {
      if (data) {
        let insertData = Object.assign({}, dataClass, data);
        this.scheduleList.push(insertData);
      } else {
        let insertData = util.deepClone(dataClass);
        this.scheduleList.push(insertData);
      }
      this.updateScheduleList();
    },
    openModal() {
      if (this.classList.length > 0) {
        this.modalVisible = true;
      } else {
        this.insertClass();
      }
    },
    addClass(data) {
      this.insertClass(data);
      this.modalVisible = false;
    },
    cancelSave() {
      this.form.resetFields();
      this.initClassList();
      this.initClassSchedule();
      this.editStatus = false;
    },
    renewClass(i, data) {
      this.classList.splice(i, 1);
      this.addClass(data);
    },
    save() {
      let self = this;
      let userInfo = null
      if(sessionStorage.getItem('userInfo')){
        userInfo = sessionStorage.getItem('userInfo')
      } else{
        this.$message.warn('当前状态未登录，请先登录')
        this.$router.push('/login')
        return
      }
      let url = `${this.baseUrl}/Service/API/V1/CHP/Group/updateGroupInfo?username=${JSON.parse(userInfo).userId}`;
      // let url = `${this.baseUrl}/Service/API/V1/CHP/Group/updateGroupInfo?username=zwj`;
      this.form.validateFields((err, value) => {
        
        if (!err) {
          let data = JSON.parse(JSON.stringify(self.scheduleList));
          data = data.map((item, i) => {
            let newItem = value.scheduleList[i];
            item = Object.assign({}, item, newItem, {
              startTimeStr: util.formatTime(newItem.startTimeStr._d).timeToS
            });

            return item;
          });
         
          request.post(url, data).then(res => {
            self.$message.success("更新成功");
            this.initClassSchedule();
            this.initClassList();
            self.editStatus = false;
          });
        }
      });
    },
    computeDate(timeStr, hours) {
      let date = new Date(timeStr);
      date = date.setHours(date.getHours() + hours);
      return util.formatTime(date).timeToH;
    },
    setClassListTime(list) {
      let self = this;
      for (let i = 1; i < list.length; i++) {
        let preClass = list[i - 1];
        if (preClass.continueHours && preClass.startTimeStr) {
          list[i].startTimeStr = self.computeDate(
            preClass.startTimeStr,
            preClass.continueHours
          );
        } else {
          list[i].startTimeStr = null;
        }
      }
      this.scheduleList = list;
    },
    changeStartTime(e) {
      this.updateScheduleList();
    },
    changeContinueHours(e, a) {
      this.updateScheduleList();
    },
    updateScheduleList() {
      this.$nextTick(() => {
        let formData = this.form.getFieldsValue();
        let data = [];
        if (formData.scheduleList && formData.scheduleList.length > 1) {
          data = formData.scheduleList.map((item, i) => {
            let startTimeStr =
              item.startTimeStr && typeof "object"
                ? util.formatTime(item.startTimeStr._d).timeToH
                : null;
            item = Object.assign({}, this.scheduleList[i], item, {
              startTimeStr
            });
            return item;
          });

          this.setClassListTime(data);
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