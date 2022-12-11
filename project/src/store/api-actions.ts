import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { store } from '.';
import { APIRoute, AppRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { dropToken, saveToken } from '../services/token';
import { AuthData } from '../types/auth-data';
import { Hotel, Hotels } from '../types/hotels';
import { AppDispatch, State } from '../types/state';
import { UserData } from '../types/user-data';
import { getHotel, getHotels, redirectToRoute, requireAuthorization, saveUserCredentials, setDataLoadingStatus, setError } from './action';

export const clearErrorAction = createAsyncThunk('data/clearError', () => {
  setTimeout(() => store.dispatch(setError(null)), TIMEOUT_SHOW_ERROR);
});

export const fetchHotelsAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('data/fetchHotels', async (_arg, { dispatch, extra: api }) => {
  dispatch(setDataLoadingStatus(true));
  const { data } = await api.get<Hotels>(APIRoute.Hotels);
  dispatch(getHotels(data));
  dispatch(setDataLoadingStatus(false));
});

export const fetchHotelAction = createAsyncThunk<
  void,
  number,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('data/fetchHotel', async (id, { dispatch, extra: api }) => {
  try {
    dispatch(setDataLoadingStatus(true));
    const { data } = await api.get<Hotel>(`${APIRoute.Hotels}/${id}`);
    dispatch(getHotel(data));
    dispatch(setDataLoadingStatus(false));
  } catch {
    dispatch(getHotel(null));
    dispatch(setDataLoadingStatus(false));
    dispatch(redirectToRoute(AppRoute.NotFound));
  }
});

// export const fetchNearHotelsAction = createAsyncThunk<
//   Hotels,
//   number,
//   {
//     dispatch: AppDispatch;
//     state: State;
//     extra: AxiosInstance;
//   }
// >('data/fetchHotel', async (id, { dispatch, extra: api }) => {
//   // dispatch(setDataLoadingStatus(true));
//   // const { data } = await api.get<Hotels>(`${APIRoute.Hotels}/${id}/nearby`);
//   // dispatch(getNearHotels(data));
//   // dispatch(setDataLoadingStatus(false));
// });

export const checkAuthAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  try {
    const {data} = await api.get<UserData>(APIRoute.Login);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
    dispatch(saveUserCredentials(data.email));
  } catch {
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    dispatch(saveUserCredentials(null));
  }
});

export const loginAction = createAsyncThunk<
  void,
  AuthData,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/login', async ({ email, password }, { dispatch, extra: api }) => {
  const {
    data: { token },
  } = await api.post<UserData>(APIRoute.Login, { email, password });
  saveToken(token);
  dispatch(requireAuthorization(AuthorizationStatus.Auth));
  dispatch(saveUserCredentials(email));
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/logout', async (_arg, { dispatch, extra: api }) => {
  await api.delete(APIRoute.Logout);
  dropToken();
  dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
});
