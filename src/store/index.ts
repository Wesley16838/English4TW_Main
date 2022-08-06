import { createStore, Store, applyMiddleware } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import logger from "redux-logger";
import reducer from "reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "sagas/index";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({reducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sagaMiddleware, logger])}); 

sagaMiddleware.run(rootSaga);
export default store;
