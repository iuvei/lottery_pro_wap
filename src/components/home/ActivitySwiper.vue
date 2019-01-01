<template>
  <div class="activity-swiper">
    <div>
      <div class="swiper-box">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item,index) in activityList" :key="index">
            <ul class="lottery-list">
              <li>
                <div>
                </div>
              </li>
            </ul>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
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
        },
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        loop: true
      },
      activeTypeIndex: 0,
      activityList: [1, 2, 3, 4, 5]
    }
  },
  created() {
    this.initSwiper()
  },
  methods: {
    changeLotteryType(index) {
      this.activeTypeIndex = index
    },
    initSwiper() {},
    goToLottery(item) {
      if (item.code) {
        this.$router.push({
          path: `/game/${item.code}`
        })
      }
    }
  }
}
</script>


<style scoped>
.activity-swiper .lottery-type-tab {
  display: flex;
  text-align: center;
}

.activity-swiper .lottery-type-tab > div {
  flex: 1;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.activity-swiper {
  margin: 10px 0;
  box-shadow: 0px 2px 2px #e8eaf2bd;
}
.activity-swiper > div {
  border-radius: 4px;
  overflow: hidden;
}

.lottery-list img {
  width: 100%;
  border-radius: 4px;
}
.lottery-list > li > div {
  background-image: url('../../../static/images/home/banner@3x.png');
  background-size: cover;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
}
</style>

<style>
@import url('../../../static/css/swiper.css');

.activity-swiper .swiper-container {
  height: 90px;
}
.activity-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #f10215;
  border-radius: 5px;
}

.activity-swiper .swiper-pagination-bullet {
  width: 7px;
  height: 7px;
}
.activity-swiper .swiper-pagination-fraction,
.activity-swiper .swiper-pagination-custom,
.activity-swiper .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 0;
}
</style>
