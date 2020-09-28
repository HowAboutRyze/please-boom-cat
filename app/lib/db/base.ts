'use strict';
import Condition from '../condition';
import * as shortid from 'shortid';
import { PlainObject } from 'egg';

export default abstract class DB {
  public instance: any;
  public name: string;
  constructor(name = 'game.json') {
    this.name = name;
  }

  public getUniqueId() {
    return shortid.generate();
  }

  public abstract get(collectionName: string): void;

  public abstract query(collectionName: string, json: PlainObject): void;

  public abstract add(collectionName: string, json: PlainObject): void;

  public abstract update(collectionName: string, where: PlainObject, json: PlainObject): void;

  public abstract delete(collectionName: string, field: any): void;

  public abstract getPager(collectionName: string, condition: Condition): void;
}
