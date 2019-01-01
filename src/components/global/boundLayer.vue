<template>
  <transition name="bound">
    <div class="mask-layer" v-show="boundBoxShow" @click="$emit('toggleBoundBoxShow',false)">
      <div class="bound-box">
        <div class="bound-header">
          <div class="bound-header-title">
            {{title}}
          </div>
          <div class="bound-header-close" @click="$emit('toggleBoundBoxShow', false)">
            <i class="iconfont icon-jiahao1"></i>
          </div>
        </div>
        <div class="bound-content black-level5" v-html="content||'暂无相关玩法介绍'"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  props: ['boundBoxShow', 'content', 'title'],
  components: {
    XDialog
  },

  directives: {
    TransferDom
  },
  data() {
    return {
      showToast: true
    }
  }
}
</script>

<style scoped>
.bound-box {
  width: 90%;
  /* min-height: calc(100vh - 30%); */
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.bound-header {
  line-height: 2.5rem;
	width: 338px;
  color: white;
  text-align: center;
  position: relative;
}
.bound-header-title {
  font-weight: bold;
  font-size: 18px;
	width: 340px;
}
.bound-header-close {
  position: absolute;
  right: 11px;
  top: 0;
}

.bound-header-close > .iconfont {
  font-size: 20px;
  transform: rotate(45deg);
  display: block;
}
.bound-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  font-size: 13px;
  padding: 20px
}


.bound-enter-active,
.bound-leave-active {
  transition: all ease-out 0.2s;
}
.bound-enter,
.bound-leave-to {
  transform: scale(1.2,1.2);
  opacity: 0;
}
.mask-layer{
  z-index: 13
}
</style>
