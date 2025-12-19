export * from '@tanstack/table-core'

import {
  TableOptions,
  TableOptionsResolved,
  RowData,
  createTable,
} from '@tanstack/table-core'
import {
  Component,
  ComponentChildren,
  ComponentType,
  isValidElement,
} from 'preact'
import { useRef, useState } from 'preact/hooks'

export type Renderable<TProps> = ComponentChildren | ComponentType<TProps>

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): ComponentChildren {
  return !Comp ? null : isPreactComponent<TProps>(Comp) ? (
    <Comp {...props} />
  ) : (
    Comp
  )
}

function isPreactComponent<TProps>(
  component: unknown,
): component is ComponentType<TProps> {
  return isValidElement(component) || component instanceof Component
}

export function usePreactTable<TData extends RowData>(
  options: TableOptions<TData>,
) {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    renderFallbackValue: null,
    ...options,
  }

  // Create a new table and store it in state
  const [tableRef] = useState(() => ({
    current: createTable<TData>(resolvedOptions),
  }))

  console.log('tableRef', tableRef)

  // By default, manage table state here using the table's initial state
  const [state, setState] = useState(() => tableRef.current.initialState)

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  tableRef.current.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: (updater) => {
      setState(updater)
      options.onStateChange?.(updater)
    },
  }))

  return tableRef.current
}
