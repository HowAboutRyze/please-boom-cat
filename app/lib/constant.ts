// 约定: 常量前带着 SOCKET_ 的是 websocket 事件

/**
 * websocket 事件常量
 */
// 房间广播
export const SOCKET_ROOM_BROADCAST = 'SOCKET_ROOM_BROADCAST';
export const SOCKET_START_GAMER = 'SOCKET_START_GAMER';

/**
 * 游戏相关资料
 */
export const SOCKET_GAMER_INFO = 'SOCKET_GAMER_INFO';
export const SOCKET_GAMER_PLAY = 'SOCKET_GAMER_PLAY';
// 卡牌类型
export enum CardType {
  boom, // 炸弹, n - 1 张
  defuse, // 拆解, n + 1 张
  skip, // 跳过, 4 张
  attack, // 攻击, 4 张
  favor, // 帮助, 4 张
  shuffle, // 切洗, 4 张
  nope, // 否决, 5 张
  future, // 先知, 5 张
  tacocat, // 墨西哥卷猫, 4 张
  rainbowcat, // 彩虹呕吐猫, 4 张
  cattermelon, // 猫瓜西, 4 张
  potatocat, // 多毛土豆猫, 4 张
  beardcat, // 胡须猫, 4 张
}
// 卡牌信息
export const cardMap = {
  [CardType.boom]: {
    name: '爆炸猫',
    initNum(n) {
      return n - 1;
    },
    desc: 'boom，爆炸啦！立即展示此牌',
  },
  [CardType.defuse]: {
    name: '拆解',
    initNum: 1,
    desc: '将你最后抽到的一张牌放回抽牌堆',
  },
  [CardType.skip]: {
    name: '跳过',
    initNum: 4,
    desc: '不抽卡牌，结束你的回合',
  },
  [CardType.attack]: {
    name: '攻击',
    initNum: 4,
    desc: '结束你的回合，下家进行两回合',
  },
  [CardType.favor]: {
    name: '帮助',
    initNum: 4,
    desc: '指定一名玩家给你一张牌',
  },
  [CardType.shuffle]: {
    name: '切洗',
    initNum: 4,
    desc: '切洗牌堆',
  },
  [CardType.nope]: {
    name: '否决',
    initNum: 5,
    desc: '任意时候打出阻止另一名玩家的行动',
  },
  [CardType.future]: {
    name: '先知',
    initNum: 5,
    desc: '查看卡组顶部3张牌',
  },
  [CardType.tacocat]: {
    name: '墨西哥卷猫',
    initNum: 4,
    desc: '普通卡牌，可组成对子等特殊组合',
  },
  [CardType.rainbowcat]: {
    name: '彩虹呕吐猫',
    initNum: 4,
    desc: '普通卡牌，可组成对子等特殊组合',
  },
  [CardType.cattermelon]: {
    name: '猫瓜西',
    initNum: 4,
    desc: '普通卡牌，可组成对子等特殊组合',
  },
  [CardType.potatocat]: {
    name: '多毛土豆猫',
    initNum: 4,
    desc: '普通卡牌，可组成对子等特殊组合',
  },
  [CardType.beardcat]: {
    name: '胡须猫',
    initNum: 4,
    desc: '普通卡牌，可组成对子等特殊组合',
  },
}
