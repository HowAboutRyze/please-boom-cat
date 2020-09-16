'use strict';

import { JsonProperty } from '@hubcarl/json-typescript-mapper';

export default class User {
  @JsonProperty('socket')
  public socket?: any;
  @JsonProperty('userId')
  public userId?: string;
  @JsonProperty('socketId')
  public socketId: string;
  @JsonProperty('avatar')
  public avatar?: string;
  @JsonProperty('nickName')
  public nickName?: string;
  

  // constructor must be init everyone JsonProperty
  constructor() {
    this.socket = {};
    this.userId = '';
    this.socketId = '';
    this.avatar = '';
    this.nickName = '';
  }
}