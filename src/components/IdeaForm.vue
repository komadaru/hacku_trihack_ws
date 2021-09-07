<template>
  <div>
    <h3>投票作成</h3>
      <div class="col">
      <label class="form-label">
        期日：
      <flatPickr
        placeholder="期日を入力"
        :config="{enableTime:true}"
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
  components: {
    flatPickr
  },
  props: {
    timelimit: String
  },
  methods: {

  }
  
}
</script>

<style>

</style>