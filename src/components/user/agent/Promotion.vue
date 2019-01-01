<template>
  <div class="promotion">
    <div class="promotion-top">
      <div class="tab-box">
        <div
          :class="{'active':activeTab===0}"
          @click="handleTabClick(0)"
        >代理会员</div>
        <div
          :class="{'active':activeTab===1}"
          @click="handleTabClick(1)"
        >普通会员</div>
      </div>
      <div>
        <div class="rebate-box">
          <span class="fs14 black-level3">当前返点: </span>
          <span class="red-color current-rebate">{{$store.state.user.userInfo.rebate}}%</span></div>
        <div class="rebate-setting">
          <div class="label">下级返点</div>
          <div class="rebate-select-box">
            <div class="black-level9">{{remainRebate?`${remainRebate}`:'请选择返点数'}}</div>
            <x-icon
              type="ios-arrow-down"
              size="20"
            ></x-icon>
            <div class="picker-area">
              <popup-picker
                :data="currentRebateList"
                cancel-text="请选择返点"
                confirm-text="确认"
                @on-change="handleRebateChange"
                @on-shadow-change="handleShadowChange"
                @on-show="handlePickerShow"
              ></popup-picker>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          class="btn-confirm"
          :disabled="!remainRebate"
          @click="addPromotionLink"
        >一键设置</button>
      </div>
      <div
        class="text-theme tc fs12"
        @click="boundBoxShow=true"
      >操作说明</div>
    </div>
    <div class="share-block">
      <swipeout>
        <swipeout-item
          transition-mode="follow"
          v-for="(item,index) in shareList"
          :key="index"
          class="share-list"
        >
          <div
            slot="content"
            class="share-item"
          >
            <div>
              <div>
                <div class="dib">
                  <img
                    :src="`../../../../static/images/icon/${item.type==='1'?'agent':'membership'}-icon@2x.png`"
                    class="account-type-icon"
                  />
                </div>
                <div class="dib">返点</div>
                <div class="dib red-color">{{item.rebate}}%</div>
              </div>
							<!-- ${promotion_domain} -->
              <div class="black-level3 ellipsis">{{`${promotion_domain}?code=${item.code}&type=${item.type}`}}</div>
            </div>
            <div>
              <button
                class="copy-btn"
                v-clipboard:copy="`${promotion_domain}?code=${item.code}&type=${item.type}`"
                v-clipboard:success="handleCopySuccess"
                v-clipboard:error="handleCopyError"
              >
                点击复制
              </button>
            </div>
          </div>
          <div
            slot="right-menu"
            @click="handleDelete(item)"
          >
            <swipeout-button
              type="warn"
              class="right-menu"
            >删除</swipeout-button>
          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <boundLayer
      title="操作说明"
      :content="operateContent"
      :boundBoxShow="boundBoxShow"
      @toggleBoundBoxShow="toggleBoundBoxShow"
    />
  </div>
</template>

<script>
import { PopupPicker, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

import boundLayer from '../../global/boundLayer'
export default {
  components: {
    PopupPicker,
    boundLayer,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  data() {
    return {
      activeTab: 0,
      currentRebate: this.$store.state.user.userInfo.rebate,
      remainRebate: '',
      promotion_domain: '',
      rebateList: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ['.'],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ['%']
      ],
      currentRebateList: [],
      shareList: [],
      boundBoxShow: false,
      operateContent:
        '<ol><li><b>1.</b>一键返点设置完成后,页面下方将会显示自主注册链接地址,请注意链接地址会不定期的进行更新</li><li class="mt10"><b>2.</b>下级返点为给下级设置的返点比例</li></ol>',
      rebatePlaceHolder: ''
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions([
      'GET_PROMOTION_INFO',
      'SET_PROMOTION_INFO',
      'DELETE_PROMOTION_INFO'
    ]),
    initPage() {
      this.GET_PROMOTION_INFO().then(res => {
        this.promotion_domain = res.data.promotion_domain + '/user/register'
        this.shareList = res.data.promotions
      })
      this.currentRebate = this.$store.state.user.userInfo.rebate
      let max1 = this.currentRebate.split('.')[0]
      this.currentRebateList = this.rebateList
      this.currentRebateList[0] = this.rebateList[0].filter(
        item => item <= max1
      )
      this.rebatePlaceHolder = `请选择小于${max1}的返点`
    },
    handleTabClick(index) {
      this.activeTab = index
    },
    handleRebateChange(val) {
      this.remainRebate = val.join('')
    },
    handleShadowChange(val) {
      if (val[0] === this.currentRebate.split('.')[0]) {
        let max2 = this.currentRebate.split('.')[1]
        this.currentRebateList = [
          this.rebateList[0],
          ['.'],
          this.rebateList[2].filter(item => item <= max2),
          ['%']
        ]
      } else {
        this.currentRebateList = this.rebateList
      }
    },
    handlePickerShow() {
      if (this.currentRebate.split('.')[0] === '0') {
        this.currentRebateList = [
          this.rebateList[0],
          ['.'],
          this.rebateList[2].filter(item => item > 0),
          ['%']
        ]
      } else {
        this.currentRebateList = this.rebateList
      }
    },
    handleCopySuccess() {
      this.$vux.toast.show({
        type: 'success',
        text: '复制成功',
        time: 500
      })
    },
    handleCopyError() {
      this.$vux.toast.show({
        type: 'success',
        text: '复制失败',
        time: 500
      })
    },
    addPromotionLink() {
      let shareItem = {
        url: 'github.com',
        type: this.activeTab === 0 ? 'agent' : 'membership',
        rebate: this.remainRebate.replace('%', '')
      }
      console.log(shareItem)
      // this.shareList.unshift(shareItem)
      this.SET_PROMOTION_INFO({
        type: this.activeTab === 0 ? 1 : 0,
        rebate: shareItem.rebate
      }).then(res => {
        this.shareList = res.data.promotions
      })
    },
    toggleBoundBoxShow(bool) {
      this.boundBoxShow = bool
    },
    handleDelete(item) {
      console.log(item)
      this.DELETE_PROMOTION_INFO({ id: item.id }).then(res => {
        this.shareList = res.data.promotions
      })
    }
  }
}
</script>


<style scoped>
.tab-box {
  display: flex;
  text-align: center;
  border-radius: 3px;
  line-height: 37px;
  font-size: 14px;
}
.tab-box > div {
  flex: 1;
}
.tab-box > .active {
  color: white;
}
.promotion-top {
  background-color: white;
  padding: 18px 12px;
}
.rebate-box {
  margin: 22px 0;
}
.rebate-setting {
  display: flex;
  height: 49px;
  align-items: center;
  border: solid 0.5px #e2e4ef;
  overflow: hidden;
	padding-right: 0;
	border-radius: 3px;
}
.rebate-setting .label {
  font-size: 14px;
  color: #333;
  padding: 0 2px;
  margin: 0 5px;
}
.rebate-select-box {
  display: flex;
  flex: 1;
  background-color: #f9fafe;
  height: 48px;
  align-items: center;
  box-sizing: border-box;
  margin-right: 1px;
  padding-right: 12px;
  padding-left: 20px;
  font-size: 14px;
  position: relative;
}
.rebate-select-box > div:first-child {
  flex: 1;
}
.picker-area {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
  opacity: 0;
}
.share-block {
  margin-top: 10px;
  background-color: white;
}
.share-item {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 12px;
  flex-wrap: nowrap;
}
.share-item {
  border-bottom: solid 0.5px #e2e4ef;
}
.share-item > div:first-child {
  flex: 1;
  overflow: hidden;
}
.account-type-icon {
  width: 40px;
}

.copy-btn {
  width: 80px;
  height: 29px;
  font-size: 12px;
  text-align: center;
  border-radius: 30px;
  line-height: 29px;
  background-color: white;
}
.current-rebate {
  font-size: 17px;
  font-weight: 500;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
	text-overflow: ellipsis;
	font-size: 15px;
	color:#666;
}
.dib {
	font-size: 14px;
}
</style>


<style>
.promotion .picker-area .vux-popup-picker-select {
  height: 48px;
  opacity: 0;
}
</style>
