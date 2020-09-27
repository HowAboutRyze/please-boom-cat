'use strict';

import { JsonProperty } from '@hubcarl/json-typescript-mapper';

export default class User {
  @JsonProperty('id')
  public id?: any;
  @JsonProperty('userId')
  public userId?: string;
  @JsonProperty('avatar')
  public avatar?: string;
  @JsonProperty('nickName')
  public nickName?: string;
  @JsonProperty('createTime')
  public createTime?: number;


  // constructor must be init everyone JsonProperty
  constructor() {
    this.id = null;
    this.userId = '';
    this.avatar = '';
    this.nickName = '';
    this.createTime = Date.now();
  }
}
