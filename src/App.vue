<template>
  <div id="app">
    <div class="loading-content" v-show="$store.state.app.loading">
      <spinner :type="type" size="40px"></spinner>
    </div>
    <div class="mask-layer" v-show="$store.state.app.maskLayerShow" @click="handleMaskLayerClick" :style="{'z-index':$store.state.app.maskLayerZIndex}"></div>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import { Spinner } from 'vux'
export default {
  name: 'app',
  components: {
    Spinner
  },
  data() {
    return {
      type: 'bubbles'
    }
  },
  created() {
    this.registerGlobalEvents()
  },
  methods: {
    registerGlobalEvents() {
      this.$eventBus.$on('toast', data => {
        Vue.$vux.toast.show(data)
      })
    },
    unregisterGlobalEvents() {
      this.$eventBus.$off('toast')
    },
    handleMaskLayerClick() {
      this.$store.commit('setMaskLayerShow', false)
      this.$eventBus.$emit('clickLayer')
    }
  },
  destroyed() {
    this.unregisterGlobalEvents()
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/close.less';
.loading-content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
</style>
