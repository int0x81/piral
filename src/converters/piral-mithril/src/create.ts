import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createExtension } from './extension';
import type { PiletMithrilApi } from './types';

/**
 * Available configuration options for the Mithril.js plugin.
 */
export interface MithrilConfig {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

/**
 * Creates new Pilet API extensions for integrating Mithril.js.
 */
export function createMithrilApi(config: MithrilConfig = {}): PiralPlugin<PiletMithrilApi> {
  const { rootName } = config;

  return (context) => {
    const convert = createConverter();
    context.converters.mithril = ({ component, captured }) => convert(component, captured);

    return (api) => ({
      fromMithril(component, captured) {
        return {
          type: 'mithril',
          component,
          captured,
        };
      },
      MithrilExtension: createExtension(api, rootName),
    });
  };
}
