<template>
  <div id="MtConsumer_component" class="container">
    <div class="consumer-contents">
      <div class="add-btn-model">
        <a-button size="small" class="add-btn" type="primary" @click="showModal">新增用户</a-button>
        <a-modal title="新建用户" v-model="visible" @ok="hideModal" okText="保存" cancelText="关闭">
          <p>
            姓名
            <a-input placeholder="Basic usage" />
          </p>
          <p>
            用户名
            <a-input placeholder="Basic usage" />
          </p>
          <p>
            新建密码
            <a-input placeholder="Basic usage" />
          </p>
          <p>
            密码确认
            <a-input placeholder="Basic usage" />
          </p>
        </a-modal>
      </div>
      <a-table :pagination="false" :columns="columns" :dataSource="data" bordered>
        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleAdd(record)">
            <i class="iconfont icon-table-edit" />
            编辑
          </a>
          <a href="javascript:;" @click="deleHostData(record)">
            <i class="iconfont icon-tableEmpty" />
            删除
          </a>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '日志时间',
    align: 'center',
    dataIndex: 'time'
  },
  {
    title: '操作类型',
    align: 'center',
    // className: 'column-money',
    dataIndex: 'type'
  },
  {
    title: '日志内容',
    align: 'center',
    dataIndex: 'content'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: '',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    key: '1',
    time: '11.11',
    type: '￥300,000.00',
    content: 'New York No. 1 Lake Park',
    operator: 123
  },
  {
    key: '2',
    time: '22.22',
    type: '￥1,256,000.00',
    content: 'London No. 1 Lake Park',
    operator: 123
  },
  {
    key: '3',
    time: '33.33',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  },
  {
    key: '4',
    time: '44.44',
    type: '￥120,000.00',
    content: 'Sidney No. 1 Lake Park',
    operator: 123
  }
]
// import request from './../utils/request'
export default {
  name: 'mt-consumer-page',
  data () {
    return {
      a: '',
      b: '',
      visible: false,
      data,
      columns,
      pagination: {
        total: 0,
        defaultCurrent: 1,
        pageSize: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['1', '2', '3'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      }
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    hideModal () {
      this.visible = false
    },
    handleAdd (data) {
      console.log(data.time)
    },
    deleHostData (data) {
      console.log(data)
    }
    // init() {
    //    request({
    //     url: that.form.listUrl,
    //     method: 'get'
    //   }).then(res => {
    //     //alert('success')
    //   }).catch(()=>{
    //     //alert('error')
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
