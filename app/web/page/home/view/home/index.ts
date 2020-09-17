import { Vue, Component, Emit } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import socket from '@lib/socket';

// 假数据，先顶上
const mockUserAccounts = ['123', '234', '345', '456', '456'];
const userAcount = mockUserAccounts[Math.floor(Math.random() * mockUserAccounts.length)];

@Component
export default class Home extends Vue {
  account: string = userAcount;

  @State(state => state.origin) origin;

  @State(state => state.user.user) user;

  @Action('getUser') getUser;

  async login() {
    await this.getUser({ id: this.account });
    console.log('>>>>>login:', this.user, this.$socket);
    // 登录成功后连接 websocket
    // TODO：改为点击 开始匹配 按钮再连接 websocket 好一点？
    if (!this.$socket) {
      socket.connect(this.user);
    }
  }
}