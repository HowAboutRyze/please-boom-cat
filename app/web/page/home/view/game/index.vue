<template>
  <div class="game-page">
    <h1>爆炸猫啊</h1>
    <button @click="quitGame">
      退出游戏
    </button>
    <h3>游戏已开始，牌堆剩余数量：{{ remain }}</h3>

    <!-- 别的玩家 -->
    <ul class="other-player">
      <li
        v-for="(player) in otherPlayers"
        :key="player.userId"
        :class="isOrigin(player.userId) && showedCard ? 'origin-player' : ''"
      >
        <p>
          {{ getNickName(player.userId) }}
          <span v-show="isCurrentPlayer(player.userId)">(出牌玩家{{ waitingDefuse ? '，等待拆解' : '' }})</span>
          <span v-if="isBoomPlayer(player.userId)">~爆炸了~</span>
          <span v-if="player.isOver">（尸体）</span>
        </p>
        <p>手牌数：{{ player.total }}</p>
        <p
          v-show="isTarget(player.userId)"
          style="color: red;"
        >
          《目标玩家》
        </p>
      </li>
    </ul>

    <!-- 自己的游戏面板 -->
    <div>
      <div class="game-panel">
        <div>
          <p>
            {{ user.nickName }}
            <span v-show="isCurrentPlayer(user.userId)">(出牌玩家{{ waitingDefuse ? '，快出拆解啊！！' : '' }})</span>
            <span v-if="isBoomPlayer(user.userId)">~爆炸了~</span>
            <span v-if="selfGameInfo.isOver">（尸体）</span>
          </p>
          <p>手牌数：{{ selfGameInfo.total }}</p>
          <p
            v-show="isTarget(user.userId)"
            style="color: red;"
          >
            《目标玩家》
          </p>
        </div>
        <div>
          <p>正在出的牌</p>
          <p style="color: red;font-weight: bolder;">
            {{ showedCard }}
          </p>
        </div>
      </div>
      <div>
        <button
          v-show="!canShowCards && isCurrentPlayer(user.userId) && !waitingDefuse"
          @click="touchCard"
        >
          摸牌
        </button>
        <button
          v-show="canShowCards && !selfGameInfo.isOver && !favoringCard"
          @click="wantShowCard"
        >
          出牌
        </button>
        <button
          v-show="favoringCard && !selfGameInfo.isOver"
          @click="favorCard"
        >
          帮助一张牌
        </button>
      </div>
      <div>
        <div
          v-for="(card, index) in selfGameInfo.cards"
          :key="card + '-' + index"
          :class="cardClass(index)"
          @click="selectCard(card, index)"
        >
          <span style="font-weight: bolder;">{{ getCardName(card) }}</span>
          <span>[{{ getCardDesc(card) }}]</span>
        </div>
      </div>
    </div>

    <!-- 弹窗们 -->
    <div :class="`game-pop ${showPop ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 游戏信息提示弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h1>{{ popTitle }}</h1>
        <p>{{ popText }}</p>
      </div>
    </div>
    <div :class="`position-pop ${positionPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 放牌弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>请选择爆炸猫的位置</h3>
        <p>牌堆顶部为 0，牌堆底部为 {{ remain }}</p>
        <p>
          <input
            v-model.number="position"
            type="number"
            min="0"
            :max="remain"
          >
        </p>
        <button @click="setBoomPosition">
          放好了
        </button>
      </div>
    </div>
    <div :class="`nope-pop bottom-pop ${nopePopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 游戏信息提示弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>是否要出否决(5秒考虑)</h3>
        <div class="btn-group">
          <button @click="popShowNope">
            出
          </button>
          <button @click="popRefuseNope">
            不出
          </button>
        </div>
      </div>
    </div>
    <div :class="`predict-pop ${predictPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 预言卡牌弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>预言看到的小猫们</h3>
        <div>
          <div
            v-for="(card, index) in predictCards"
            :key="card + '-' + index"
            :class="cardClass(index)"
          >
            <span>{{ getCardName(card) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div :class="`target-pop ${targetPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 选择目标弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>请选择目标</h3>
        <div>
          <div
            v-for="(player) in otherPlayers"
            :key="player.userId"
            :class="isTargetPlayer(player.userId) ? 'target-player' : ''"
            @click="selectTarget(player.userId, player.isOver)"
          >
            <p>{{ getNickName(player.userId) }}</p>
            <p v-if="player.isOver">
              （不能选择尸体）
            </p>
            <p>手牌数：{{ player.total }}</p>
          </div>
        </div>
        <button
          style="margin: 0 auto;"
          @click="setTarget"
        >
          确认
        </button>
      </div>
    </div>
    <div :class="`wish-pop ${wishPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 选择想要的牌弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>请选择想要的牌</h3>
        <div>
          <div
            v-for="(card) in allCards"
            :key="card"
            :class="isWishfulCard(card) ? 'target-player' : ''"
            @click="selectWishfulCard(card)"
          >
            {{ getCardName(card) }}
          </div>
        </div>
        <button
          style="margin: 0 auto;"
          @click="setWishfulCard"
        >
          确认
        </button>
      </div>
    </div>

    <div
      v-if="isGameOver"
      class="game-over"
    >
      <h1>游戏结束</h1>
      <p>恭喜 {{ winner }} 获胜！！</p>
      <button @click="quitGame">
        离开游戏
      </button>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.other-player
  display flex
  border 1px solid red
  li
    padding 4px
    margin 6px 10px
    border-radius 3px
    background yellow
    &.origin-player
      background skyblue
.card
  padding 4px
  margin 10px
  border 1px solid skyblue
  border-radius 3px
  &.selected
    background pink
.game-panel
  display flex
  > div
    margin 4px
    border 1px solid #58bc58
.normal-pop
  box-sizing border-box
  display flex
  align-items center
  justify-content center
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(0,0,0,.5)
  animation: 1s hiddenPop 1;
  &.bottom-pop
    align-items flex-end
  .pop-content
    display flex
    flex-direction column
    align-items center
    justify-content center
    padding 20px
    background-color white
.normal-pop-hidden
  display none
.nope-pop
  .btn-group
    display flex

.target-pop
  .pop-content > div > div
    margin 5px
    border 1px solid skyblue
.target-player
  background skyblue

// 游戏结束啦
.game-over
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  padding 50px
  text-align center
  background-color white
</style>
<script type="ts"  src="./index.ts"></script>
