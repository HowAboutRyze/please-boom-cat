<template>
  <div class="game-page">
    <h1>爆炸猫啊</h1>
    <button
      @click="quitGame"
    >退出游戏</button>
    <h3>游戏已开始，牌堆剩余数量：{{remain}}</h3>
    <ul class="other-player">
      <li v-for="(player) in otherPlayers" :key="player.userId">
        <p>{{getNickName(player.userId)}}<span v-show="player.userId === currentPlayer">(出牌玩家)</span></p>
        <p>手牌数：{{player.total}}</p>
      </li>
    </ul>
    <div>
      <p>{{user.nickName}}<span v-show="user.userId === currentPlayer">(出牌玩家)</span></p>
      <p>手牌数：{{selfGameInfo.total}}</p>
      <div>
        <button v-show="!canShowCards">摸牌</button>
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
</style>
<script type="ts"  src="./index.ts"></script>
