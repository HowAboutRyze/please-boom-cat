import { Vue, Component, Prop } from 'vue-property-decorator';
import Index from './index.vue';
@Component({
  name: 'Layout',
  components: {
    Index
  }
})
export default class Layout extends Vue {
  @Prop({ type: String, default: 'Please Boom' }) title?: string;
  @Prop({ type: String, default: 'Boom cat' }) description?: string;
  @Prop({ type: String, default: 'boom, cat' }) keywords?: string;

  isNode: boolean = EASY_ENV_IS_NODE;

  get socketIoScript() {
    return '<script src="/public/asset/js/socket.io.slim.js"></script>';
  }

  created() {
    console.log('>>EASY_ENV_IS_NODE create', EASY_ENV_IS_NODE);
  }
}
