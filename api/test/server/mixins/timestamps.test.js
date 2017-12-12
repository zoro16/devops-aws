'use strict'

const sinon = require('sinon')
const expect = require('chai').expect
const mixin = require('../../../server/mixins/timestamps.js')

describe('Timestamps Mixin', () => {
  it('should define a createdAt property', () => {
      const Model = {
          defineProperty: sinon.stub(),
      }
      mixin(Model)
      expect(Model.defineProperty.calledWith('createdAt', {
          type: Date,
          default: '$now',
      })).to.be.true
  })
  it('should define a updatedAt property', () => {
      const Model = {
          defineProperty: sinon.stub(),
      }
      mixin(Model)
      expect(Model.defineProperty.calledWith('updatedAt', {
          type: Date,
          default: '$now',
      })).to.be.true
  })

  it('should update instances updatedAt on a before save event')
  it('should update requests updatedAt on a before save event')
})
