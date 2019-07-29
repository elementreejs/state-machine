# @elementree/state-machine
FSM (Finite State Machine) state factory for use with Elementree

## Example

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { html, merge, prepare, render } from 'https://unpkg.com/elementree'
      import createStateMachine from 'https://unpkg.com/@elementree/state-machine'

      const StateMachine = createStateMachine({
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
          value: '212F'
        }
      })

      function View (state) {
        return render`
          <body>
            <p>${state.state} ${state.value}</p>
            ${Object.keys(state.transition).map(t => {
              return render`<button onclick=${onClick(t)}>${t}</button>`
            })}
          </body>
        `

        function onClick (to) {
          return () => state.transition[to]()
        }
      }

      merge('body', prepare(View, StateMachine))
    </script>
  </body>
</html>
```

## API

```js
import createStateMachine from 'https://unpkg.com/@elementree/state-machine'
```

**`createStateMachine(states: Object) -> Object`**

To create an instance of a StateMachine pass a 'states' object. A valid 'states' object must have, at a minimum, a single state. And an `initial` property which is set to a valid state property.

There are two types of machine definitions: "active" and "passive". If the definition includes names for each valid transition it is an "active" definition and the `transition` property will include active functions (like `freeze()` and `boil()`). An example of an "active" definition is:

```js
createStateMachine({
  initial: 'liquid',
  liquid: {
    freeze: 'solid',
    boil: 'gas',
    value: '60F'
  },
  solid: {
    melt: 'liquid',
    value: '32F'
  },
  gas: {
    chill: 'liquid'
    value: '212F'
  }
})
```

A "passive" definition uses the `to` property on each state indicating one or more valid states the current state can transition to. For a "passive" definition, the `transition` property will only include "passive" functions (like `toSolid` and `toGas`). An example of an "passive" definition is:

```js
createStateMachine({
  initial: 'liquid',
  liquid: {
    to: ['solid', 'gas']
    value: '60F'
  },
  solid: {
    to: 'liquid'
    value: '32F'
  },
  gas: {
    to: 'liquid'
    value: '212F'
  }
})
```


**`<StateMachine>.state -> String`**

Return the string name of the `StateMachine` state.


**`<StateMachine>.value -> Any`**

`value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.


**`<StateMachine>.transition -> Object`**

`transition` is an object with a collection of functions allowing the developer to avoid
transitioning using the string names. In the example above, when in the `liquid` state, two passive and two active functions exist on `transition`. The passive functions are `transition.toSolid`, `transition.toGas`. The two active functions are `transition.freeze` and `transition.boil`. All state specific functions on `transition` accept a single `value` argument.
