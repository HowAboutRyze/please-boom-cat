import { PlainObject } from 'egg';
import Game from './game';

interface GameHash {
  [key: string]: Game;
}

class GameServer {
  public config: any;
  public gameHash: GameHash = {};

  constructor(config) {
    this.config = config;
  }

  /**
   * 新增游戏实例
   * @param game 游戏信息
   * @return new game
   */
  public addGame(game) {
    const newGame = new Game(game, this.config);
    const { id } = newGame;
    let gameInfo = this.getGameById(id);
    if (gameInfo) {
      delete this.gameHash[id];
    }
    this.gameHash[id] = newGame;
    console.log('>>>>>> gameHash:', this.gameHash);
    return newGame;
  }

  /**
   * 移除游戏实例
   * @param id
   */
  public removeGame(id) {
    delete this.gameHash[id];
    console.log('>>>>> 移除游戏', this.gameHash);
  }

  /**
   * 获取游戏实例
   * @param id
   */
  public getGameById(id) {
    return this.gameHash[id];
  }
}


export default GameServer;
