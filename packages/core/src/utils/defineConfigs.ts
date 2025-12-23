import type { ConfigurationScope, WorkspaceConfiguration } from 'vscode'
import type { Nullable } from './types'
import { shallowRef } from '@reactive-vscode/reactivity'
import { workspace } from 'vscode'
import { useDisposable } from '../composables'
import { extensionContext } from './defineExtension'
import { onActivate } from './onActivate'

// declare let _inspectMethod: WorkspaceConfiguration['inspect']
// type InspectReturn<T> = ReturnType<(typeof _inspectMethod<T>)>

// type ConfigObjectExtraMethods<C extends object> = {
//   [K in keyof C]: K extends (string | number)
//     ? C[K] extends any[]
//       ? {}
//       : C[K] extends object
//         ? ConfigObjectExtraMethods<C[K]>
//         : {}
//     : never // Symbol keys are not supported
// } & {
//   /**
//    * Useful when the configuration type is "object".
//    *
//    * Instead of accessing child configurations via the proxy, access the raw object.
//    */
//   $raw: C

//   /**
//    * Write the configuration value to the workspace.
//    *
//    * @see https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration.update
//    */
//   $update: <K extends keyof C>(key: K, value: C[K], configurationTarget?: ConfigurationTarget | boolean | null, overrideInLanguage?: boolean) => Promise<void>

//   /**
//    * Write the configuration value to the workspace.
//    *
//    * @see https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration.update
//    */
//   $inspect: <K extends keyof C>(key: K) => InspectReturn<C[K]>

// }

// export type ConfigObject<C extends object> = C & ConfigObjectExtraMethods<C>

/**
 * Define configurations of an extension. See `vscode::workspace.getConfiguration`.
 *
 * @category lifecycle
 */
export function defineConfigs<C extends object>(section: Nullable<string>, scope?: Nullable<ConfigurationScope>): C & {
  get: WorkspaceConfiguration['get']
  has: WorkspaceConfiguration['has']
  inspect: WorkspaceConfiguration['inspect']
  update: WorkspaceConfiguration['update']
} {
  const isTopLevel = !section

  const workspaceConfig = shallowRef<WorkspaceConfiguration | null>(null)
  function updateWorkspaceConfig() {
    return workspaceConfig.value = workspace.getConfiguration(section ?? undefined, scope)
  }
  function getWorkspaceConfig() {
    if (!extensionContext.value) {
      throw new Error('Cannot access configs before extension is activated.')
    }
    if (workspaceConfig.value) {
      return workspaceConfig.value
    }
    return updateWorkspaceConfig()
  }

  function buildProxy(base: string) {
    return new Proxy<any>({}, {
      get(_, key) {
        const config = getWorkspaceConfig()
        if (typeof key !== 'string') {
          throw new TypeError('Symbol keys are not supported in defineConfigs proxy.')
        }

        if (base === '' && ['get', 'has', 'inspect', 'update'].includes(key)) {
          return Reflect.get(config, key).bind(config)
        }

        const v = config.get(base + key)
        if (v === undefined) {
          throw new Error(`Configuration key "${section ? `${section}.` : ''}${base + key}" is not defined.`)
        }
        if (typeof v !== 'object' || v === null || Array.isArray(v)) {
          return v
        }
        return buildProxy(`${base}${key}.`)
      },
      set(_, key, value) {
        const config = getWorkspaceConfig()
        if (typeof key !== 'string') {
          throw new TypeError('Symbol keys are not supported in defineConfigs proxy.')
        }
        config.update(base + key, value)
        return true
      },
      apply: notSupported,
      construct: notSupported,
      defineProperty(_, property, attributes) {
        const config = getWorkspaceConfig()
        return Reflect.defineProperty(config, property, attributes)
      },
      deleteProperty(_, p) {
        const config = getWorkspaceConfig()
        return Reflect.deleteProperty(config, p)
      },
      getOwnPropertyDescriptor(_, p) {
        const config = getWorkspaceConfig()
        return Reflect.getOwnPropertyDescriptor(config, p)
      },
      getPrototypeOf(_) {
        const config = getWorkspaceConfig()
        return Reflect.getPrototypeOf(config)
      },
      has(_, p) {
        const config = getWorkspaceConfig()
        return Reflect.has(config, p)
      },
      isExtensible(_) {
        const config = getWorkspaceConfig()
        return Reflect.isExtensible(config)
      },
      ownKeys(_) {
        const config = getWorkspaceConfig()
        return Reflect.ownKeys(config)
      },
      preventExtensions: notSupported,
      setPrototypeOf: notSupported,
    })
  }

  onActivate(() => {
    useDisposable(workspace.onDidChangeConfiguration((e) => {
      if (isTopLevel || e.affectsConfiguration(section, scope ?? undefined)) {
        updateWorkspaceConfig()
      }
    }))
  })

  return buildProxy('')
}

function notSupported(): never {
  throw new Error('Not supported')
}
