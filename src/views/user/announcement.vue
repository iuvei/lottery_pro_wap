<template>
  <div class="container">
    <x-header :left-options="{backText: ''}">公告</x-header>
    <div class="notice-wrapper" v-if="hasNoticeList.length">
      <swipeout-item class="item-child" v-for="item in hasNoticeList" :key="item.title">
        <div slot="content" class="content">
          <div class="content-top">
            <h3>{{item.title}}</h3>
						<span>{{item.create_time}}</span>
          </div>
          <p>{{item.note}}</p>
        </div>
      </swipeout-item>
    </div>
    <div v-if="!hasNoticeList.length">
      <EmptyPage type="emptyList"/>
    </div>
  </div>
</template>

<script>
  import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
  import EmptyPage from '../../components/global/EmptyPage'
  export default {
    data() {
      return {
        hasNoticeList: []
      }
    },
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      EmptyPage
    },
    mounted() {
      this.initPage()
    },
    methods: {
      ...Vuex.mapActions(['GET_NOTICE_LIST']),
      initPage() {
        this.GET_NOTICE_LIST()
          .then(res => {
            this.hasloadData = true
            if (!res.data.length) {
              this.hasNoticeList = []
            } else {
              this.hasNoticeList = res.data
            }
          })
      }
    }
  }
</script>`

<style scoped>
  .notice-wrapper {
    margin-top: 44px;
    height: calc(100vh - 44px);
  }

  .item-child {
    margin-bottom: 10px;
    background-color: #ffffff;
  }

  .item-child .content {
    padding: 12px;
  }

  .item-child p {
    color: #555;
    line-height: 1.6;
		font-size: 14px;
		letter-spacing:1px;
  }

  .item-child .content-top h3 {
    flex: 1;
    line-height: 1.2;
    color: #252525;
    font-size: 17px;
    font-weight: bold;
  }

  .item-child span {
    margin-left: 10px;
    color: #999;
		font-size: 14px;
		display:flex;
		justify-content:flex-end;
		line-height: 12px;
  }

  .content-top {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    margin-bottom: 17px;
  }
</style>

