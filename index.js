import camelCase from 'lodash/camelcase'
import capitalize from 'lodash/capitalize'

export default function createStateMachine (states) {
  return {
    state: states.initial,

    states,

    get transition () {
      const fns = {}
      this._possibleStates.reduce((fns, state) => {
        fns[`to${capitalize(camelCase(state))}`] = ((to) => {
          return (updateValue) => {
            this.state = to
            if (updateValue) this.value = updateValue
          }
        })(state)
        return fns
      }, fns)
      Object.keys(this._actions).reduce((fns, action) => {
        fns[action] = ((to) => {
          return (updateValue) => {
            this.state = to
            if (updateValue) this.value = updateValue
          }
        })(this._actions[action])
        return fns
      }, fns)
      return fns
    },

    get value () {
      return this.states[this.state].value
    },

    set value (updated) {
      this.states[this.state].value = updated
    },

    get _actions () {
      const state = this.states[this.state]
      return Object.keys(state)
        .filter(p => !['value', 'to'].includes(p))
        .reduce((actions, a) => {
          actions[a] = state[a]
          return actions
        }, {})
    },

    get _possibleStates () {
      const state = this.states[this.state]
      let possible = state.to
      if (!possible || !possible.length) {
        possible = Object.values(this._actions)
      }
      if (!Array.isArray(possible)) possible = [possible]
      return possible
    }
  }
}
