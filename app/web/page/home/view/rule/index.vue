<template>
  <div class="rule-page">
    <h1>
      <van-icon
        name="wap-home-o"
        class="icon-home"
        color="#58bc58"
        @click="gotoHome"
      />
      规则页
    </h1>
    <h2>游戏回合</h2>
    <p>在玩家回合内，玩家可以出牌或者不出牌，玩家抽牌则回合结束</p>
    <h2>抽到“爆炸猫”卡牌</h2>
    <p>1. 若玩家有“拆解”牌，打出“拆解”可救回自己一命，并将“爆炸猫”放回牌堆任意位置（所以爆炸猫会一直存在于牌堆中）</p>
    <p>2. 若玩家没有“拆解”牌，则该玩家爆炸，将“爆炸猫”放回牌堆任意位置</p>
    <h2>“爆炸猫”数量</h2>
    <p>玩家数 - 1</p>
    <h2>功能牌</h2>
    <p>1. 牌上写有技能的咯</p>
    <p>2. “否决”牌可在其他玩家出功能牌或特殊组合时使用</p>
    <h2>特殊组合</h2>
    <p>对子：打出对子（两张相同的牌）可偷取任意其他玩家一张牌</p>
    <p>三条：你可以指定一名玩家索要一张牌，若该玩家有你获得之；若没有，那就没有咯</p>
  </div>
</template>
<style lang="stylus" scoped>
.rule-page p {
  font-size: 14px;
}
h1 {
  text-align: center;
}
.icon-home {
  position: absolute;
  top: 5px;
  left: 10px;
}
h2, p {
  margin: 5px;
}
</style>
<script type="ts"  src="./index.ts"></script>
