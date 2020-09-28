'use strict';
import { JsonProperty } from '@hubcarl/json-typescript-mapper';
export default class Condition {
  @JsonProperty('pageIndex')
  public pageIndex: number;
  @JsonProperty('pageSize')
  public pageSize: number;
  public where: any = {};
  public like: any = {};
  public orderByField = 'createTime';
  public orderBy = 'desc';

  constructor() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.where = {};
    this.like = {};
  }
}
