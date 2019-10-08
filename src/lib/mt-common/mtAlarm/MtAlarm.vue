<template>
    <div id="MtAlarm_component" class="common-container">
      <mt-table-section :form.sync="form"></mt-table-section>
    </div>
</template>
<script>
export default {
  name: 'mt-alarm',
  props: [
    {
      listUrl: '',
      type: String,
      default: ''
    }
  ],
  data() {
    return {
      form: {
        formFilterData: [
          { name: '报警类型', value: 'alarmType', type: 'default'}
        ]
      }
    }
  },
  mounted () {
    console.log(this)
  },
  methods: {
    init () {}
  }
}
</script>
