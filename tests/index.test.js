import Observer from '../src'

describe('Observer', () => {
    const evtKey = 'event-name'
    const ob = new Observer()

    let ctx = {
        count: 0,
    }
    const fn1 = function (newCount) {
        this.count = newCount
    }

    afterEach(() => {
        ctx.count = 0
    })

    afterAll(() => {
        ob.reset()
    })

    test('on', () => {
        ob.on(evtKey, fn1)
        expect(Object.keys(ob.eventMap)).toEqual([evtKey])
    })

    test('emit', () => {
        ob.emit(evtKey, [2], ctx)
        expect(ctx.count).toBe(2)
    })

    test('off', () => {
        ob.off(evtKey, fn1)
        expect(Object.keys(ob.eventMap)).toEqual([evtKey])
        expect(ob.eventMap[evtKey].length).toEqual(0)
    })

    test('reset', () => {
        ob.reset()
        expect(Object.keys(ob.eventMap)).toEqual([])
    })

    test('once', () => {
        let a = 0
        ob.once('event-name-2', function () {
            a++
        })
        ob.emit('event-name-2')
        expect(a).toBe(1)
        expect(Object.keys(ob.eventMap)).toEqual(['event-name-2'])
    })
})
