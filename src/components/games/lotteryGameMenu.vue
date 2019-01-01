<template>
  <div>
    <transition name="slide">
      <div
        class="game-menu-box"
        :style="{'height':$window.innerHeight-93+'px'}"
        v-show="$store.state.game.playMenuShow"
        @click="$store.commit('toggleGameMenu',false)"
      >
        <div
          class="game-menu-main black-level5"
          @click.stop
        >
          <div
            class="play-tab-list"
            v-show="gameType===2"
          >
            <button-tab v-model="position">
              <button-tab-item @on-item-click="changePlayType">官方玩法</button-tab-item>
              <button-tab-item @on-item-click="changePlayType">信用玩法</button-tab-item>
            </button-tab>
          </div>
          <ul class="top-menu-list">
            <li
              v-for="(item,index) in firstLevelMenu"
              :class="{'game-menu-item-selected':activeFirstLevelIndex==index}"
              @click="selectTopMenu(item,index)"
            >
              <div>
                <span :style="setZoom(item.length)">
                  {{item.name}}
                </span>
              </div>
            </li>
          </ul>

          <ul v-if="secondLevelMenu[activeSecondLevelIndex]&&secondLevelMenu[activeSecondLevelIndex].children[activeThirdLevelIndex]">
            <li
              v-for="(item,index) in secondLevelMenu"
              class="sub_menu_box"
            >
              <!-- 二级菜单标题 -->
              <div class="title-menu-list">
                {{item.name}}
              </div>
              <!-- 三级菜单 -->
              <div>
                <ul class="menu-list">
                  <li
                    v-for="(subItem,subIndex) in item.children"
                    :class="{'game-menu-item-selected':activeSecondLevelIndex==index&&activeThirdLevelIndex==subIndex}"
                    @click="selectSubMenu(item,index,subIndex)"
                  >
                    <div>
                      <span :style="setZoom(subItem.name.length)">
                        {{subItem.name}}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <ul
            class="menu-list second_menu_list"
            v-else
          >
            <li
              v-for="(item,index) in secondLevelMenu"
              :class="{'game-menu-item-selected':activeSecondLevelIndex==index}"
              @click="selectSubMenu(item,index,0)"
            >
              <div>
                {{item.name}}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="mask-layer"
        v-show="$store.state.game.playMenuShow"
      >
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      menus: [],
      activeFirstLevelIndex: 0,
      activeSecondLevelIndex: 0,
      activeThirdLevelIndex: 0,
      firstLevelMenu: [],
      secondLevelMenu: [],
      firstPlayType: '',
      secondPlayType: '',
      position: 0,
      gameType: 0
    }
  },
  created() {
    /* 重置选中菜单 */
    this.initPage()
  },
  methods: {
    ...Vuex.mapActions(['GET_PLAY_MENU']),
    initPage() {
      let { game_code } = this.$route.params
      let restoreMenu = false
      if (game_code !== this.$store.state.game.currentGameInfo.game_code) {
        // 需要重置菜单
        this.activeFirstLevelIndex = 0
        this.activeSecondLevelIndex = 0
        this.activeThirdLevelIndex = 0
        restoreMenu = true
      }
      this.$store.state.game.gameInfo.map(item => {
        item.includes.map(item1 => {
          if (item1.game_code === this.$route.params.game_code) {
            this.initPosition(parseInt(item1.position), restoreMenu)
          }
        })
      })
    },
    initPosition(pos, restoreMenu) {
      this.gameType = pos
      if (pos === 0 || pos === 2) {
        this.position = 0
      }
      if (pos === 1) {
        this.position = 1
      }
      if ('position' in this.$route.query) {
        this.position = parseInt(this.$route.query.position)
      }
      if (!restoreMenu) {
        this.position = parseInt(
          this.$store.state.game.currentGameInfo.position
        )
      }

      /* 获取游戏数据 */
      this.getGameData()
      /*  切换玩法类型*/
      this.$store.commit('setCurrentGameInfo', {
        ...this.$store.state.game.currentGameInfo,
        position: this.position
      })
      /* 设置默认选中的玩法 */
      this.setDefaultPlayInfo()
    },
    setDefaultPlayInfo() {
      // 设置选中的玩法
      // this.position = this.$route.query.position * 1 || 0
      // 判断是否切换了游戏
      if (
        this.$route.params.game_code !==
        this.$store.state.game.currentGameInfo.game_code
      ) {
        return
      }
      let { activeIndexList } = this.$store.state.game.playInfo
      //
     /*  if (this.$store.state.app.path.from.path.search('confirmOrder') === -1) {
        activeIndexList = [0, 0, 0]
        this.$store.commit('setCurrentGameInfo', {
          ...this.$store.state.game.currentGameInfo,
          position: 0
        })
      } */
      this.activeFirstLevelIndex = (activeIndexList && activeIndexList[0]) || 0
      this.activeSecondLevelIndex = (activeIndexList && activeIndexList[1]) || 0
      this.activeThirdLevelIndex = (activeIndexList && activeIndexList[2]) || 0
    },
    getGameData() {
      let position = this.position
      this.GET_PLAY_MENU({
        game_code: this.$route.params.game_code,
        position
      }).then(res => {
        this.menus = res.data[`games${position}`]
        this.menus.forEach((item, index) => {
          if (parseInt(item.default_display) === 1) {
            this.activeFirstLevelIndex = index
          }
        })
        this.setMenu()
      })
    },
    selectTopMenu(item, index) {
      // level 玩法层级
      this.activeFirstLevelIndex = index
      this.activeSecondLevelIndex = 0
      // 判断是否属于两面盘玩法

      this.secondLevelMenu = this.menus[this.activeFirstLevelIndex].children
      if (!this.secondLevelMenu.length) {
        this.activeSecondLevelIndex = 0
        this.activeThirdLevelIndex = 0
        this.$store.commit('toggleGameMenu', false)
        this.setMenu()
      } else {
        this.selectSubMenu(this.secondLevelMenu[0], 0, 0, true)
      }
    },

    selectSubMenu(item, index, subIndex, showMenu) {
      this.activeSecondLevelIndex = index
      this.activeThirdLevelIndex = subIndex
      this.$store.commit('toggleGameMenu', showMenu || false)
      // 设置当前游戏玩法信息
      this.setMenu()
    },
    setMenu() {
      // 设置一级菜单menu
      this.firstLevelMenu = this.menus
      this.secondLevelMenu = this.menus[this.activeFirstLevelIndex].children
      let menuTitle = ''
      let firstMenuItem = this.menus[this.activeFirstLevelIndex]
      this.firstPlayType = `${firstMenuItem.name}`

      // 一级菜单
      if (!firstMenuItem.children.length) {
        menuTitle = `${firstMenuItem.name}`
      } else {
        if (
          !firstMenuItem.children[this.activeSecondLevelIndex].children.length
        ) {
          // 二级菜单
          menuTitle = `${firstMenuItem.name}-${
            firstMenuItem.children[this.activeSecondLevelIndex].name
          }`
        } else {
          // 三级菜单
          menuTitle = `${firstMenuItem.name}-${
            firstMenuItem.children[this.activeSecondLevelIndex].children[
              this.activeThirdLevelIndex
            ].name
          }`
        }
      }
      // 二码和三码玩法的菜单需要特别处理
      if (firstMenuItem.name === '二码' || firstMenuItem.name === '三码') {
        let navTitle = firstMenuItem.children[this.activeSecondLevelIndex].name
        let subNavTitle =
          firstMenuItem.children[this.activeSecondLevelIndex].children[
            this.activeThirdLevelIndex
          ].name
        menuTitle = `${navTitle}-${subNavTitle}`
      }
      // 设置当前玩法信息
      let currentPlayInfo = {}
      if (!this.menus[this.activeFirstLevelIndex].children.length) {
        currentPlayInfo = this.menus[this.activeFirstLevelIndex]
      } else {
        if (
          !this.menus[this.activeFirstLevelIndex].children[0].children.length
        ) {
          currentPlayInfo = this.menus[this.activeFirstLevelIndex].children[
            this.activeSecondLevelIndex
          ]
        } else {
          currentPlayInfo = this.menus[this.activeFirstLevelIndex].children[
            this.activeSecondLevelIndex
          ].children[this.activeThirdLevelIndex]
        }
      }
      this.$store.commit('setPlayInfo', {
        activeIndexList: [
          this.activeFirstLevelIndex,
          this.activeSecondLevelIndex,
          this.activeThirdLevelIndex
        ],
        ...currentPlayInfo
      })
      this.$store.commit('setMenutitle', menuTitle)
      this.$eventBus.$emit('menuChange', menuTitle)
    },
    setZoom(len) {
      let zoom = 1
      if (len > 4) {
        zoom = 1 - len * 0.05
      }
      return { zoom }
    },
    resetMenu() {
      this.activeFirstLevelIndex = 0
      this.activeSecondLevelIndex = 0
      this.activeThirdLevelIndex = 0
    },
    changePlayType() {
      this.resetMenu()
      this.getGameData()
      this.$store.commit('setCurrentGameInfo', {
        ...this.$store.state.game.currentGameInfo,
        position: this.position
      })
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.game-menu-box {
  position: fixed;
  width: 100%;
  left: 0;
  top: 44px;
  bottom: 0px;
  z-index: 11;
  overflow-y: auto;
}

.mask-layer {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-menu-main {
  background-color: #f9fafe;
  font-size: 14px;
  border-radius:  0 0 10px 10px;
}
.game-menu-title {
  padding-left: 10px;
}

.top-menu-list,
.menu-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}
.top-menu-list {
  padding-bottom: 10px;
}

.top-menu-list > li,
.menu-list > li {
  width: calc(25% - 10px);
  margin: 5px;
  border: solid 0.5px #e2e4ef;
  box-sizing: border-box;
  background-color: white;
  border-radius: 4px;
  padding: 5px 0;
}

.top-menu-list .game-menu-item-selected,
.menu-list .game-menu-item-selected {
  color: white;
  border: none;
}

.menu-list {
  display: flex;
}

.title-menu-list {
  padding-left: 10px;
  font-weight: 500;
  color: #555;
  padding-top: 10px;
}

.sub_menu_box {
  border-top: solid 0.5px #e2e4ef;
}

.sub_menu_box > div:last-child {
  flex: 1;
}

.sub_menu_box .game-menu-item-selected {
  background-color: white;
  border: solid 0.5px red;
  color: #f10215;
}
.play-tab-list {
  padding: 10px 10px 0 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all ease-out 0.2s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-225px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease-out 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
