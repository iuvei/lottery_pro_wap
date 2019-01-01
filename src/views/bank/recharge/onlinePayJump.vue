<template>
  <div>
    <x-header :left-options="{backText: ''}">在线充值</x-header>
		<div>
			<a :href="this.$route.query.url"></a>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // rechargechannelList: []
    }
  },
  created() {
    // this.initPage()
  },
  methods: {
    // ...Vuex.mapActions(['GET_RECHARGE_CHANNEL_LIST']),
    // initPage() {
    //   let { category_id } = this.$route.query
    //   this.GET_RECHARGE_CHANNEL_LIST({
    //     category_id,
    //     type: '0'
    //   }).then(res => {
    //     console.log(res)
    //     this.rechargechannelList = res.data
    //     this.setRechargeRange()
    //   })
    // }
  },
  components: {}
}
</script>

<style scoped>
</style>
