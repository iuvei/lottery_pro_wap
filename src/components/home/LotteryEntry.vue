<template>
  <div class="lottery-entry-box">
    <div>
      <!--<div class="lottery-type-tab" v-show="tabShow">-->
      <!--<div class="official" :class="{'active':activeTypeIndex===0}" @click="changeLotteryType(0)">官方玩法</div>-->
      <!--<div class="credit" :class="{'active':activeTypeIndex===1}" @click="changeLotteryType(1)">信用玩法</div>-->
      <!--</div>-->
      <div class="swiper-box">
        <div class="swiper-title">热门彩种</div>
        <swiper :options="swiperOption">
          <swiper-slide
            v-for="(item,index) in lotteryList"
            :key="index"
          >
            <ul class="lottery-list">
              <li
                v-for="(game,index) in item"
                @click="goToLottery(game)"
                :key="index"
              >
                <div>
                  <img
                    :src="game.icon_3x"
                    alt=""
                  >
                </div>
                <div>
                  {{game.name}}
                </div>
              </li>
            </ul>
          </swiper-slide>
          <div
            class="swiper-pagination"
            slot="pagination"
          ></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      activeTypeIndex: 0,
      tabShow: false,
      lotteryList: [],
      lotteryData: {}
    }
  },
  created() {
    this.initSwiper()
  },
  methods: {
    ...Vuex.mapActions(['GET_ALL_GAMES']),
    changeLotteryType(index) {
      this.activeTypeIndex = index
      this.setLotteryList()
    },
    initSwiper() {
      this.GET_ALL_GAMES().then(res => {
        this.lotteryData = res.data.games
        this.tabShow =
          this.lotteryData.credit.includes.length &&
          this.lotteryData.official.includes.length
        this.setLotteryList()
      })
    },
    goToLottery(item) {
      if (item.game_code) {
        let position =
          item.position === '0'
            ? 0
            : item.position === '1'
            ? 1
            : this.activeTypeIndex
        this.$router.push({
          path: `/game/${item.game_code}`,
          query: {
            position: position
          }
        })
      }
    },
    setLotteryList() {
      if (!this.tabShow) {
        this.activeTypeIndex = this.lotteryData.credit.includes.length ? 1 : 0
      }
      let filteredList =
        this.activeTypeIndex === 0
          ? this.lotteryData.official.includes
          : this.lotteryData.credit.includes
      this.lotteryList = _.chunk(filteredList, 8)
    }
  }
}
</script>


<style scoped>
.lottery-type-tab {
  display: flex;
  text-align: center;
}

.lottery-type-tab > div {
  flex: 1;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.lottery-entry-box {
  margin: 10px 0;
  box-shadow: 0px 2px 2px #e8eaf2bd;
  margin-top: 0;
}
.lottery-entry-box > div {
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
}
.lottery-type-tab > div {
  position: relative;
  background-size: 100% 100%;
}
.lottery-type-tab > div.active {
  color: #f10215;
  font-weight: 500;
}

.official {
  background-image: url('../../../static/images/home/icon_home_official_false.png');
}
.official.active {
  background-image: url('../../../static/images/home/icon_home_official_true.png');
}

.credit {
  background-image: url('../../../static/images/home/icon_home_credit_false.png');
}
.credit.active {
  background-image: url('../../../static/images/home/icon_home_credit_true.png');
}

.swiper-box {
  padding-bottom: 0;
}

.swiper-title {
  height: 42px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
  padding: 0 12px;
  line-height: 42px;
  border-bottom: solid 0.5px #ebe8f5;
  font-weight: 500;
}

.lottery-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px;
  font-size: 13px;
  color: #333;
  text-align: center;
}
.lottery-list img {
  width: 52px;
  height: 52px;
}

.lottery-list > li {
  width: 25%;
  margin-bottom: 27px;
}
</style>

<style>
@import url('../../../static/css/swiper.css');

.lottery-entry-box .swiper-container {
  height: 210px;
}
.lottery-entry-box .swiper-pagination-bullet.swiper-pagination-bullet-active {
  width: 14px;
  height: 5px;
  background: #ff3d4a;
  border-radius: 5px;
  position: relative;
  top: -0.5px;
}

.lottery-entry-box .swiper-pagination-bullet {
  width: 6px;
  height: 6px;
}
.lottery-entry-box .swiper-pagination-fraction,
.lottery-entry-box .swiper-pagination-custom,
.lottery-entry-box .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 0;
}
</style>
