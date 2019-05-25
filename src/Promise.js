const PENDING = 'pending';
const REJECTED = 'rejected';
const FULFILLED = 'fulfilled';

function Promise(excutor) {
  let self = this;
  self.status = PENDING;
  self.value = null;
  self.fulfilledAry = [];
  self.rejectedAry = [];

  function resolve(result) {
    let timmer = setTimeout(() => {
      clearTimeout(timmer);
      if (self.status !== PENDING) {
        return;
      }
      self.status = FULFILLED;
      self.value = result;
      self.fulfilledAry.forEach(fulfilledFunc => fulfilledFunc(result));
    }, 0);
  }

  function reject(error) {
    setTimeout(() => {
      if (self.status === PENDING) {
        self.value = error;
        self.status = REJECTED;
        self.rejectedAry.forEach(rejectFunc => rejectFunc(error));
      }
    })

  }

  try {
    excutor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  typeof onFulfilled !== 'function' ? onFulfilled = (resule) => {
    this.value = resule;
    return null;
  } : null;

  typeof onRejected !== 'function' ? onRejected = (error) => {
    this.value = error;
    return null;
  } : null;

  return new Promise((resolve, reject) => {
    this.fulfilledAry.push(() => {
      try {
        let resule = onFulfilled(this.value);
        resule instanceof Promise ? resule.then(resolve, reject) : resolve(resule);
      } catch (e) {
        reject(e);
      }
    });
    this.rejectedAry.push(() => {
      try {
        let resule = onRejected(this.value);
        resule instanceof Promise ? resule.then(resolve, reject) : resolve(resule);
      } catch (e) {
        reject(e);
      }
    })
  })
}

Promise.prototype.catch = function (rejectCallBack) {
  return this.then(null, rejectCallBack);
}

module.exports = Promise;