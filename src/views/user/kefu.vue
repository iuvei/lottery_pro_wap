<template>
  <div>
    <x-header :left-options="{backText: ''}">联系我们</x-header>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    this.GET_SERVICES({ key: 'service_link' }).then(res => {
      console.log(res.data)
    })
  },
  methods: {
    ...Vuex.mapActions(['GET_SERVICES'])
  },
  components: {}
}
</script>

<style scoped>
</style>

