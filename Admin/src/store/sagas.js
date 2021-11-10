import { all } from 'redux-saga/effects';

//public
import appSaga from './app/saga';
import AuthSaga from './auth/login/saga';
import LayoutSaga from './layout/saga';


export default function* rootSaga() {
    yield all([
        //public
        appSaga(),
        AuthSaga(),
        LayoutSaga()
    ])
}
