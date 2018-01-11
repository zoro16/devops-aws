'use strict'

const sinon = require('sinon')
const expect = require('chai').expect
const utils = require('../../../../server/mixins/utils')


describe('utils functions ', () => {
    describe('updateTimestamps()', () => {
        it('should update `updatedAt` on an instance', () => {
            const context = {
                instance: {}
            }
            const next = sinon.stub()
            utils.updateTimestamps(context, next)
            expect(context.instance.updatedAt).to.be.an.instanceof(Date)
            expect(next.called).to.be.true
        })
        it('should update `updatedAt` on many data', () => {
            const context = {
                data: {}
            }
            const next = sinon.stub()

            utils.updateTimestamps(context, next)
            expect(context.data.updatedAt).to.be.an.instanceof(Date)
            expect(next.called).to.be.true
        })
    })
})
