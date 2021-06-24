function asyncTask(d) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(d * 10);
    }, 100);
  });
}

async function asyncMain() {
  const p = await asyncTask(10);

  console.log(p);
  // p.then(result => {
  //   console.log(result);
  // })
}

function* getTask() {
  let adj = 100;

  adj += 200;

  // 또한 getTask 바깥에서 넘겨준 값을 마치 yield가 리턴한 것처럼 받을 수도 있다.
  let input = yield 200; 
  return 300 + adj + input;
}

const g = getTask(); // 여기까지는 함수를 실행할 준비까지만 함

console.log(g.next()); // next라는 메서드로 실행
console.log(g.next(1));  // yield 바로 앞으로 돌아와서 멈춰졌던 함수의 상태를 유지하며 다음 코드 실행



function inc() {
  let i = 0;

  return () => {
    return i += 1;
  }
}

const increasement = inc();
console.log(increasement());
console.log(increasement());
console.log(increasement());
console.log(increasement());

// 위 코드를 제너레이터로 동일하게 구현할 수 있다.
function* Inc() {
  let i = 0;

  // 무한루프임에도 다음 실행 요청까지 멈춰있기 때문에 프로그램이 죽지 않는다.
  while (true) {
    yield i += 1;
  }
}

const Increament = Inc();
console.log(Increament.next().value);
console.log(Increament.next().value);
console.log(Increament.next().value);
console.log(Increament.next().value);

// 제너레이터의 핵심 - 함수 바깥쪽과 통신할 수 있다!