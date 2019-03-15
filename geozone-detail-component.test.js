import React from 'react'
import { mount } from 'enzyme'
import GeozoneDetailComponent from './geozone-detail-component'
import config from '../config'
const geozoneConfig = config.geoZoneDetail

let wrapper
let mockOnCreate = jest.fn()
let mockOnSave = jest.fn()
let mockOnCancel = jest.fn()
let mockOnRadiusUpdate = jest.fn()
let mockOnCategoryUpdate = jest.fn()

const getBasicShallowMock = () => {
  jest.restoreAllMocks()
  wrapper = mount(
    <GeozoneDetailComponent
      reverseGeocode={jest.fn()}
      onCreate={mockOnCreate}
      onSave={mockOnSave}
      onCancel={mockOnCancel}
      onRadiusUpdate={mockOnRadiusUpdate}
      onCategoryUpdate={mockOnCategoryUpdate}
    />
  )
}

describe('Geozone Detail Component test suite', () => {
  it('should, render HTML', () => {
    wrapper = mount(<GeozoneDetailComponent reverseGeocode={jest.fn()} />)
    expect(wrapper.html()).not.toBeNull()
  })
  it('should set category to default value when not provided', () => {
    wrapper = mount(<GeozoneDetailComponent reverseGeocode={jest.fn()} />)
    expect(
      wrapper
        .find('.geozone-category-component')
        .first()
        .props().category
    ).toEqual({
      name: geozoneConfig.category.name,
      color: geozoneConfig.category.color,
    })
  })
  it('should set category when provided', () => {
    wrapper = mount(
      <GeozoneDetailComponent
        reverseGeocode={jest.fn()}
        zone={{ categories: [{ name: 'gggg', color: 'pppp' }] }}
      />
    )
    expect(
      wrapper
        .find('.geozone-category-component')
        .first()
        .props().category
    ).toEqual({
      name: 'gggg',
      color: 'pppp',
    })
  })
})
describe('form properties', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    getBasicShallowMock()
  })
  it('should display Apply on the submit button while the form is not submitting', () => {
    expect(
      wrapper
        .find('.submit-button')
        .first()
        .props().children
    ).toBe('Apply')
  })
  it('should display Applying... on the submit button while the form is submitting', () => {
    wrapper.setProps({ saveInProgress: true })
    expect(
      wrapper
        .find('.submit-button')
        .first()
        .props().children
    ).toBe('Applying...')
  })
  it('should disable the submit button if the form is submitting', () => {
    const submitButton = wrapper.find('.submit-button').first()
    wrapper.setProps({ saveInProgress: true })
    expect(submitButton.props().disabled).toBe(true)
  })
  it('should disable the submit button if the form is invalid', done => {
    wrapper
      .find('input[name="friendlyName"]')
      .first()
      .simulate('change', {
        persist: jest.fn(),
        target: { name: 'friendlyName', value: '***&&^^%%%' },
      })

    setTimeout(() => {
      wrapper.update()
      expect(
        wrapper
          .find('.submit-button')
          .first()
          .props().disabled
      ).toBe(true)
      done()
    }, 0)
  })
  it('should display radius in radius input if valid', done => {
    wrapper
      .find('.radius-slider')
      .first()
      .props()
      .onChange({}, 1000)
    setTimeout(() => {
      wrapper.update()
      expect(
        wrapper
          .find('.slider-value-input')
          .first()
          .props().value
      ).toBe('1,000')
      done()
    }, 0)
  })
  it('should display nothing in radius input if radius is 0', done => {
    wrapper
      .find('.radius-slider')
      .first()
      .props()
      .onChange({}, 0)
    setTimeout(() => {
      wrapper.update()
      expect(
        wrapper
          .find('.slider-value-input')
          .first()
          .props().value
      ).toBe('')
      done()
    }, 0)
  })
  it('should display an error message for category name', () => {})
})
describe('prop invocations', () => {
  beforeEach(() => {
    getBasicShallowMock()
  })
  it('should invoke on cancel when cancel button is clicked', () => {
    wrapper
      .find('.cancel-button')
      .first()
      .simulate('click')
    expect(mockOnCancel).toBeCalled()
  })
  it('should invoke onSave when handleSubmit is called and there is a zone', () => {
    wrapper.setProps({ zone: { id: 1 } })
    wrapper.instance().handleSubmit({ gggg: 'gggg' })
    expect(mockOnSave).toBeCalledWith({ gggg: 'gggg' })
  })
  it('should inboke onCreate and apply lat & long values to payload when handleSubmit is called and there is not a zone', () => {
    wrapper.setProps({ latitude: 1, longitude: 1 })
    wrapper.instance().handleSubmit({ gggg: 'gggg' })
    expect(mockOnCreate).toBeCalledWith({
      gggg: 'gggg',
      latitude: 1,
      longitude: 1,
    })
  })
  it('should invoke onRadiusUpdate when handleSliderChange is called', () => {
    wrapper.instance().handleSliderChange(10, jest.fn())
    expect(mockOnRadiusUpdate).toBeCalledWith(10)
  })
  it('should invoke onCategoryUpdate when handleCategoryChange is called', () => {
    wrapper
      .instance()
      .handleCategoryChange('gggg', 'pppp', jest.fn(), jest.fn())
    expect(mockOnCategoryUpdate).toBeCalledWith({ name: 'gggg', color: 'pppp' })
  })
})
describe('Handle Slider Change', () => {
  let spy
  beforeEach(() => {
    getBasicShallowMock()
    spy = jest.spyOn(wrapper.instance(), 'handleSliderChange')
  })
  it('should set the value of slider-value-input to radius if it exists', () => {
    expect(
      wrapper
        .find('.slider-value-input')
        .first()
        .props().value
    ).toBe('10')
  })
  it('should call handleSliderChange when the slider is changed', () => {
    wrapper
      .find('.radius-slider')
      .first()
      .props()
      .onChange({}, 10)
    expect(spy).toBeCalledWith(10, expect.any(Function))
  })
  it('should call handleSliderChange when the slider value input is changed', () => {
    wrapper
      .find('.slider-value-input')
      .first()
      .props()
      .onChange({ target: { value: '10' } })
    expect(spy).toBeCalledWith(10, expect.any(Function))
  })
  it('should not invoke handleSliderChange when handleRadiusTextChange is called with NaN', () => {
    wrapper.instance().handleRadiusTextChange('gggg', jest.fn())
    expect(spy).not.toBeCalled()
  })
  it('should not invoke handleSliderChange when handleRadiusTextChange is called with a number greater than max radius', () => {
    wrapper
      .instance()
      .handleRadiusTextChange(
        (geozoneConfig.maxRadius + 1).toString(),
        jest.fn()
      )
    expect(spy).not.toBeCalled()
  })
  it('should invoke handleSliderChange when handleRadiusTextChange is called with null', () => {
    const mockFn = jest.fn()
    wrapper.instance().handleRadiusTextChange('', mockFn)
    expect(spy).toBeCalledWith(0, mockFn)
  })
  it('should invoke handleSliderChange when handleRadiusTextChange is called with a value < max radius and invoke setFieldValue for attributes', () => {
    const mockFn = jest.fn()
    wrapper.instance().handleRadiusTextChange('100', mockFn)
    expect(spy).toBeCalledWith(100, mockFn)
    expect(mockFn.mock.calls.length).toBe(2)
    expect(mockFn.mock.calls[0]).toEqual(['radius', 100])
    expect(mockFn.mock.calls[1]).toEqual(['radiusText', 100])
  })
})
describe('Handle Radius Text Change', () => {
  let spy
  beforeEach(() => {
    getBasicShallowMock()
    spy = jest.spyOn(wrapper.instance(), 'handleRadiusTextChange')
  })
  it('should invoke handleRadiusTextChange when the radius value input is changed', () => {
    wrapper
      .find('.slider-value-input')
      .first()
      .props()
      .onChange({ target: { value: 'gggg' } })
    expect(spy).toBeCalledWith('gggg', expect.any(Function))
  })
})
describe('Handle Category Change', () => {
  let spy
  beforeEach(() => {
    getBasicShallowMock()
    spy = jest.spyOn(wrapper.instance(), 'handleCategoryChange')
  })
  it('should call handleCategoryChange when handleCategoryChange or handleUserTypedCategory of GeoZoneCategoryComponent is invoked', () => {
    const geozoneCategoryProps = wrapper
      .find('.geozone-category-component')
      .first()
      .props()
    geozoneCategoryProps.handleCategoryChange('gggg', 'pppp')
    geozoneCategoryProps.handleUserTypedCategory('vvvv')
    expect(spy.mock.calls.length).toBe(2)
    expect(spy.mock.calls[0]).toEqual([
      'gggg',
      'pppp',
      expect.any(Function),
      expect.any(Function),
    ])
    expect(spy.mock.calls[1]).toEqual([
      'vvvv',
      geozoneConfig.defaultCategoryColor,
      expect.any(Function),
      expect.any(Function),
    ])
  })
  it('should invoke setFieldValue and setFieldTouched for category fields when handleCategoryChange is called', () => {
    const mockSetFieldValue = jest.fn()
    const mockSetFieldTouched = jest.fn()
    wrapper
      .instance()
      .handleCategoryChange(
        'gggg',
        'pppp',
        mockSetFieldValue,
        mockSetFieldTouched
      )
    expect(mockSetFieldValue.mock.calls.length).toBe(2)
    expect(mockSetFieldValue.mock.calls[0]).toEqual(['categoryName', 'gggg'])
    expect(mockSetFieldValue.mock.calls[1]).toEqual(['categoryColor', 'pppp'])
    expect(mockSetFieldTouched.mock.calls.length).toBe(2)
    expect(mockSetFieldTouched.mock.calls[0]).toEqual(['categoryName'])
    expect(mockSetFieldTouched.mock.calls[1]).toEqual(['categoryColor'])
  })
})
describe('Handle Name Change', () => {
  let spy
  beforeEach(() => {
    getBasicShallowMock()
    spy = jest.spyOn(wrapper.instance(), 'handleNameChange')
  })
  it('should invoke handleNameChange on friendlyName input change', () => {
    wrapper
      .find('.friendly-name')
      .first()
      .props()
      .onChange({ target: { value: 'gggg' } })
    expect(spy).toBeCalledWith(
      { target: { value: 'gggg' } },
      expect.any(Function),
      expect.any(Function)
    )
  })
  it('should handleChange and setFieldTouched when called', () => {
    const mockHandleChange = jest.fn()
    const mockSetFieldTouched = jest.fn()
    wrapper
      .instance()
      .handleNameChange(
        { target: { value: 'gggg' } },
        mockHandleChange,
        mockSetFieldTouched
      )
    expect(mockHandleChange).toBeCalledWith({ target: { value: 'gggg' } })
    expect(mockSetFieldTouched).toBeCalledWith('friendlyName')
  })
})
