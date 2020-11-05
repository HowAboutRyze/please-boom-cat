<template>
  <div class="game-page">
    <h1 class="title">
      爆炸猫啊
      <van-button
        round
        plain
        type="warning"
        class="quit-game"
        @click="quitGame"
      >
        退出游戏
      </van-button>
    </h1>

    <!-- 别的玩家 -->
    <ul class="other-player">
      <li
        v-for="(player) in otherPlayers"
        :key="player.userId"
        :class="isOrigin(player.userId) && showedCard ? 'origin-player' : ''"
      >
        <CmpUserInfo
          :avatar="player.avatar"
          :nick-name="player.nickName"
        />
        <p>手牌数：{{ player.total }}</p>
        <p>
          <span v-show="isCurrentPlayer(player.userId)">(当前回合玩家{{ waitingDefuse ? '，等待拆解' : '' }})</span>
          <span v-if="isBoomPlayer(player.userId)">~爆炸了~</span>
          <span v-if="player.isOver">（尸体）</span>
          <span v-if="isOffline(player.status)">{{ offlineText(player.status) }}</span>
        </p>
        <p
          v-show="isTarget(player.userId)"
          style="color: red;"
        >
          《目标玩家》
        </p>
      </li>
    </ul>

    <div class="game-desk">
      <div class="desk-remain">
        剩余牌数：<span>{{ remain }}</span>
      </div>
      <div
        v-show="showedCard"
        class="desk-user"
      >
        <CmpUserInfo
          :avatar="getAvatar(gameOrigin)"
          :nick-name="getNickName(gameOrigin)"
        />
      </div>
      <p v-show="showedCard">
        =>
      </p>
      <CmpCard
        v-for="(card, index) in gameCards"
        :key="card + '-' + index"
        class="desk-card"
        :card="card"
        :is-selected="false"
      />
      <van-empty
        v-show="!showedCard"
        class="card-desk-empty"
        description="出牌区"
      />
    </div>

    <!-- 自己的游戏面板 -->
    <div class="game-panel">
      <div>
        <van-button
          v-show="!canShowCards && isCurrentPlayer(user.userId) && !waitingDefuse && !waitingNope"
          round
          type="info"
          @click="touchCard"
        >
          摸牌
        </van-button>
      </div>
      <div class="panel-user">
        <CmpUserInfo
          :avatar="user.avatar"
          :nick-name="user.nickName"
        />
        <p>手牌数：{{ selfGameInfo.total }}</p>
        <p>
          <span v-show="isCurrentPlayer(user.userId)">(当前回合玩家{{ waitingDefuse ? '，快出拆解啊！！' : '' }})</span>
          <span v-if="isBoomPlayer(user.userId)">~爆炸了~</span>
          <span v-if="selfGameInfo.isOver">（尸体）</span>
        </p>
        <p
          v-show="isTarget(user.userId)"
          style="color: red;"
        >
          《目标玩家》
        </p>
      </div>
      <div>
        <van-button
          v-show="canShowCards && !selfGameInfo.isOver && !favoringCard && !someoneFavor"
          round
          type="primary"
          @click="wantShowCard"
        >
          出牌
        </van-button>
        <van-button
          v-show="favoringCard && !selfGameInfo.isOver"
          round
          type="primary"
          @click="favorCard"
        >
          帮助一张牌
        </van-button>
      </div>
    </div>

    <div class="card-list">
      <CmpCard
        v-for="(card, index) in selfGameInfo.cards"
        :key="card + '-' + index"
        :card="card"
        :is-selected="isSelected(index)"
        @click.native="selectCard(card, index)"
      />
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
          <van-stepper
            v-model="position"
            min="0"
            :max="remain"
          />
        </p>
        <van-button
          round
          type="primary"
          @click="setBoomPosition"
        >
          放好了
        </van-button>
      </div>
    </div>
    <div :class="`nope-pop bottom-pop ${nopePopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 游戏信息提示弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>是否要出否决(5秒考虑)</h3>
        <div class="btn-group">
          <van-button
            round
            type="info"
            style="margin-right: 10px;"
            @click="popShowNope"
          >
            出
          </van-button>
          <van-button
            round
            type="warning"
            @click="popRefuseNope"
          >
            不出
          </van-button>
        </div>
      </div>
    </div>
    <div :class="`predict-pop ${predictPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 预言卡牌弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>预言看到的小猫们</h3>
        <div class="predict-list">
          <CmpCard
            v-for="(card, index) in predictCards"
            :key="card + '-' + index"
            class="predict-card"
            :card="card"
            :is-selected="false"
          />
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
            <CmpUserInfo
              :avatar="player.avatar"
              :nick-name="player.nickName"
            />
            <p v-if="player.isOver">
              （不能选择尸体）
            </p>
            <p>手牌数：{{ player.total }}</p>
          </div>
        </div>
        <van-button
          round
          type="primary"
          style="margin: 0 auto;"
          @click="setTarget"
        >
          确认
        </van-button>
      </div>
    </div>
    <div :class="`wish-pop ${wishPopShow ? 'normal-pop': 'normal-pop-hidden'}`">
      <!-- 选择想要的牌弹窗 -->
      <!-- TODO: 后面弹窗做成个组件 -->
      <div class="pop-content">
        <h3>请选择想要的牌</h3>
        <div class="wish-list">
          <div
            v-for="(card) in allCards"
            :key="card"
            :class="isWishfulCard(card) ? 'target-player' : ''"
            @click="selectWishfulCard(card)"
          >
            {{ getCardName(card) }}
          </div>
        </div>
        <van-button
          round
          type="primary"
          style="margin: 0 auto;"
          @click="setWishfulCard"
        >
          确认
        </van-button>
      </div>
    </div>

    <div
      v-if="isGameOver"
      class="game-over"
    >
      <h1>游戏结束</h1>
      <p>胜利玩家</p>
      <div class="over-user">
        <CmpUserInfo
          :avatar="winnerAvatar"
          :nick-name="winnerNickName"
        />
      </div>
      <van-button
        round
        plain
        type="warning"
        @click="quitGame"
      >
        离开游戏
      </van-button>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.title
  line-height 50px
.quit-game
  float right
.other-player
  display flex
  justify-content space-around
  flex-wrap wrap
  margin-bottom 10px
  border 1px solid red
  li
    display flex
    flex-direction column
    align-items center
    width 80px
    padding 4px
    margin 6px 10px
    box-shadow 2px 2px 10px 0 #ccc, 0 -2px 0 0 #f30
    border-radius 3px
    &.origin-player
      background skyblue
.card-list
  box-sizing border-box
  display flex
  flex-wrap wrap
  padding-right 35px
  .cmp-card
    margin-right -35px
    margin-bottom 5px
.game-desk
  position relative
  display flex
  align-items center
  justify-content space-around
  height 140px
  margin-bottom 10px
  border 1px solid pink
  .desk-card
    width 65px
    height 100px
  .desk-user
    padding 4px
    box-shadow 2px 2px 10px 0 #ccc, 0 -2px 0 0 pink
    border-radius 3px
  .desk-remain
    position absolute
    top 0
    right 5px
    span
      font-weight bolder
      color #f33
.card-desk-empty
  padding 0
  /deep/ .van-empty__image
    width 80px
    height 80px
.game-panel
  display flex
  align-items center
  height 110px
  margin-bottom 10px
  border 1px solid #58bc58
  > div
    flex 1
    display flex
    flex-direction column
    align-items center
    justify-content center
  .panel-user
    width 120px
    height 100px
    border-radius 5px
    box-shadow 2px 2px 10px 0 #ccc, 0 -2px 0 0 #58bc58
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
.position-pop
  p
    padding 10px
.nope-pop
  .btn-group
    display flex

.predict-list
  padding-top 10px
  padding-bottom 45px
  .cmp-card
    margin-bottom -45px

.target-pop
  .pop-content > div
    display flex
    flex-wrap wrap
    > div
      margin 5px
      border 1px solid skyblue
.target-player
  background skyblue

// 三张牌弹窗
.wish-list
  display flex
  flex-wrap wrap
  > div
    padding 5px
    margin 10px
    border 1px solid #58bc58

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
  > p
    margin 10px
  .over-user
    width 70px
    padding 10px 0
    margin 0 auto 10px
    border-radius 3px
    box-shadow 2px 2px 10px 0 #ccc, 0 -2px 0 0 #58bc58
</style>
<script type="ts"  src="./index.ts"></script>
