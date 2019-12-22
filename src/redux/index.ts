import { createStore } from "redux";
import rootReducer from "./reducers";

/* eslint-disable no-underscore-dangle */
export default createStore(
  rootReducer,
  //(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */