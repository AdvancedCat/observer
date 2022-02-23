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

/**
 * 事件观察者类
 */
export default class Observer {
    eventMap: Record<string, Listener[]> = {}

    private _init(name: string) {
        if (!(name in this.eventMap)) {
            this.eventMap[name] = []
        }
    }

    /**
     * 注册监听事件
     * @param {String} name 事件名
     * @param {Function} cb 事件回调
     * @returns Observer
     */
    on(name: string, cb: Listener) {
        if (isEmpty(name, cb)) return

        this._init(name)

        const callbacks = this.eventMap[name]
        if (callbacks.indexOf(cb) > -1) {
            return
        }
        callbacks.push(cb)
        return this
    }

    /**
     * 注册监听事件,事件回调仅触发一次
     * @param {String} name 事件名
     * @param {Function} cb 事件回调
     * @returns Observer
     */
    once(name: string, cb: Listener) {
        if (isEmpty(name, cb)) return

        cb.once = true
        this.on(name, cb)
        return this
    }

    /**
     * 注销监听事件
     * @param {String} name 事件名
     * @param {Function} cb 事件回调
     * @returns Observer
     */
    off(name: string, cb: Listener) {
        if (isEmpty(name, cb)) return

        if (!(name in this.eventMap)) return

        const callbacks = this.eventMap[name]
        let idx = callbacks.indexOf(cb)
        if (idx === -1) {
            return
        }
        callbacks.splice(idx, 1)
        return this
    }

    /**
     * 触发事件
     * @param {String} name 事件名
     * @param {Array} args 传递给回调的入参列表
     * @param ctx {Object|null} 回调绑定的上下文,默认null
     * @returns
     */
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

    /**
     * 注销所有监听事件
     */
    reset() {
        Object.keys(this.eventMap).forEach((key) => {
            this.eventMap[key].length = 0
        })
        this.eventMap = {}
    }
}
