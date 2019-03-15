import actionTypes from '../action-types'
import manageZonesReducer, { initialAssetsState } from './manage-zones-reducer'
import config from '../config'

const geoZoneCategories = [
  { name: 'School', color: 'Color 1' },
  { name: 'Office', color: 'Color 2' },
  { name: 'Ware House', color: 'Color 3' },
]
const initState = {
  activeTab: 0, //0 as default index
  name: '',
  radius: config.geoZoneDetail.minRadius, //default to 10m
  category: config.geoZoneDetail.category,
  isDirty: false, //indicates if there are changes done
  isValid: false, // check if its in valid state. e.g name is not empty
  allowSave: false, //Dervied from isDirty and isValid
  errorMessage: '', //Placeholder for error message display
  zone: {},
  latitude: 0,
  longitude: 0,
  geoZoneCategories: [],
  saveInProgress: false,
  userTypedCategory: null,
  assets: initialAssetsState,
  selectedZoneAssetIDs: [],
  zoneRecipes: [],
  selectedZone: {},
  assetMessage: null,
}

describe('Manage Zones Reducer tests', () => {
  const zone = {
    friendlyName: 'originalName',
    radius: 900,
  }
  it('should, initialize state properly', () => {
    expect(manageZonesReducer()).toEqual(initState)
  })
  it('should, on editZoneBegin, set name, radius to that of zone-s name radius', () => {
    const reducedState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })
    expect(reducedState.name).toEqual(zone.friendlyName)
    expect(reducedState.radius).toEqual(zone.radius)
  })
  it('should, on nameEdited, set new name and compute isDirty, isActive and allowSave states', () => {
    const reducedState = manageZonesReducer(initState, {
      type: actionTypes.manageZones.nameEdited,
      data: 'new name',
    })
    expect(reducedState.name).toEqual('new name')
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(true)
    expect(reducedState.allowSave).toEqual(true)
  })

  it('should, on nameEdited, but name is same as original name, dont allow save', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.nameEdited,
      data: zone.friendlyName,
    })
    expect(reducedState.name).toEqual(zone.friendlyName)
    expect(reducedState.isDirty).toEqual(false)
    expect(reducedState.isValid).toEqual(true)
    expect(reducedState.allowSave).toEqual(false)
  })
  it('should, when name set to empty, dont allow save', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.nameEdited,
      data: '',
    })
    expect(reducedState.name).toEqual('')
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(false)
    expect(reducedState.allowSave).toEqual(false)
  })
  it('should, when name set to only spaces, dont allow save', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.nameEdited,
      data: ' ',
    })
    expect(reducedState.name).toEqual(' ')
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(false)
    expect(reducedState.allowSave).toEqual(false)
  })
  it('should, on radiusEdited, set new radius and compute isDirty, isActive and allowSave states', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.radiusEdited,
      data: 123,
    })
    expect(reducedState.radius).toEqual(123)
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(true)
    expect(reducedState.allowSave).toEqual(true)
  })
  it('should, on radiusEdited, when radius is null set allowSave as false', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.radiusEdited,
      data: null,
    })
    expect(reducedState.radius).toEqual(null)
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(false)
    expect(reducedState.allowSave).toEqual(false)
  })
  it('should,when radius set less than minimum, do not allow save', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.radiusEdited,
      data: 1,
    })
    expect(reducedState.radius).toEqual(1)
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(false)
    expect(reducedState.allowSave).toEqual(false)
  })
  it('should,when radius set more than maximum, do not allow save', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.radiusEdited,
      data: 11000,
    })
    expect(reducedState.radius).toEqual(11000)
    expect(reducedState.isDirty).toEqual(true)
    expect(reducedState.isValid).toEqual(false)
    expect(reducedState.allowSave).toEqual(false)
  })
})
describe('Manage Zones Reducer tests -savezone API calls', () => {
  const zone = {
    friendlyName: 'originalName',
    radius: 900,
  }

  it('should, on saveZoneFailure, set error message', () => {
    //trigger an edit with a zone
    const editState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const reducedState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.saveZoneFailed,
      data: 'Test Exception',
    })
    expect(reducedState.errorMessage).toEqual('Test Exception')
  })
  it('should, on createZoneBegin, set latitude and longitude sent and radius defaulted to minradius', () => {
    //trigger an edit with a zone
    const position = {
      lat: 10,
      lng: 100,
    }
    const reducedState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.createZoneBegin,
      data: position,
    })

    expect(reducedState.lat).toEqual(position.lat)
    expect(reducedState.lng).toEqual(position.lng)
    expect(reducedState.radius).toEqual(config.geoZoneDetail.minRadius)
  })
  it('should, on saveZoneBegin,set saveInProgress to true', () => {
    const reducedState = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.saveZoneBegin,
    })
    expect(reducedState.saveInProgress).toEqual(true)
  })
  it('should, on saveZoneSucceeded ,set saveInProgress to false', () => {
    const state = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.saveZoneSucceeded,
    })
    const reducedState = manageZonesReducer(state, {
      type: actionTypes.manageZones.saveZoneFailed,
    })
    expect(reducedState.saveInProgress).toEqual(false)
  })
  it('should, on saveZoneFailed ,set saveInProgress to false', () => {
    const state = manageZonesReducer(undefined, {
      type: actionTypes.manageZones.saveZoneBegin,
    })
    const reducedState = manageZonesReducer(state, {
      type: actionTypes.manageZones.saveZoneFailed,
    })
    expect(reducedState.saveInProgress).toEqual(false)
  })
})
describe('Manage Zones Reducer - categories tests', () => {
  it('should empty categories array in state when loadCategoriesBegin action is received', () => {
    const action = {
      type: actionTypes.manageZones.loadCategoriesBegin,
      payload: geoZoneCategories,
    }
    expect(manageZonesReducer({}, action)).toEqual({
      geoZoneCategories: [],
    })
  })
  it('should set categories array in state when loadCategoriesSuccess action is received', () => {
    const action = {
      type: actionTypes.manageZones.loadCategoriesSuccess,
      payload: geoZoneCategories,
    }
    expect(manageZonesReducer({}, action)).toEqual({
      geoZoneCategories,
    })
  })
  it('should add new category in state when createCategorySuccess is invoked', () => {
    const newCategory = {
      name: 'New Category',
      color: 'New Color',
    }
    const action = {
      type: actionTypes.manageZones.createCategorySuccess,
      payload: newCategory,
    }
    expect(manageZonesReducer({ geoZoneCategories }, action)).toEqual({
      geoZoneCategories: [...geoZoneCategories, newCategory],
    })
  })

  it('should save category details in state when categoryEdited action is dispatched', () => {
    const category = {
      name: 'test',
      color: 'test',
    }
    const action = {
      type: actionTypes.manageZones.categoryEdited,
      data: category,
    }
    const newState = manageZonesReducer(initState, action)
    expect(newState.category.name).toEqual(category.name)
    expect(newState.category.color).toEqual(category.color)
  })
  it('should save userTypedCategory Text in state when userTypedCategory action is dispatched', () => {
    const name = 'test'
    const action = {
      type: actionTypes.manageZones.userTypedCategory,
      data: name,
    }
    const newState = manageZonesReducer(initState, action)
    expect(newState.userTypedCategory).toEqual(name)
  })
  it('should save default category color when category name is removed', () => {
    const name = ''
    const action = {
      type: actionTypes.manageZones.userTypedCategory,
      data: name,
    }
    const newState = manageZonesReducer(initState, action)
    expect(newState.category.color).toEqual(
      config.geoZoneDetail.defaultCategoryColor
    )
  })
  it('should set error message in state when load category call fails', () => {
    const action = {
      type: actionTypes.manageZones.loadCategoriesFailure,
      payload: 'Error in loading categories',
    }
    expect(manageZonesReducer(initState, action).errorMessage).toEqual(
      action.payload
    )
  })
  it('should set error message in state when create category call fails', () => {
    const action = {
      type: actionTypes.manageZones.createCategoryFailure,
      payload: 'Error in loading categories',
    }
    expect(manageZonesReducer(initState, action).errorMessage).toEqual(
      action.payload
    )
  })
  it('should enable apply button while editing, when new category is selected ', () => {
    const zone = {
      friendlyName: 'test name',
      radius: 900,
      categories: [
        {
          name: 'test',
          color: 'test',
        },
      ],
    }
    const editState = manageZonesReducer(initState, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const newState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.categoryEdited,
      data: { name: 'Site', color: 'Site' },
    })
    expect(newState.category).toEqual({ name: 'Site', color: 'Site' })
    expect(newState.isDirty).toEqual(true)
    expect(newState.allowSave).toEqual(true)
  })
  it('should enable apply button to submit default category, when existing category is removed ', () => {
    const zone = {
      friendlyName: 'test name',
      radius: 900,
      categories: [
        {
          name: 'test',
          color: 'test',
        },
      ],
    }
    const editState = manageZonesReducer(initState, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const newState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.userTypedCategory,
      data: '',
    })
    expect(newState.category).toEqual(config.geoZoneDetail.category)
    expect(newState.isDirty).toEqual(true)
    expect(newState.allowSave).toEqual(true)
  })
  it('should not enable apply button when category name/color is not changed ', () => {
    const zone = {
      friendlyName: 'test name',
      radius: 900,
      categories: [
        {
          name: 'test',
          color: 'test',
        },
      ],
    }
    const editState = manageZonesReducer(initState, {
      type: actionTypes.manageZones.editZoneBegin,
      data: zone,
    })

    const newState = manageZonesReducer(editState, {
      type: actionTypes.manageZones.categoryEdited,
      data: { name: 'test', color: 'test' },
    })
    expect(newState.isDirty).toEqual(false)
    expect(newState.allowSave).toEqual(false)
  })
})
describe('Manage Zones Reducer - Edit/Delete category test suite', () => {
  const geoZoneCategories = [
    { name: 'School', color: 'Color 1', id: '1', label: 'School' },
    { name: 'Office', color: 'Color 2', id: '2', label: 'Office' },
    { name: 'Ware House', color: 'Color 3', id: '3', label: 'Ware House' },
  ]
  it('should remove the deleted category in state on deleteCategorySuccess action', () => {
    const action = {
      type: actionTypes.manageCategory.deleteCategorySuccess,
      data: '1',
    }
    expect(
      manageZonesReducer({ geoZoneCategories }, action).geoZoneCategories
    ).toEqual([
      { name: 'Office', color: 'Color 2', id: '2', label: 'Office' },
      { name: 'Ware House', color: 'Color 3', id: '3', label: 'Ware House' },
    ])
  })
  it('should add edited category in state on editCategorySuccess action', () => {
    const action = {
      type: actionTypes.manageCategory.editCategorySuccess,
      data: { name: 'Office zone', color: 'Color 4', id: '2' },
    }
    expect(
      manageZonesReducer({ geoZoneCategories }, action).geoZoneCategories
    ).toEqual([
      { name: 'Office zone', color: 'Color 4', id: '2', label: 'Office Zone' },
      { name: 'School', color: 'Color 1', id: '1', label: 'School' },
      { name: 'Ware House', color: 'Color 3', id: '3', label: 'Ware House' },
    ])
  })
  it('should add new category in state on editCategorySuccess action', () => {
    const action = {
      type: actionTypes.manageCategory.editCategorySuccess,
      data: { name: 'Central Storage', color: 'Color 2', id: '4' },
    }
    expect(
      manageZonesReducer({ geoZoneCategories }, action).geoZoneCategories
    ).toEqual([
      {
        name: 'Central Storage',
        color: 'Color 2',
        id: '4',
        label: 'Central Storage',
      },
      { name: 'Office', color: 'Color 2', id: '2', label: 'Office' },
      { name: 'School', color: 'Color 1', id: '1', label: 'School' },
      { name: 'Ware House', color: 'Color 3', id: '3', label: 'Ware House' },
    ])
  })
  it('should set activeTab in state when changeZoneTab action is invoked', () => {
    const action = {
      type: actionTypes.manageZones.changeZonePageTab,
      data: 1,
    }
    expect(manageZonesReducer({ activeTab: 0 }, action).activeTab).toEqual(1)
  })
  it('should set category of editing zone on updateViewingZoneCategory action invocation', () => {
    const zone = {
      friendlyName: 'test name',
      radius: 900,
      categories: [
        {
          name: 'test',
          color: 'test',
        },
      ],
      category: { name: 'test', color: 'test' },
    }
    const newCategory = { name: 'New category', color: 'New color' }
    const action = {
      type: actionTypes.manageZones.updateViewingZoneCategory,
      data: newCategory,
    }
    expect(manageZonesReducer({ zone }, action).category).toEqual(newCategory)
  })
})
describe('Manage Zones Reducer - cancel, reset actions', () => {
  it('should on resetAction, reset state to initial state', () => {
    const action = {
      type: actionTypes.manageZones.resetZone,
    }
    expect(manageZonesReducer({}, action)).toEqual(initState)
  })
})

describe('Manage Zones Reducer - loadZoneAssets tests', () => {
  it('should, on loadZoneAssets begin, clear list, message fields', () => {
    const action = {
      type: actionTypes.manageZones.loadZoneAssetsBegin,
    }
    expect(manageZonesReducer({}, action).assets.list).toEqual([])
    expect(manageZonesReducer({}, action).assets.allDevices).toEqual([])
    expect(manageZonesReducer({}, action).assets.message).toEqual(null)
  })
  it('should, on loadZoneAssetsSucceed, load payload to list and clear message', () => {
    const results = [{ deviceFriendlyName: 'x' }, { deviceFriendlyName: 'Y' }]
    const count = results.count
    const action = {
      type: actionTypes.manageZones.loadZoneAssetsSucceeded,
      payload: { results, count },
    }
    const newState = manageZonesReducer(
      {
        assets: {
          page: 0,
          pageSize: 1,
          sort: { id: 'deviceFriendlyName', desc: false },
        },
      },
      action
    )
    expect(newState.assets.allDevices).toEqual(results) //all assets
    expect(newState.assets.list.length).toEqual(1) //only the page size
    expect(newState.assets.total).toEqual(count)
  })
  it('should, on loadZoneAssetsFailed, load payload to error message', () => {
    const action = {
      type: actionTypes.manageZones.loadZoneAssetsFailed,
      payload: 'An error occurred',
    }
    expect(manageZonesReducer({}, action).assets.list).toEqual([])
    expect(manageZonesReducer({}, action).assets.allDevices).toEqual([])
    expect(manageZonesReducer({}, action).assets.message).toEqual(
      'An error occurred'
    )
  })
})
describe('tab change', () => {
  it('should handle MANAGE_ZONES_CHANGE_TAB', () => {
    const action = {
      type: actionTypes.manageZones.changeTab,
      payload: 1,
    }
    expect(manageZonesReducer({}, action)).toEqual({ activeTab: 1 })
  })
})
describe('manage zones reducer - update selected zoneID test suite', () => {
  it('should set SelectedZoneAssetIDs, when updateSelectedZoneAssetIDs action is invoked', () => {
    const selectedZoneAssetIDs = ['1', '2', '3']
    const action = {
      type: actionTypes.manageZones.updateSelectedZoneAssetIDs,
      payload: selectedZoneAssetIDs,
    }
    expect(manageZonesReducer({}, action).selectedZoneAssetIDs).toEqual(
      selectedZoneAssetIDs
    )
  })
  it('should empty SelectedZoneAssetIDs, when resetSelectedZoneAssetIDs action is invoked', () => {
    const selectedZoneAssetIDs = ['1', '2', '3']
    const action = {
      type: actionTypes.manageZones.resetSelectedZoneAssetIDs,
    }
    expect(
      manageZonesReducer({ selectedZoneAssetIDs }, action).selectedZoneAssetIDs
        .length
    ).toBe(0)
  })
  it('should reset selectedZoneAssetIDs and set success message when removeAssetsFromZoneSucceeded action is invoked', () => {
    const selectedZoneAssetIDs = ['1', '2', '3']
    const action = {
      type: actionTypes.manageZones.removeAssetsFromZoneSucceeded,
    }
    expect(
      manageZonesReducer({ selectedZoneAssetIDs }, action).selectedZoneAssetIDs
        .length
    ).toBe(0)
    expect(
      manageZonesReducer({ selectedZoneAssetIDs }, action).assetMessage
    ).toBe(config.geoZoneDetail.geozoneAssets.removeAssetsSuccessMessage)
  })
  it('should set zoneRecipes, when loadZoneRecipesSucceeded action is invoked', () => {
    const zoneRecipes = [
      { recipeId: '1' },
      { recipeId: '2' },
      { recipeId: '3' },
    ]
    const action = {
      type: actionTypes.manageZones.loadZoneRecipesSucceeded,
      payload: zoneRecipes,
    }
    expect(manageZonesReducer({}, action).zoneRecipes).toEqual(zoneRecipes)
  })
  it('should set selectedZone to which assets are moved, when saveSelectedZone action is invoked', () => {
    const selectedToZone = {
      id: 'zone 3',
      name: 'Test',
    }
    const action = {
      type: actionTypes.manageZones.saveSelectedZone,
      payload: selectedToZone,
    }
    expect(manageZonesReducer({}, action).selectedZone).toEqual(selectedToZone)
  })
  it('should reset selectedZoneAssetIDs and set success message when moveAssetsToNewZoneSucceeded action is invoked', () => {
    const selectedZoneAssetIDs = ['1', '2', '3']
    const action = {
      type: actionTypes.manageZones.moveAssetsToNewZoneSucceeded,
    }
    expect(
      manageZonesReducer({ selectedZoneAssetIDs }, action).selectedZoneAssetIDs
        .length
    ).toBe(0)
    expect(
      manageZonesReducer({ selectedZoneAssetIDs }, action).assetMessage
    ).toBe(config.geoZoneDetail.geozoneAssets.moveAssetsSuccessMessage)
  })
  it('should set failure message in state, when removeAssetsFromZone action fails', () => {
    const errorMessage = 'Remove Assets from zone failed'
    const action = {
      type: actionTypes.manageZones.removeAssetsFromZoneFailed,
      payload: errorMessage,
    }
    expect(manageZonesReducer({}, action).assetMessage).toEqual(errorMessage)
  })
  it('should set failure message in state, when moveAssetsToNewZoneFailed action fails', () => {
    const errorMessage = 'Move assets to new zone failed'
    const action = {
      type: actionTypes.manageZones.moveAssetsToNewZoneFailed,
      payload: errorMessage,
    }
    expect(manageZonesReducer({}, action).assetMessage).toEqual(errorMessage)
  })
})
describe('manage zones reducer - handleZoneAssetsPaginationSortChange tests', () => {
  it('should on pagination, sort changes handle and generate new list', () => {
    const devices = [
      { deviceFriendlyName: 'X' },
      { deviceFriendlyName: 'Y' },
      { deviceFriendlyName: 'Z' },
    ]

    const paginationSortConfig = {
      page: 0,
      pageSize: 1,
      sort: { id: 'deviceFriendlyName', desc: true },
    }
    const state = {
      assets: {
        allDevices: [...devices],
        list: [],
        ...paginationSortConfig,
      },
    }
    const action = {
      type: actionTypes.manageZones.handleZoneAssetsPaginationSortChange,
      payload: paginationSortConfig,
    }
    const assets = manageZonesReducer(state, action).assets
    expect(assets.allDevices.length).toEqual(devices.length)
    expect(assets.allDevices[0]).toEqual(devices[devices.length - 1]) //sorted to have last as one
    expect(assets.list.length).toEqual(1) //pagesize
    expect(assets.list[0]).toEqual(devices[devices.length - 1]) //pagesize
  })
})
