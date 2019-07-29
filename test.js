import test from 'ava'
import createStateMachine from './index.js'

function H2O () {
  return {
    initial: 'liquid',
    liquid: {
      to: 'solid',
      value: '60F'
    },
    solid: {
      to: ['gas', 'liquid'],
      value: '32F'
    },
    gas: {
      to: 'liquid',
      value: {
        temp: '212F',
        knownAs: 'steam'
      }
    }
  }
}

test('newly created instance', t => {
  const state = createStateMachine(H2O())

  t.is(state.state, 'liquid')
  t.is(state.value, '60F')
  t.true(Object.keys(state.transition).includes('toSolid'))
})

test('transition to a new state', t => {
  const state = createStateMachine(H2O())

  state.transition.toSolid()
  t.is(state.state, 'solid')
  t.is(state.value, '32F')
  t.truthy(Object.keys(state.transition))
  t.true(Object.keys(state.transition).includes('toLiquid', 'toGas'))
})

test('transition is also an object with state functions', t => {
  const state = createStateMachine(H2O())

  state.transition.toSolid()
  t.is(state.state, 'solid')
  t.is(state.value, '32F')

  state.transition.toLiquid('65F')
  t.is(state.state, 'liquid')
  t.is(state.value, '65F')
})

test('update value when transitioning', t => {
  const state = createStateMachine(H2O())

  state.transition.toSolid('30F')
  t.is(state.value, '30F')
})

test('states without to states can transition to all states', t => {
  const state = createStateMachine({
    initial: 'liquid',
    liquid: {
      freeze: 'solid',
      boil: 'gas',
      value: '60F'
    },
    solid: {
      warm: 'liquid',
      value: '32F'
    },
    gas: {
      chill: 'liquid',
      value: '212F'
    }
  })
  t.true(Object.keys(state.transition).includes('toSolid', 'toGas', 'freeze', 'boild'))

  state.transition.toGas()
  t.true(Object.keys(state.transition).includes('toLiquid', 'chill'))
  t.is(state.state, 'gas')
})
