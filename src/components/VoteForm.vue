<template>
  <div>
    <h3>投票作成</h3>
      <label class="form-label">選択肢：
      <textarea
        :value="choices"
        @input="$emit('update:choices', $event.target.value)"
        class="form-control mb-3 mx-auto"
        required>
      </textarea>
      <p class="form-text">1行につき1つの選択肢。空行は無視されます</p>
      </label>
    <div class="row">
      <div class="col">
      <label class="form-label">一人が投票できる回数：
        <input
          type="number"
          :value="nChoicesPerPerson"
          @input="$emit('update:nChoicesPerPerson', Number($event.target.value))"
          class="form-control">
      </label>
      </div>
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
    choices: String,
    nChoicesPerPerson: Number,
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
    },
  }
  
}
</script>

<style>

</style>