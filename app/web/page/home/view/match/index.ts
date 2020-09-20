import { Vue, Component, Emit } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { _session } from '@lib/storage';
import { USER_ID } from '@lib/constant';

@Component
export default class Match extends Vue {
  @State(state => state.user.user) user;
  @State(state => state.room.id) roomId;
  @State(state => state.room.masterId) masterId;
  @State(state => state.room.playerList) playerList;

  @Action('getUser') getUser;

  // 2人就可以开始游戏啦
  get canStart() {
    return this.playerList.length >= 2;
  }

  // 开始游戏按钮 class
  get startClass() {
    return `start-btn ${this.canStart ? 'active' : ''}`;
  }

  async joinRoom() {
    this.$socketServer.connect(this.user);
  }

  quitRoom() {
    console.log('>>>>> 退出匹配');
    this.$socketServer.disconnect();
  }

  // 开始游戏，房主才有开始游戏按钮
  startGame() {
    if (this.canStart) {
      console.log('开始游戏啊');
      this.$socketServer.startGame(this.playerList);
    }
  }

  isMater(id) {
    return id === this.masterId;
  }

  async mounted() {
    // 先拿用户信息
    if (!this.user.userId) {
      const userId = _session.get(USER_ID);
      await this.getUser({ id: userId });
    }
  }

  updated() {
    console.log('>>>> update', this.roomId);
  }
}