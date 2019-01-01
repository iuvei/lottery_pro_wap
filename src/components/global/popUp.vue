<template>
	<div class="popUp-container">
		<div v-transfer-dom class="tip-box">
			<x-dialog v-model="show" class="dialog-demo" hide-on-blur>
				<div @click="show=false">
					<span class="vux-close"></span>
				</div>
				<div class="tip-content">
					<h3>{{data.title}}</h3>
					<p>{{data.content}}</p>
				</div>
				<div class="my-bank-btn tip-btns">
					<div @click="noOperate">
						<x-button class="weui-btn btn-child noOperate" action-type="button">暂不操作</x-button>
					</div>
					<div @click="goToSetting">
						<x-button class="weui-btn btn-child goToSetting" action-type="button">前往设置</x-button>
					</div>
				</div>
			</x-dialog>
		</div>
	</div>
</template>

<script>
import { XButton, XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  data() {
    return {
      show: true,
      data: {
        title: '提示标题',
        content: '提示內容'
      }
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XButton,
    XDialog
  },
  methods: {
    goToSetting() {
      console.log(this.$router)
      this.$router.push({
        path: '/user/setWithdrawPwd'
      })
    },
    noOperate() {
      this.show = false
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
p {
  margin-top: 40px;
  color: #999;
}
.my-bank-btn {
  padding-top: 40px;
  position: relative;
}
.my-bank-btn .weui-btn {
  width: 68%;
  border-radius: 50px;
}
.vux-close {
  color: #999;
  border: 0.5px solid #999;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 10px;
  zoom: 80%;
}
.tip-content h3 {
  margin-top: 20px;
}
.tip-btns > div {
  display: inline-flex;
  justify-content: space-around;
  padding-bottom: 20px;
  margin: 0 10px;
  background-color: #fff;
}
.tip-btns .btn-child {
  width: 100%;
  font-size: 16px;
}
.tip-btns .noOperate {
  height: 36px;
  background-color: #fff;
}
.tip-btns .goToSetting {
	color: #fff;
}
</style>
