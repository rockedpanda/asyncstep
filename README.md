# asyncstep
async steps for NodeJS tasks;

支持暂停和继续的异步任务队列处理,支持设置同时并发数量(默认为3);

```javascript
/**
 * 对一组数据由多个消费者进行异步处理,并可以获取全部处理后的结果数据
 * @param {Array} list 原始数据数组
 * @param {Function} func 单条数据的处理函数,要求返回Promise对象,入参为单条数据和数据序号
 * @param {Number} startIndex 从几条数据开始启动,默认为0
 * @param {Number} workers 最大并行数量
 * @param {Boolean} autoStart 是否创建后立即启动任务
 * @return AsyncStep实例, 该实例的promise属性是一个表示是否全部结束的Promise对象
 */
const tasks = new StepByStep(list, func, 0, 3, false);
task.promise.then(log,log);  //可以通过tasks的promise属性监听结束消息
task.run();    //启动
task.pause();  //暂停, 进行中的worker不会立即停止,但暂停后不会有下一个worker启动
task.run();    //启动, 如果是暂停状态则切换为正常状态
```

## install

```sh
npm install asyncstep
```
## usage

```javascript
const AsyncStep = require('asyncstep');
const log = console.log.bind(console);
//测试用数据
const list = [1,2,3,4,1,2,3,4,111,111,1111,121]
 
//单个数据的处理函数, 用随机数控制的计时器模拟异步
const dealer = function(i){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      console.log(i, new Date());
      resolve(i+100);
    },Math.random()*200>>0);
  });
}

//创建后手动启动
//var a = new StepByStep(list, dealer, 0, 3, true);
//a.promise.then(log, log);
//a.run();
//a.pause();
//a.run();

//创建后立即启动
new AsyncStep(list,dealer,0,3, true).promise.then(log,log);

```