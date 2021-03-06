import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IGateway, defaultValue } from 'app/shared/model/gateway.model';
import { IDevice } from 'app/shared/model/device.model';

const initialState: EntityState<IGateway> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  devices: [],
  devicesLoading: false,
};

const apiUrl = 'api/gateways';

// Actions

export const getEntities = createAsyncThunk('gateway/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`;
  return axios.get<IGateway[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'gateway/fetch_entity',
  async (id: string) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IGateway>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const getDevices = createAsyncThunk(
  'gateway/fetch_devices',
  async (id: string) => {
    const requestUrl = `${apiUrl}/${id}/devices`;
    return axios.get<IDevice>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'gateway/create_entity',
  async (entity: IGateway, thunkAPI) => {
    const result = await axios.post<IGateway>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'gateway/update_entity',
  async (entity: IGateway, thunkAPI) => {
    const result = await axios.put<IGateway>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  'gateway/partial_update_entity',
  async (entity: IGateway, thunkAPI) => {
    const result = await axios.patch<IGateway>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'gateway/delete_entity',
  async (id: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IGateway>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const GatewaySlice = createEntitySlice({
  name: 'gateway',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(getDevices.pending, state => {
        state.devicesLoading = true;
      })
      .addCase(getDevices.fulfilled, (state, action) => {
        state.devicesLoading = false;
        state.devices = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = GatewaySlice.actions;

// Reducer
export default GatewaySlice.reducer;
