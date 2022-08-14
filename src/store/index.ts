import { createStore, Store, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import reducer from "reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "sagas/index";

const sagaMiddleware = createSagaMiddleware();

// export const store = configureStore({
//   reducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }).concat([sagaMiddleware, logger]),
// });

export const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
