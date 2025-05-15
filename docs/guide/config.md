# Configurations

An extension can contribute extension-specific settings.

## Define in Manifest <NonProprietary />

To define the settings in the `package.json`, you need to add the `contributes.configuration` field. The `configuration` field is an object that contains the configuration settings.

```json [package.json]
{
  "contributes": {
    "configuration": {
      "title": "My Extension",
      "properties": {
        "myExtension.enable": {
          "type": "boolean",
          "default": true,
          "description": "Enable My Extension"
        },
        "myExtension.greeting": {
          "type": ["string", "null"],
          "default": "Hello!",
          "description": "Greeting messag. Set to null to disable"
        }
      }
    }
  }
}
```

Visit the [official documentation](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration) for more information.

## Use in Extension

To use the settings in the extension, you can use the `reactive::defineConfigs` or `reactive::defineConfigObject` function to define the configuration. The following examples are corresponding to the above configuration.

### As Refs

```ts
import { defineConfigs } from 'reactive-vscode'

const { enable, greeting } = defineConfigs('your-extension', {
  enable: Boolean,
  greeting: [String, null],
})
```

Note that you should always set the default value in the manifest file. `reactive::defineConfigs` does not provide default values.

In the above example, `enable` is of type `ConfigRef<boolean>`, which extends `Ref<boolean>`.

<!-- eslint-disable import/first -->
```ts
import { defineConfigs } from 'reactive-vscode'

const { enable, greeting } = defineConfigs('your-extension', {
  enable: Boolean,
  greeting: [String, null],
})
// ---cut---
import { ConfigurationTarget } from 'vscode'

// This will write the value back to the configuration.
enable.value = false

// To pass the rest of the options, you can use the `update` method.
enable.update(false, ConfigurationTarget.Global)

// Only set the ref value without writing back to the configuration.
enable.set(false)
```

Visit the [official documentation](https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration.update) for more information about the rest of the options.

### As an Object

```ts
import { defineConfigObject } from 'reactive-vscode'

const config = defineConfigObject('your-extension', {
  enable: Boolean,
  greeting: [String, null],
})
```

In the above example, `config` is a `vue::ShallowReactive(https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)` object.

<!-- eslint-disable import/first -->
```ts
import { defineConfigObject } from 'reactive-vscode'

const config = defineConfigObject('your-extension', {
  enable: Boolean,
  greeting: [String, null],
})
// ---cut---
import { ConfigurationTarget } from 'vscode'

// This will write the value back to the configuration.
config.enable = false

// To pass the rest of the options, you can use the `$update` method.
config.$update('enable', false, ConfigurationTarget.Global)

// Only set the ref value without writing back to the configuration.
config.$set('enable', false)
```

Visit the [official documentation](https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration.update) for more information about the rest of the options.

## Use with `vscode-ext-gen`

You can also use the [`vscode-ext-gen`](https://github.com/antfu/vscode-ext-gen) to generate the configuration settings. For example:

```ts
import { defineConfigObject, defineConfigs, reactive, ref } from 'reactive-vscode'
import { type NestedScopedConfigs, scopedConfigs } from './generated-meta'

const config = defineConfigObject<NestedScopedConfigs>(
  scopedConfigs.scope,
  scopedConfigs.defaults,
)
```
