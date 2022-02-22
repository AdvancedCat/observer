interface Listener {
    (): any
    once?: boolean
}

function isListener(fn: any): fn is Listener {
    return fn && typeof fn === 'function'
}

function isEmpty(name: string, cb: Listener) {
    return !name || !isListener(cb)
}

export class Observer {
    eventMap: Record<string, Listener[]> = {}

    private init(name: string) {
        if (!(name in this.eventMap)) {
            this.eventMap[name] = []
        }
    }

    on(name: string, cb: Listener) {
        if (isEmpty(name, cb)) return

        this.init(name)

        const callbacks = this.eventMap[name]
        if (callbacks.indexOf(cb) > -1) {
            return
        }
        callbacks.push(cb)
    }

    once(name: string, cb: Listener) {
        if (isEmpty(name, cb)) return

        cb.once = true
        this.on(name, cb)
    }

    off(name: string, cb: Listener) {
        if (isEmpty(name, cb)) return

        if (!(name in this.eventMap)) return

        const callbacks = this.eventMap[name]
        let idx = callbacks.indexOf(cb)
        if (idx === -1) {
            return
        }
        callbacks.splice(idx, 1)
    }

    emit(name: string, args = [], ctx = null) {
        if (!name) return

        if (!(name in this.eventMap)) return

        const callbacks = this.eventMap[name]
        let removes: typeof callbacks = []
        callbacks.forEach((cb) => {
            cb.apply(ctx, args as any)
            cb.once && removes.push(cb)
        })
        // 清除仅触发一次的事件
        removes.forEach((cb) => {
            this.off(name, cb)
        })
        removes.length = 0
    }

    reset() {
        Object.keys(this.eventMap).forEach((key) => {
            this.eventMap[key].length = 0
        })
        this.eventMap = {}
    }
}
