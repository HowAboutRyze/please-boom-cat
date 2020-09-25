<template>
  <div class="game-page">
    <h1>爆炸猫啊</h1>
    <button @click="quitGame">退出游戏</button>
    <h3>游戏已开始，牌堆剩余数量：{{remain}}</h3>
    <ul class="other-player">
      <li v-for="(player) in otherPlayers" :key="player.userId">
        <p>{{getNickName(player.userId)}}<span v-show="isCurrentPlayer(player.userId)">(出牌玩家{{waitingDefuse ? '，等待拆解' : ''}})</span></p>
        <p>手牌数：{{player.total}}</p>
      </li>
    </ul>
    <div>
      <p>{{user.nickName}}<span v-show="isCurrentPlayer(user.userId)">(出牌玩家{{waitingDefuse ? '，快出拆解啊！！' : ''}})</span></p>
      <p>手牌数：{{selfGameInfo.total}}</p>
      <div>
        <button v-show="!canShowCards && isCurrentPlayer(user.userId) && !waitingDefuse" @click="touchCard">摸牌</button>
        <button v-show="canShowCards" @click="wantShowCard">出牌</button>
      </div>
      <div>
        <div
          :class="cardClass(index)"
          v-for="(card, index) in selfGameInfo.cards"
          :key="card + '-' + index"
          @click="selectCard(card, index)"
        >
          <span>{{getCardName(card)}}</span>
          <span>[{{getCardDesc(card)}}]</span>
        </div>
      </div>
    </div>
    <div :class="`game-pop ${showPop ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h1>{{popTitle}}</h1>
        <p>{{popText}}</p>
      </div>
    </div>
    <div :class="`position-pop ${positionPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>请选择爆炸猫的位置</h3>
        <p>牌堆顶部为 0，牌堆底部为 {{remain}}</p>
        <p><input type="number" v-model.number="position" min="0" :max="remain" /></p>
        <button @click="setBoomPosition">放好了</button>
      </div>
    </div>
    <div class="game-over" v-if="isGameOver">
      <h1>游戏结束</h1>
      <p>恭喜 {{getNickName(currentPlayer)}} 获胜！！</p>
      <button @click="quitGame">离开游戏</button>
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
.card
  padding 4px
  margin 10px
  border 1px solid skyblue
  border-radius 3px
  &.selected
    background pink
.normal-pop
  display flex
  flex-direction column
  align-items center
  justify-content center
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(0,0,0,.5)
  animation: 1s hiddenPop 1;
  .pop-content
    display flex
    flex-direction column
    align-items center
    justify-content center
    background-color white
.normal-pop-hidden
  display none

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
