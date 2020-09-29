import Game, { GameData } from './game';
import { SocketServerConfig } from '../model/game';

interface GameHash {
  [key: string]: Game;
}

class GameServer {
  public config: SocketServerConfig;
  public gameHash: GameHash = {};

  constructor(config: SocketServerConfig) {
    this.config = config;
  }

  /**
   * 新增游戏实例
   * @param game 游戏信息
   * @return new game
   */
  public addGame(game: GameData): Game {
    const newGame = new Game(game, this.config);
    const { id } = newGame;
    const gameInfo = this.getGameById(id);
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
  public removeGame(id: string): void {
    delete this.gameHash[id];
    console.log('>>>>> 移除游戏', this.gameHash);
  }

  /**
   * 获取游戏实例
   * @param id
   */
  public getGameById(id: string): Game {
    return this.gameHash[id];
  }
}


export default GameServer;
