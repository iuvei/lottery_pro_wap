<template>
  <input
    :type="inputType"
    :style="inputStyle"
    :value="value"
    inputmode="numeric"
    pattern="[0-9]*"
    @keydown="textToNumber($event)"
    @keyup="handleNumberChange($event)"
  />
</template>

<script>
export default {
  props: ['value', 'maxLen', 'inputType', 'inputStyle'],
  data() {
    return {
      numberVal: 1
    }
  },
  created() {},
  methods: {
    textToNumber(e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.$emit('deleteNumber', e)
      }
      if (e.keyCode == 110 || e.keyCode == 190) {
        e.preventDefault()
      }
      if (
        [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl/cmd+A
        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl/cmd+C
        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl/cmd+X
        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        // let it happen, don't do anything
        return
      }
      if (
        ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
          (e.keyCode < 96 || e.keyCode > 105)) ||
        e.target.value.length === this.maxLen
      ) {
        e.preventDefault()
      }
    },
    handleNumberChange(e) {
      this.$emit('handleNumberChange', e)
    }
  },
  watch: {
    value: function(value) {
      this.$emit('handleNumberChange', {
        target: {
          value: value
        }
      })
    }
  }
}
</script>


<style scoped>
input {
  width: 100%;
}
</style>

