function asyncTask(dispatch) {
  // 그럼 비동기 작업이 끝난 후 reducer를 호출하는 dispatch를 받아서 결과를 전달하며 실행하자
  setTimeout(() => {
    dispatch({type: 'Ajax response'});
    // callback({type: 'Ajax response'});
  },1000);
}

function createStore(reducer, middleware = []) {
  let state = {};
  // action 객체를 받아 reducer를 호출
  let dispatch = (action) => {
    reducer(action);
  };

  let backupDispatch = dispatch;

  middleware.reverse().forEach((m) => {
    backupDispatch = m(store)(backupDispatch);
  });

  const store = {
    getState: () => {},

    dispatch: backupDispatch
  };

  return store;
}

function reducer(action) {
  // 여기서 비동기 작업 하고싶어.
  // - 리듀서는 영원히 지원 안할거야. 리듀서 밖에서 해!
  console.log(action);
}

const loggerA = dispatch => action => {
  console.log('logger A => ', action.type);
  dispatch(action);
}

const loggerB = dispatch => action => {
  console.log('logger B => ', action.type);
  dispatch(action);
}

const fetchUserInfo = store => next => action => {
  if (action.type === "fetch user info") {
    setTimeout(() => {
      next({
        type: "response user info"
      });
    }, 3000);
  } else {
    next(action);
  }

  console.log("logger B => ", action.type);
}

// const store = createStore(reducer, [loggerA, loggerB]);
const store = createStore(reducer, [fetchUserInfo]);


store.dispatch({ type: "fetch posts" });
store.dispatch({ type: "fetch user info" });