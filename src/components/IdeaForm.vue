<template>
  <div>
    <h3>投票作成</h3>
      <div class="col">
      <label class="form-label">
        期日：
      <flatPickr
        placeholder="期日を入力"
        :config="config"
        :modelValue="timelimit"
        @input="$emit('update:timelimit', $event.target.value)"
        class="form-control">
      </flatPickr>
      </label>
      </div>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';

export default {
  data() {
    return {
      config: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: null,
      }
    }
  },
  components: {
    flatPickr
  },
  props: {
    timelimit: String
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      let currentdate = new Date()
      this.config.minDate = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' +
      currentdate.getDate() + ' ' + currentdate.getHours() + ':' + (currentdate.getMinutes() + 1)
    }
  }
  
}
</script>

<style>

</style>