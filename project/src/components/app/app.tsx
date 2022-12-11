import { Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import Main from '../../pages/main/main';
import NotFound from '../../pages/404/404';
import Login from '../../pages/login/login';
import Offer from '../../pages/offer/offer';
import { useAppSelector } from '../../hooks';
import LoadingScreen from '../../pages/loading-screen/loading-screen';
import browserHistory from '../../browser-history';
import HistoryRouter from '../history-route/history-route';

function App(): JSX.Element {

  const authorizationStatus = useAppSelector(
    (state) => state.authorizationStatus
  );
  const isHotelsDataLoading = useAppSelector(
    (state) => state.isHotelsDataLoading
  );

  if (
    authorizationStatus === AuthorizationStatus.Unknown ||
    isHotelsDataLoading
  ) {
    return <LoadingScreen />;
  }

  return (
    <HistoryRouter history={browserHistory}>
      <Routes>
        <Route path={AppRoute.Root} element={<Main />} />
        <Route path={AppRoute.Login} element={<Login />} />
        <Route path={AppRoute.Offer}>
          <Route index element={<NotFound />} />
          <Route
            path=':id'
            element={<Offer />}
          />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </HistoryRouter>
  );
}

export default App;
