export interface NestedScopedConfigs {
  disabled: boolean
  decoration: {
    enabled: boolean
    color: string
    mode: 'text' | 'gutter'
  }
}

export const scopedConfigs = {
  scope: 'i18n-ally',
  defaults: {
    'disabled': false,
    'decoration.enabled': true,
    'decoration.color': '#ff0000',
    'decoration.mode': 'text',
    // ...
  },
}

// ...
