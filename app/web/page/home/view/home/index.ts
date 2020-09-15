import { Vue, Component, Emit } from 'vue-property-decorator';
import { State } from 'vuex-class';
import axios from 'axios';
import socket from '@lib/socket';

@Component
export default class Home extends Vue {
  account: string = '123';

  @State(state => state.origin) origin;

  async login() {
    const res = await axios.get(`${this.origin}/api/user/${this.account}`);
    console.log('>>>>>login:', res, this.$socket);
    if (!this.$socket) {
      socket.connect(res.data);
    }
  }
}