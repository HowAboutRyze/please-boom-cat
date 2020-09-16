import { Vue, Component, Emit } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import axios from 'axios';
import socket from '@lib/socket';

@Component
export default class Home extends Vue {
  account: string = '123';

  @State(state => state.origin) origin;

  @State(state => state.user.user) user;

  @Action('getUser') getUser;

  async login() {
    await this.getUser({ id: this.account });
    console.log('>>>>>login:', this.user, this.$socket);
    if (!this.$socket) {
      socket.connect(this.user);
    }
  }
}