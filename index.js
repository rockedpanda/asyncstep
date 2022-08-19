/**
 * 对一组数据由多个消费者进行异步处理,并可以获取全部处理后的结果数据
 * @param {Array} list 原始数据数组
 * @param {Function} func 单条数据的处理函数,要求返回Promise对象,入参为单条数据和数据序号
 * @param {Number} startIndex 从几条数据开始启动,默认为0
 * @param {Number} workers 最大并行数量
 * @param {Boolean} autoStart 是否创建后立即启动任务
 * @return Step2Step实例, 该实例的promise属性是一个表示是否全部结束的Promise对象
 */
 function Step2Step(list, func, startIndex=0, workers=3, autoStart=false){
	this.list = list;    //待处理数据
	this.func = func;    //单个任务执行处理函数
	this.index = startIndex||0;   //当前索引
	this.workers = Math.max(1, workers);   //最大并行数量,默认为3,最小为1
	this.thread = 0;  //当前执行中任务数量
  this.ans = [];    //所有结果缓存
  let that = this;
  this.promise = new Promise(function(resolve,reject){  //整体promise对象
    that.resolve = resolve;
    that.reject = reject;
  });
  if(autoStart){  //自动开始
	  this.run();
  }
}
Step2Step.prototype.run = function(){
	this.wait = false;
	for(let i=0;i<this.workers;i++){
		this.next();
	}
};
Step2Step.prototype.next = function(){
	if(this.index >= this.list.length){
    if(this.thread===0){ //已全部结束
      this.resolve && this.resolve(this.ans);
      return;
    }
		return;
	}
	if(this.thread >= this.workers){
		//console.log('忙碌中,稍后重试');
		return;
	}
	this.goOneStep();
};
Step2Step.prototype.goOneStep = function(){
	this.thread++;
  let i = this.index;
	let data = this.list[this.index];
	this.index++;
	return this.func(data).then((ans)=>{
    this.ans[i] = ans;
		this.thread--;
		this.next();
	},(err)=>{
    console.log(err);
    this.ans[i] = null;
		this.thread--;
		this.next();
	});
};
Step2Step.prototype.pause = function(){
	this.wait = true;
	this.thread = 0;
};

module.exports = Step2Step;