// 상태를 한 곳에 모으자 - 리덕스에서는 이것을 store로 명명한다
// 그리고 접근하지 못하도록 함수로 감싸버리자
function createStore(reducer) {
  let state;
  let handler = [];
  
  reducer(state, {
    type: '@@__init__@@'
  });

  return {
    dispatch: (action) => {
      // zoo(state, action); // 하지만 이렇게 전달하더라도 결국 참조 타입이기 때문에 객체 원본을 훼손한다.
      // 그럼 복사본을 전달하자 그리고 리턴된 값으로 내 state를 덮어쓰자 (reducer라는 그럴듯한 이름을 지어보자)
      state = reducer(state, action);
      
      // 변경 될 때마다 등록된 핸들러가 있다면 실행해주자
      handler.forEach((h) => {
        h();
      })
    },
    subscribe: (listener) => {
      handler.push(listener);
    },
    getState: () => state
  }
}

const InitState = {
  type: '',
  conter: 0,
  profile: {
    id: "",
    imageURL: "",
  }
}
function reducer(state = InitState, action) {
  switch (action.type) {
    case 'counter':
      // 왜 reducer는 자기가 복사해서 돌려주면 되지 왜 쓰는 쪽에서 복사하라고 할까?
      // depth가 깊은 객체인 경우 ...를 통한 swallow 카피로는 복사 불가능
      // 아마 이런 쪽에서 리덕스가 모든 걸 책임지기엔 비용이 커서 그런 게 아닐까..
      // 그래서 2depth 이하로 설계하도록 '컨벤션' 으로 제어하고 있다.
      return {
        ...state,
        counter: action.counter
      };
    case 'action':
      return {
        ...state,
        action: action.action
      };
    default:
      // 없으면 초기값을 리턴하자
      return state;
  }
}

// store를 만들 때 관리할 상태를 전달하자
const store = createStore(reducer);

store.subscribe(() => {
  console.log('바뀌었나요');
})

// 이 dispatch로 보낼 걸 하나씩 쓰는것도 귀찮아! helper 함수로 만들자
function actionCreator(type, data) {
  return {
    type: type,
    ...data,
  }
}

function foo() {
  // store.counter = 1; // 이처럼 함수에서 직접 상태를 바꾸는 것을 불허
  // 하지만 상태를 바꾸는 코드 자체는 반드시 필요한 코드이다
  // 이 때 중요한 격언 - "코드의 형태와 위치는 달라질 수 있지만 해야하는 동작을 하는 코드 자체를 없앨 수는 없다"

  // 함수를 통해 store의 값을 바꿔달라는 요청을 보내자!
  store.dispatch(actionCreator('counter', {counter: 1}));
  store.dispatch(actionCreator('action',  {action: 'fetch'}));
}

function zoo() {
  // 그럼 store 바뀌는 거 말고 바꾼 걸 어떻게 알 수 있는데? -> 이벤트 리스너 역할을 하는 걸 붙이자
  store.dispatch(actionCreator('action', {action: "fetch"}));
}

zoo();