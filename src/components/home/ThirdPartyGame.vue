<template>
  <div class="third-party-box">
    <div class="third-party-title">
      主题游戏
    </div>
    <div>
      <ul class="thirdparty-game-list">
        <li v-for="item in thirdPartyGameList">
          <div>
            <img :src="item.icon" alt="">
          </div>
          <div>
            {{item.name}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      thirdPartyGameList: [
        {
          name: '罗城殿下',
          icon: '../../../static/images/home/third-party-01@3x.png'
        },
        {
          name: '花样棋牌',
          icon: '../../../static/images/home/third-party-02@3x.png'
        },
        {
          name: '疯狂牛牛',
          icon: '../../../static/images/home/third-party-03@3x.png'
        },
        {
          name: '捕鱼来了',
          icon: '../../../static/images/home/third-party-04@3x.png'
        },
        {
          name: '挑战极限',
          icon: '../../../static/images/home/third-party-05@3x.png'
        },
        {
          name: '都市来了',
          icon: '../../../static/images/home/third-party-06@3x.png'
        }
      ]
    }
  }
}
</script>

<style scoped>
.third-party-box {
  background-color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0px 2px 2px #e8eaf2bd
}
.thirdparty-game-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: center;
  padding: 9px 0;
}

.third-party-title {
  height: 42px;
  font-size: 14px;
  color: #333;
  padding: 0 12px;
  line-height: 42px;
  border-bottom: solid 0.5px #ebe8f5;
}
.thirdparty-game-list > li {
  width: 33.3%;
}

.thirdparty-game-list img {
  width: 97px;
  height: 97px;
}
</style>
