import { Vue, Component, Prop } from 'vue-property-decorator';
// import { State } from 'vuex-class';
import { cardMap } from '../../../../../lib/constant';

@Component({
  name: 'cmp-card',
})
export default class CmpCard extends Vue {
  @Prop(Number) card!: number;
  @Prop(Boolean) isSelected!: boolean;

  get cardName(): string {
    return cardMap[this.card]?.name || '未知卡牌';
  }

  get className(): string {
    return `cmp-card cmp-card-${this.card} ${this.isSelected ? 'selected' : ''}`;
  }
}
