import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'cmp-pop',
})
export default class CmpPop extends Vue {
  @Prop(String) cmpClass!: string;
  @Prop(String) title!: string;
  @Prop(Boolean) isShow!: boolean;

  get className(): string[] {
    return [
      this.cmpClass,
      this.isShow ? '' : 'normal-pop-hidden',
    ];
  }
}
