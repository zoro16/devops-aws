import React from 'react'
import { shallow } from 'enzyme'
import { Widgets, mapStateToProps } from './index'

describe('Widgets Class Component', () => {
    it('should render all base children', () => {
        const client = {
            id: 'test',
            token: {
                test: 'token',
            },
        }
        const widgets = {
            list: [
                { id: '123abc', name: 'test widget', description: 'test', size: 1 },
            ],
            requesting: false,
            successful: false,
            messages: [],
            errors: [],
        }

        const rendered = shallow(
            <Widgets
              handleSubmit={() => {}}
              invalid={false}
              client={client}
              widgets={widgets}
              widgetCreate={() => {}}
              widgetRequest={() => {}}
              reset={() => {}}
              />
        )

        expect(rendered).toMatchSnapshot()
    })
    it('should render requesting message if requesting', () => {
        const client = {
            id: 'test',
            token: {
                test: 'token',
            },
        }
        const widgets = {
            list: [
                { id: '123abc', name: 'test widget', description: 'test', size: 1 },
            ],
            requesting: true,
            successful: false,
            messages: [],
            errors: [],
        }

        const rendered = shallow(
            <Widgets
              handleSubmit={() => {}}
              invalid={false}
              client={client}
              widgets={widgets}
              widgetCreate={() => {}}
              widgetRequest={() => {}}
              reset={() => {}}
              />
        )

        expect(rendered).toMatchSnapshot()
    })

    it('should render error messages if present', () => {
        const client = {
            id: 'test',
            token: {
                test: 'token',
            },
        }
        const widgets = {
            list: [
                { id: '123abc', name: 'test widget', description: 'test', size: 1 },
            ],
            requesting: false,
            successful: false,
            messages: [],
            errors: [
                { test: 'error' },
            ],
        }

        const rendered = shallow(
            <Widgets
              handleSubmit={() => {}}
              invalid={false}
              client={client}
              widgets={widgets}
              widgetCreate={() => {}}
              widgetRequest={() => {}}
              reset={() => {}}
              />
        )

        expect(rendered).toMatchSnapshot()
    })

    it('should render messages if successful and if messages are present', () => {
        const client = {
            id: 'test',
            token: {
                test: 'token',
            },
        }
        const widgets = {
            list: [
                { id: '123abc', name: 'test widget', description: 'test', size: 1 },
            ],
            requesting: false,
            successful: true,
            messages: [
                { test: 'success message' },
            ],
            errors: [],
        }

        const rendered = shallow(
            <Widgets
              handleSubmit={() => {}}
              invalid={false}
              client={client}
              widgets={widgets}
              widgetCreate={() => {}}
              widgetRequest={() => {}}
              reset={() => {}}
              />
        )

        expect(rendered).toMatchSnapshot()
    })

    it('should return false if no client is present', () => {
        const widgets = {
            list: [
                { id: '123abc', name: 'test widget', description: 'test', size: 1 },
            ],
            requesting: false,
            successful: false,
            messages: [],
            errors: [],
        }

        const rendered = shallow(
            <Widgets
              handleSubmit={() => {}}
              invalid={false}
              widgets={widgets}
              widgetCreate={() => {}}
              widgetRequest={() => {}}
              reset={() => {}}
              />
        )

        expect(rendered).toMatchSnapshot()
    })

    describe('#renderNameInput()', () => {
        let client
        let widgets
        let rendered
        let instance

        beforeEach(() => {
            client = {
                id: 'test',
                token: {
                    test: 'token',
                },
            }
            widgets = {
                list: [
                    { id: '123abc', name: 'test widget', description: 'test', size: 1 },
                ],
                requesting: false,
                successful: false,
                messages: [],
                errors: [],
            }

            rendered = shallow(
                <Widgets
                  handleSubmit={() => {}}
                  invalid={false}
                  client={client}
                  widgets={widgets}
                  widgetCreate={() => {}}
                  widgetRequest={() => {}}
                  reset={() => {}}
                  />
            )

            instance = rendered.instance()
        })

        it('should render an input with all properties', () => {
            const input = {
                test: 'property',
            }
            const type = 'text'
            const meta = {
                touched: false,
                error: false,
            }
            const props = {
                input,
                type,
                meta,
            }

            const renderNameInput = shallow(
                instance.renderNameInput(props),
            )

            expect(renderNameInput).toMatchSnapshot()
        })

        it('should render the error message if both touched and error', () => {
            const input = {
                test: 'property',
            }
            const type = 'text'
            const meta = {
                touched: true,
                error: 'error',
            }
            const props = {
                input,
                type,
                meta,
            }

            const renderNameInput = shallow(
                instance.renderNameInput(props),
            )

            expect(renderNameInput).toMatchSnapshot()
        })
    })

    describe('#submit', () => {
        let client
        let widgets
        let rendered
        let widgetCreate
        let reset

        beforeEach(() => {
            widgetCreate = jest.fn()
            reset = jest.fn()
            client = {
                id: 'test',
                token: {
                    test: 'token',
                },
            }
            widgets = {
                list: [
                    { id: '123abc', name: 'test widget', description: 'test', size: 1 },
                ],
                requesting: false,
                successful: false,
                messages: [],
                errors: [],
            }

            rendered = shallow(
                <Widgets
                  handleSubmit={() => {}}
                  invalid={false}
                  client={client}
                  widgets={widgets}
                  widgetCreate={widgetCreate}
                  widgetRequest={() => {}}
                  reset={reset}
                  />
            )
        })
        it('should call to #widgetCreate() and #reset()', () => {
            const instance = rendered.instance()
            const widget = {
                name: 'test',
                description: 'test',
                size: 1,
            }
            instance.submit(widget)
            expect(widgetCreate).toHaveBeenCalledWith(client, widget)
            expect(reset).toHaveBeenCalled()
        })
    })

    describe('#nameRequired()', () => {
        let client
        let widgets
        let rendered

        beforeEach(() => {
            client = {
                id: 'test',
                token: {
                    test: 'token',
                },
            }
            widgets = {
                list: [
                    { id: '123abc', name: 'test widget', description: 'test', size: 1 },
                ],
                requesting: false,
                successful: false,
                messages: [],
                errors: [],
            }

            rendered = shallow(
                <Widgets
                  handleSubmit={() => {}}
                  invalid={false}
                  client={client}
                  widgets={widgets}
                  widgetCreate={() => {}}
                  widgetRequest={() => {}}
                  reset={() => {}}
                  />
            )
        })

        it('should return undefined if a value is present', () => {
            const instance = rendered.instance()
            const test = instance.nameRequired('value')

            expect(test).toBe(undefined)
        })

        it('should return `Name Required` if the value is not present', () => {
            const instance = rendered.instance()
            const test = instance.nameRequired()

            expect(test).toBe('Name Required')
        })
    })

    describe('#mapStateToProps()', () => {
        it('should return the client and widgets state', () => {
            const state = {
                client: 'client',
                widgets: 'widgets',
                login: 'login',
            }
            const test = mapStateToProps(state)

            expect(test).toEqual({
                client: 'client',
                widgets: 'widgets',
            })
        })
    })
})
