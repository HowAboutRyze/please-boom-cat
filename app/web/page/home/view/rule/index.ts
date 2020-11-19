import { Vue, Component } from 'vue-property-decorator';
// import { State } from 'vuex-class';

@Component
export default class Rule extends Vue {
  gotoHome(): void {
    this.$router.push('/');
  }
}
