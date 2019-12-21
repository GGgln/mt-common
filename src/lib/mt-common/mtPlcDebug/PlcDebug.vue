<template>
  <div class="container">
    <div class="title" v-if="titleData">
      <ul>
        <li @click="titleClick(title.plcDebugMenuId)" :class="[titleActive == title.plcDebugMenuId ? 'titleClass' : '']" :key="title.plcDebugMenuId" v-for="title in titleData">
          {{ title.desc }}
        </li>
      </ul>
      <a-button @click="listData" style="float: right;margin:6px  44px 0 0;" type="primary" icon="sync">刷新</a-button>
    </div>
    <div class="table-data">
      <div class="table-data-min">
        <a-table id="table_blue" :columns="columns" :dataSource="data" :pagination="false" rowKey="pointId">
          <template slot="settingValue" slot-scope="text, record">
            <a-input placeholder="请输入" style="width: 100%;height: 100%;" v-if="record.digTag == 0 && record.writable == 1" @pressEnter="inputEnter($event, record)" />
            <a-select v-else-if="record.digTag == 1 && record.writable == 1" style="width: 100%;height: 100%;" placeholder="请选择" @change="selectChange($event, record)">
              <a-select-option :key="0" value="true">true</a-select-option>
              <a-select-option :key="1" value="false">false</a-select-option>
            </a-select>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '../utils/request'
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  };
  if (row.tableLength) {
    obj.attrs.rowSpan = row.tableLength;
  } else {
    obj.attrs.rowSpan = 0;
  }
  return obj;
};
const columns = [
  {
    title: '组',
    dataIndex: 'groupDesc',
    scopedSlots: { customRender: 'groupDesc' },
    width: '15%',
    customRender: renderContent
  },
  {
    title: '点描述',
    dataIndex: 'pointDesc',
    scopedSlots: { customRender: 'pointDesc' },
    width: '30%'
  },
  {
    title: '点类型',
    dataIndex: 'pointType',
    scopedSlots: { customRender: 'pointType' },
    width: '15%'
  },

  {
    title: '点地址',
    dataIndex: 'pointAddr',
    scopedSlots: { customRender: 'pointAddr' },
    width: '13%'
  },
  {
    title: '值',
    dataIndex: 'value',
    scopedSlots: { customRender: 'value' },
    width: '12%'
  },
  {
    title: '修改值',
    dataIndex: 'settingValue',
    scopedSlots: { customRender: 'settingValue' },
    width: '15%'
  }
];

export default {
  name: 'mt-plc-debug',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    }
  },
  data() {
    return {
      data: [], //table数据
      columns,
      titleData: [], //title数据
      titleActive: null //title下边框类名判断依据
    };
  },
  created() {
    this.titleWay();
  },
  methods: {
    inputEnter(e, id) {
      //输入框回车
      this.issue(id.pointId, e.target.value, id.pointType);
    },
    selectChange(selectedItems, data) {
      //下拉框改变
      this.issue(data.pointId, selectedItems, data.pointType);
    },
    issue(pointid, pointval, pointType) {
      //值改变后的回调
      let data = { pointId: pointid, pointValue: pointval, pointType: pointType };
        request
          .post(`${this.baseUrl}/Service/API/V1/ASHCHP/WebDebug/writePoint`,data)
          .then(response => {
      this.$message.success(response.msg);
      this.listData();
          })
          .catch(error => {
        this.$message.error(error.msg);
        this.listData();
          })
    },
    titleWay() {
      //获取title数据

        request
          .get( `${this.baseUrl}/Service/API/V1/ASHCHP/WebDebug/getParentList`)
          .then(response => {
        this.titleData = response.data;
        this.titleActive = response.data[0].plcDebugMenuId;
        this.listData();
          })
          .catch(error => {
            // this_.$message.error('获取部件属性失败');
          })

    },
    titleClick(data) {
      //编辑title中转
      this.titleActive = data;
      this.listData();
    },
    listData() {
      let url =`${this.baseUrl}/Service/API/V1/ASHCHP/WebDebug/getPlcDebugList/`;
        request
          .post(url + this.titleActive)
          .then(response => {
 this.data = [];
 for (var i = 0; i < response.data.length; i++) {
   for (var j = 0; j < response.data[i].pointList.length; j++) {
     var obj = new Object();
     obj.groupDesc = response.data[i].groupDesc;
     obj.digTag = response.data[i].pointList[j].digTag;
     obj.pointAddr = response.data[i].pointList[j].pointAddr;
     obj.pointDesc = response.data[i].pointList[j].pointDesc;
     obj.pointId = response.data[i].pointList[j].pointId;
     obj.pointType = response.data[i].pointList[j].pointType;
     obj.settingValue = response.data[i].pointList[j].settingValue;
     obj.value = response.data[i].pointList[j].value;
     obj.writable = response.data[i].pointList[j].writable;
     if (j == 0) {
       obj.tableLength = response.data[i].pointList.length;
     }
     this.data.push(obj);
   }

   // 插入标识和数量
 }
          })
          .catch(error => {
   this.data = [];
          })



    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  padding: 10px 15px;
  margin: 32px;
  flex: 1;
  background-color: white;
  .title {
    box-sizing: border-box;
    overflow: hidden;
    height: 50px;
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    margin-bottom: 25px;
    ul {
      list-style: none;
      overflow: hidden;
      height: 50px;
      float: left;
      margin-bottom: 0;
      li {
        color: #666666;
        padding: 0 20px !important;
        height: 50px;
        float: left;
        line-height: 50px;
        text-align: center;
        box-sizing: border-box;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
  .table-data {
    box-sizing: border-box;
    height: calc(100% - 75px);
    overflow: hidden;
    .table-data-min {
      height: 100%;
      overflow: auto;
    }
    .list-p {
      height: 30px;
      display: block;
      line-height: 30px;
      margin-bottom: 10px;
    }
  }
}

.titleClass {
  color: rgba(51, 51, 51, 1) !important;
  border-bottom: 4px solid rgba(44, 154, 230, 1) !important;
}
</style>
