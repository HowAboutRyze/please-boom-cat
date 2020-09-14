import { Vue, Component, Emit } from 'vue-property-decorator';
import { State } from 'vuex-class';
import axios from 'axios';

@Component
export default class Home extends Vue {
  account: string = '123';

  @State(state => state.origin) origin;

  async login() {
    const res = await axios.get(`${this.origin}/api/user/${this.account}`);
    console.log('>>>>>login:', res);
  }
}