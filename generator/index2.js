function asyncTask(d) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(d * 10);
    }, 100);
  });
}

async function asyncMain() {
  const result1 = await asyncTask(10);
  const result2 = await asyncTask(10);
}

function* gTask() {
  const result = yield asyncTask(10);

  console.log('gtask =>', result);
}

// react saga가 이런 runner의 역할을 한다
async function runner() {
  const it = gTask();
  let result = it.next();
  
  while(!result.done) {
    // promise 객체일 때만 다음 함수를 실행
    if (result.value instanceof Promise) {
      result = it.next(await result.value);
    }
  }
}

runner();

// 개발용어
// dispatch - 컴퓨터 용어로는 명령어를 가져와서 실행시킬 수 있게 해주는 단계를 의미한다.
// dispatcher - 어플리케이션과 어플리케이션간 전환될 때 context를 전환시켜줌
// fork - 프로세스 복제