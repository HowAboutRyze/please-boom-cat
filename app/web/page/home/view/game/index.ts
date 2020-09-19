import { Vue, Component, Emit } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import socket from '@lib/socket';
import { _session } from '@lib/storage';
import { USER_ID } from '@lib/constant';

@Component
export default class Game extends Vue {
  @State(state => state.user.user) user;

  @Action('getUser') getUser;

  async startGame() {
    // TODO：改为点击 开始匹配 按钮再连接 websocket 好一点？
    if (!this.$socket) {
      socket.connect(this.user);
    }
  }

  async mounted() {
    // 先拿用户信息
    if (!this.user.userId) {
      const userId = _session.get(USER_ID);
      await this.getUser({ id: userId });
    }
  }
}