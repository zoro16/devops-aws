'use strict'

module.exports = function timestampMixin(Model) {
    Model.defineProperty('createdAt', {
        type: Date,
        default: '$now'
    })
    Model.defineProperty('updatedAt', {
        type: Date,
        default: '$now'
    })
}
