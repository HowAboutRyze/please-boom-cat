'use strict';
const path = require('path');
const resolve = filepath => path.resolve(__dirname, filepath);
module.exports = {
  entry: {
    'home/game': 'app/web/page/home/index.ts'
  },
  resolve: {
    alias:{
      '@asset': resolve('app/web/asset'),
      '@framework': resolve('app/web/framework'),
      '@component': resolve('app/web/component'),
      '@store': resolve('app/web/page/home/store'),    
      '@router': resolve('app/web/page/home/router'),        
      '@view': resolve('app/web/page/home/view')
    }
  },
  module:{
    rules:[
      { babel: false },
      { 
        ts: {
          exclude: []
        } 
      }
    ]
  },
  plugins: [
    {
      copy: [{
        from: 'app/web/asset',
        to: 'asset'
      }]
    }
  ]
};