import { PlainObject } from 'egg';
import DB from './base';
import Condition from '../condition';
export default class Collection {
  private db: DB;
  private name: string;
  constructor(db: DB, name: string) {
    this.db = db;
    this.name = name;
  }

  public get(): any {
    return this.db.get(this.name);
  }

  public query(json: any): any {
    return this.db.query(this.name, json);
  }

  public add(json: PlainObject): any {
    return this.db.add(this.name, json);
  }

  public update(where: PlainObject, json: PlainObject): any {
    return this.db.update(this.name, where, json);
  }

  public delete(field: PlainObject): any {
    return this.db.delete(this.name, field);
  }

  public getPager(condition: Condition): any {
    return this.db.getPager(this.name, condition);
  }

  public getOrderAscByField(field: string): any {
    return this.get().orderBy(field, 'asc').value();
  }

  public getOrderDescByField(field: string): any {
    return this.get().orderBy(field, 'desc').value();
  }
}
