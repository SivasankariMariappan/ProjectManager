import * as actions from './geozone-detail-action'
import actionTypes from '../action-types'
import { getAPIErrorMessage } from '../utils'
import configureStore from 'redux-mock-store'
import Thunk from 'redux-thunk'
const state = {
  manageZones: {
    zone: {
      id: '123',
      zoneId: 'z123',
      type: 'type1',
      incoName: 'greenicon',
      version: 'v123',
      euid: 'euid1',
      subscriptionId: 's123',
    },
    name: 'Test name',
    radius: 500,
    category: {
      name: 'Test',
      color: 'Test',
    },
  },
}
let mockStore = configureStore([Thunk])
let store = new mockStore(state)

describe('Geozone Detail Action tests', () => {
  it('should, on nameChange invocation, issue nameEdited action', () => {
    expect(actions.onNameChange('hello')).toEqual({
      type: actionTypes.manageZones.nameEdited,
      data: 'hello',
    })
  })
  it('should create an action to MANAGE_ZONES_CREATE_ZONE_BEGIN', () => {
    const expectedAction = {
      type: actionTypes.manageZones.createZoneBegin,
      data: { latitude: 1, longitude: 1 },
    }
    expect(actions.createZoneBegin(1, 1)).toEqual(expectedAction)
  })
  it('should, on radiusChange invocation, issue radiusEdited action', () => {
    expect(actions.onRadiusChange('hello')).toEqual({
      type: actionTypes.manageZones.radiusEdited,
      data: 'hello',
    })
  })
  it('should dispatch categoryEdited action when onCategoryChange method is invoked', () => {
    const category = {
      name: 'test',
      color: 'color 1',
    }
    expect(actions.onCategoryChange(category)).toEqual({
      type: actionTypes.manageZones.categoryEdited,
      data: category,
    })
  })
  it('should dispatch userTypedCategory action when handleUserTypedCategory method is invoked', () => {
    const name = 'test'
    expect(actions.handleUserTypedCategory(name)).toEqual({
      type: actionTypes.manageZones.userTypedCategory,
      data: name,
    })
  })
  it('should, on Cancel issue cancelled event ', () => {
    const action = actions.onCancel()
    const dispatch = jest.fn()
    action(dispatch)
    expect(dispatch).toBeCalled()
    const dispatchCall1 = dispatch.mock.calls[0][0]
    expect(dispatchCall1).toEqual({
      type: actionTypes.manageZones.cancelled,
    })
  })
  it('should, able to create geozone api when not supplied', () => {
    expect(actions.getGeozoneApi()).not.toBeNull()
    expect(actions.getGeozoneApi('test')).toEqual('test')
  })
  it('should dispatch changeZonePageTab action when changeZonePageTab method is invoked', () => {
    const tabValue = 1
    expect(actions.changeZonePageTab(tabValue)).toEqual({
      type: actionTypes.manageZones.changeZonePageTab,
      data: tabValue,
    })
  })
})
describe('Geozone Detail Action - save geozone tests', () => {
  const dispatchFn = jest.fn()
  const getState = jest.fn(() => state)
  beforeEach(() => {
    dispatchFn.mockClear()
    getState.mockClear()
    store = new mockStore(state)
  })
  it('should, on Save, initiate a saveZoneBegin event', done => {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
      saveGeoZone: req => {
        return Promise.resolve({ data: [] })
      },
    }

    const expectedActions = [{ type: actionTypes.manageZones.saveZoneBegin }]
    const dispatchedStore = store.dispatch(
      actions.onSave(mockApi, {}, { friendlyName: 'gggg' })
    )
    return dispatchedStore.then(() => {
      expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
      done()
    })
  })
  it('should, on Save, call saveZone api, with name and radius', done => {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
      saveGeoZone: req => {
        expect(req).toEqual({
          id: 1,
          zoneId: 2,
          version: 3,
          friendlyName: 'gggg',
          radius: 1000,
        })
        done()
        return Promise.resolve({ data: [] })
      },
    }
    store.dispatch(
      actions.onSave(
        mockApi,
        { id: 1, zoneId: 2, version: 3 },
        { friendlyName: 'gggg', radius: 1000 }
      )
    )
  })
  it('should, on Save, call saveZone api, and raise saveZoneFailed event in case of error', done => {
    const api = {
      saveGeoZone: req => {
        return Promise.reject('Exception ')
      },
    }
    const saveAction = actions.onSave(api, {}, { friendlyName: 'gggg' })
    saveAction(dispatchFn, getState).catch(ex => {
      expect(dispatchFn.mock.calls.length).toBe(2)
      const saveZoneFailedDispatch = dispatchFn.mock.calls[1]
      expect(saveZoneFailedDispatch[0].type).toEqual(
        actionTypes.manageZones.saveZoneFailed
      )
      expect(saveZoneFailedDispatch[0].data).toEqual(getAPIErrorMessage(ex))
      done()
    })
  })
  it('should, not call SaveZoneAPI when name and radius, not modified, only category changed', async () => {
    let newState = {
      manageZones: {
        zone: {
          friendlyName: 'Test name',
          radius: 500,
        },
        friendlyName: 'Test name',
        radius: 500,
        category: {
          name: 'Test',
          color: 'Test',
        },
      },
    }
    store = new mockStore(newState)
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const expectedActions = [
      { type: actionTypes.manageZones.saveZoneBegin },
      { type: actionTypes.manageZones.createCategorySuccess },
      { type: actionTypes.manageZones.saveZoneSucceeded },
    ]
    await store.dispatch(
      actions.onSave(
        mockApi,
        {
          friendlyName: 'Test name',
          radius: 500,
        },
        { friendlyName: 'Test name', radius: 500, categoryName: 'New' }
      )
    )
    expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
    expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
    // expect(store.getActions()[2].type).toEqual(expectedActions[2].type) //TODO: This should be getting called
  })
})
describe('Geozone Detail Action - create geozone tests', () => {
  const dispatch = jest.fn()
  const getState = jest.fn(() => state)
  beforeEach(() => {
    dispatch.mockClear()
    getState.mockClear()
    store = new mockStore(state)
  })
  it('should, onCreate, issue saveZoneBegin event', done => {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
      createGeoZone: req => {
        return Promise.resolve({ data: [] })
      },
    }

    const expectedActions = [{ type: actionTypes.manageZones.saveZoneBegin }]
    const dispatchedStore = store.dispatch(actions.onCreate(mockApi, {}))
    return dispatchedStore.then(() => {
      expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
      done()
    })
  })
  it('should, on Create, call createGeoZone api, with name,radius, lat, lng', done => {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
      createGeoZone: req => {
        expect(req.friendlyName).toEqual('gggg')
        expect(req.radius).toEqual(5000)
        expect(req.latitude).toEqual(1)
        expect(req.longitude).toEqual(1)
        done()
        return Promise.resolve({ data: [] })
      },
    }
    store.dispatch(
      actions.onCreate(mockApi, {
        friendlyName: 'gggg',
        radius: 5000,
        latitude: 1,
        longitude: 1,
      })
    )
  })
  it('should, on Create, call createGeoZone api, and on success, issues saveZoneSucceeded action', async () => {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
      createGeoZone: req => {
        return Promise.resolve({ data: [] })
      },
    }

    const expectedActions = [
      { type: actionTypes.manageZones.saveZoneBegin },
      { type: actionTypes.manageZones.createCategorySuccess },
    ]
    await store.dispatch(
      actions.onCreate(mockApi, { categoryName: 'gggg', categoryColor: 'gggg' })
    )
    expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
    expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
  })
  it('should, on Create, call createGeoZone api, and on failure, issues saveZoneFailure action', done => {
    const api = {
      createGeoZone: req => {
        return Promise.reject('Create exception')
      },
    }
    const createAction = actions.onCreate(api, {})
    createAction(dispatch, getState).catch(() => {
      expect(
        dispatch.mock.calls[dispatch.mock.calls.length - 1][0].type
      ).toEqual(actionTypes.manageZones.saveZoneFailed)
      done()
    })
  })
  it('should dispatch createCategorySuccess action when invoked', function(done) {
    const category = {
      name: 'Test',
      color: 'Test',
    }
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const mockDispatch = jest.fn(action => {
      expect(action.type).toEqual(actionTypes.manageZones.createCategorySuccess)
      done()
    })
    const actionFn = actions.createGeoZoneCategory(1000, category, mockApi)
    actionFn(mockDispatch, getState)
  })
  it('should raise createCategoryFailure action when errors in createGeoZoneCategory API', function(done) {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.reject('failure')
      },
    }
    const mockDispatch = jest.fn(action => {
      expect(action.type).toEqual(actionTypes.manageZones.createCategoryFailure)
      expect(action.payload).toEqual('An unknown error has occured in API call')
      done()
    })
    const actionFn = actions.createGeoZoneCategory(1000, 'Test', mockApi)
    actionFn(mockDispatch, getState)
  })
})
describe('geozone-detail-action - categories tests - load, create, delete category tests', () => {
  const dispatch = jest.fn()
  const getState = jest.fn(() => state)
  beforeEach(() => {
    store = new mockStore(state)
    dispatch.mockClear()
    getState.mockClear()
  })
  it('should dispatch loadCategoriesSuccess action when API returns categories array', async () => {
    const mockApi = {
      getGeoZoneCategories: () => {
        return Promise.resolve([])
      },
    }
    const action = actions.loadGeoZoneCategories(mockApi)
    const mockDispatch = jest.fn()
    await action(mockDispatch)
    expect(mockDispatch.mock.calls.length).toBe(2)
    const firstAction = mockDispatch.mock.calls[0][0]
    expect(firstAction.type).toEqual(
      actionTypes.manageZones.loadCategoriesBegin
    )
    const secondAction = mockDispatch.mock.calls[1][0]
    expect(secondAction.type).toEqual(
      actionTypes.manageZones.loadCategoriesSuccess
    )
    expect(secondAction.payload).toEqual([])
  })
  it('should dispatch sorted category array when API returns categories array', async () => {
    const mockApi = {
      getGeoZoneCategories: () => {
        return Promise.resolve([
          { name: 'Ware House', color: 'Color 1' },
          { name: 'School', color: 'Color 2' },
          { name: 'Office', color: 'Color 3' },
        ])
      },
    }
    const action = actions.loadGeoZoneCategories(mockApi)
    const mockDispatch = jest.fn()
    await action(mockDispatch)
    expect(mockDispatch.mock.calls.length).toBe(2)
    const firstAction = mockDispatch.mock.calls[0][0]
    expect(firstAction.type).toEqual(
      actionTypes.manageZones.loadCategoriesBegin
    )
    const secondAction = mockDispatch.mock.calls[1][0]
    expect(secondAction.type).toEqual(
      actionTypes.manageZones.loadCategoriesSuccess
    )
    expect(secondAction.payload).toEqual([
      { label: 'Office', name: 'Office', color: 'Color 3' },
      { label: 'School', name: 'School', color: 'Color 2' },
      { label: 'Ware House', name: 'Ware House', color: 'Color 1' },
    ])
  })
  it('should dispatch loadCategoriesFailure action when API returns categories array', async () => {
    const mockApi = {
      getGeoZoneCategories: () => {
        return Promise.reject('Exception')
      },
    }
    const action = actions.loadGeoZoneCategories(mockApi)
    const mockDispatch = jest.fn()
    await action(mockDispatch)
    expect(mockDispatch.mock.calls.length).toBe(2)
    const secondAction = mockDispatch.mock.calls[1][0]
    expect(secondAction.type).toEqual(
      actionTypes.manageZones.loadCategoriesFailure
    )
    expect(secondAction.payload).toEqual(
      'An unknown error has occured in API call'
    )
  })
  it('should dispatch deleteCategorySuccess action when deleteGeoZoneCategory invoked', function(done) {
    const category = {
      name: 'Test',
      color: 'Test',
    }
    const mockApi = {
      deleteGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const mockDispatch = jest.fn(action => {
      expect(action.type).toEqual(actionTypes.manageZones.deleteCategorySuccess)
      done()
    })
    const actionFn = actions.deleteGeoZoneCategory(1000, category, mockApi)
    actionFn(mockDispatch, getState)
  })
  it('should raise deleteCategoryFailure action when errors in deleteGeoZoneCategory API', function(done) {
    const category = {
      name: 'Test',
      color: 'Test',
    }
    const mockApi = {
      deleteGeoZoneCategory: () => {
        return Promise.reject('failure')
      },
    }
    const mockDispatch = jest.fn(action => {
      expect(action.type).toEqual(actionTypes.manageZones.deleteCategoryFailure)
      expect(action.payload).toEqual('An unknown error has occured in API call')
      done()
    })
    const actionFn = actions.deleteGeoZoneCategory(1000, category, mockApi)
    actionFn(mockDispatch, getState)
  })
  it('should dispatch createGeoZoneCategory action when new category is added for zone', function(done) {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const newCategory = { name: 'category 2', color: 'color 2' }
    const expectedAction = actions.updateGeoZoneCategory(
      { category: null },
      newCategory,
      mockApi
    )
    expect(expectedAction.type).toEqual(
      actionTypes.deviceDetails.createCategorySuccess
    )
    done()
  })
  it('should dispatch createGeoZoneCategory action when existing category is replaced by new category', function(done) {
    const mockApi = {
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const newCategory = { name: 'category 2', color: 'color 2' }
    const existingCategory = [{ name: 'category 1', color: 'color 1' }]
    const expectedAction = actions.updateGeoZoneCategory(
      { categories: existingCategory },
      newCategory,
      mockApi
    )
    expect(expectedAction.type).toEqual(
      actionTypes.deviceDetails.createCategorySuccess
    )
    done()
  })
  it('should dispatch deleteGeoZoneCategory action when existing category is removed', function(done) {
    const mockApi = {
      deleteGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const newCategory = { name: '', color: '' }
    const existingCategory = [{ name: 'category 1', color: 'color 1' }]
    const expectedAction = actions.updateGeoZoneCategory(
      { categories: existingCategory },
      newCategory,
      mockApi
    )
    expect(expectedAction.type).toEqual(
      actionTypes.deviceDetails.deleteCategorySuccess
    )
    done()
  })
  it('should dispatch both delete and create GeoZoneCategory actions when existing category is replaced by new category', async () => {
    const mockApi = {
      deleteGeoZoneCategory: () => {
        return Promise.resolve()
      },
      createGeoZoneCategory: () => {
        return Promise.resolve()
      },
    }
    const newCategory = { name: 'Category 2', color: 'Color 2' }
    const existingCategory = [{ name: 'Category 1', color: 'Color 1' }]
    const expectedActions = [
      { type: actionTypes.manageZones.deleteCategorySuccess },
      {
        type: actionTypes.manageZones.createCategorySuccess,
        payload: { name: 'Category 2', color: 'Color 2', label: 'Category 2' },
      },
    ]
    await store.dispatch(
      actions.updateGeoZoneCategory(
        { categories: existingCategory },
        newCategory,
        mockApi
      )
    )
    expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions))
  })
})
describe('geozone-detail-action - categories tests - ASSOCIATE/DELETEANDADDCATEGORY/DISASSOCIATE tests', () => {
  const dispatch = jest.fn()
  const getState = jest.fn(() => state)
  beforeEach(() => {
    store = new mockStore(state)
    getState.mockClear()
    dispatch.mockClear()
  })

  it('should return ASSOCIATE when new category is added for zone', () => {
    const category = { name: 'test', color: 'test' }
    expect(actions.checkAddOrDeleteCategory([], category)).toEqual('ASSOCIATE')
  })
  it('should return DELETEANDADDCATEGORY when existing category is replaced by new category', () => {
    const newCategory = { name: 'category 2', color: 'color 2' }
    const existingCategory = [{ name: 'category 1', color: 'color 1' }]
    expect(
      actions.checkAddOrDeleteCategory(existingCategory, newCategory)
    ).toEqual('DELETEANDADDCATEGORY')
  })
  it('should return DISASSOCIATE when existing category is removed from zone', () => {
    const newCategory = { name: '', color: '' }
    const existingCategory = [{ name: 'category 1', color: 'color 1' }]
    expect(
      actions.checkAddOrDeleteCategory(existingCategory, newCategory)
    ).toEqual('DISASSOCIATE')
  })
})
