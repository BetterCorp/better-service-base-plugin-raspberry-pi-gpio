import { SecConfig } from "@bettercorp/service-base";

export enum PinType {
  OUTPUT = 'OUTPUT',
  INPUT = 'INPUT',
  PWM = 'PWM',
}

export enum PinPullDown {
  OFF = 'OFF',
  DOWN = 'DOWN',
  UP = 'UP',
}

export enum PinState {
  LOW = 'LOW',
  HIGH = 'HIGH'
}

export enum PluginRPIOOptionsMapping {
  physical = 'physical',
  gpio = 'gpio',
}
export interface PluginRPIOOptions {
  gpiomem: boolean; // Use GPIO MEM: Use /dev/gpiomem
  mapping: PluginRPIOOptionsMapping; // Mapping: Use the P1-P40 numbering scheme
}

export interface PluginPins {
  pin: number; // PIN: GPIO Pin
  type: PinType; // PIN Type
  pullDown: PinPullDown; // Pulldown Type
  defaultState?: PinState; // PIN Default State
}

export interface MyPluginConfig {
  pins: Array<PluginPins>; // PINs

  rpioOptions: PluginRPIOOptions; // Options
  disposeAllLow: boolean; // Dispose Low: Switch all output pins LOW when disconnecting
}

export class Config extends SecConfig<MyPluginConfig> {
  migrate(
    mappedPluginName: string,
    existingConfig: MyPluginConfig
  ): MyPluginConfig {
    return {
      pins: existingConfig.pins !== undefined ? existingConfig.pins : [],
      disposeAllLow: existingConfig.disposeAllLow !== undefined ? existingConfig.disposeAllLow : true,
      rpioOptions: existingConfig.rpioOptions !== undefined ? existingConfig.rpioOptions : {
        gpiomem: true,
        mapping: PluginRPIOOptionsMapping.physical
      }
    };
  }
}
