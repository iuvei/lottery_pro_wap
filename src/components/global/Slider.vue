<template>
  <div>
    <input type="range" :min="min" :max="max" :step="step||0.1" />
  </div>
</template>

<script>
export default {
  props: ['min', 'max']
}
</script>

<style scoped>
</style>
