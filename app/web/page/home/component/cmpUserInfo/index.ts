import { Vue, Component, Prop } from 'vue-property-decorator';
// import { State } from 'vuex-class';

@Component({
  name: 'cmp-user-info',
})
export default class Index extends Vue {
  @Prop(String) avatar!: string;
  @Prop(String) nickName!: string;
}
