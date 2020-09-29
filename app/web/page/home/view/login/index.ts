import { Vue, Component } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { _session } from '@lib/storage';
import { USER_ID } from '@lib/constant';

// 假数据，先顶上
const mockUserAccounts = ['123', '234', '345', '456', '456'];
const userAcount = mockUserAccounts[Math.floor(Math.random() * mockUserAccounts.length)];

@Component
export default class Home extends Vue {
  account: string = userAcount;

  userId = '';

  nickName = '';

  avatar = '';

  showLoginTab = true;

  @State(state => state.origin) origin;

  @State(state => state.user.user) user;

  @Action('getUser') getUser;

  @Action('saveUser') saveUser;

  get tab(): '注册' | '登录' {
    return this.showLoginTab ? '注册' : '登录';
  }

  async login(): Promise<void> {
    await this.getUser({ id: this.account });
    _session.set(USER_ID, this.account);
    console.log('>>>>>login:', this.user, this.$socket);
    this.$router.push(`/match`);
  }

  async register(): Promise<void> {
    const { userId, nickName, avatar } = this;
    await this.saveUser({
      userId,
      nickName,
      avatar
    });
    _session.set(USER_ID, this.userId);
    console.log('>>>>>>register', this.user);
    this.$router.push(`/match`);
  }

  changeTab() {
    this.showLoginTab = !this.showLoginTab;
  }
}
