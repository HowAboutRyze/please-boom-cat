<template>
  <div class="game-page">
    <h1>爆炸猫啊</h1>
    <button
      @click="quitGame"
    >退出游戏</button>
    <h3>游戏已开始，牌堆剩余数量：{{remain}}</h3>
    <ul>
      <li v-for="(player) in otherPlayers" :key="player.userId">
        <p>{{getNickName(player.userId)}}<span v-show="player.userId === currentPlayer">(出牌玩家)</span></p>
        <p>手牌数：{{player.total}}</p>
      </li>
    </ul>
    <div>
      <p>{{user.nickName}}<span v-show="user.userId === currentPlayer">(出牌玩家)</span></p>
      <p>手牌数：{{selfGameInfo.total}}</p>
      <div>
        <div class="card" v-for="(card, index) in selfGameInfo.cards" :key="index">
          <span>{{getCardName(card)}}</span>
          <span>[{{getCardDesc(card)}}]</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  padding: 4px;
  margin: 10px;
  border: 1px solid skyblue;
  border-radius: 3px;
}
</style>
<script type="ts"  src="./index.ts"></script>
