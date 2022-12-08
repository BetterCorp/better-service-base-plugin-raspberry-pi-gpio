import {
  ServiceCallable,
  ServicesBase,
  ServicesClient,
} from "@bettercorp/service-base";
import { onEvents } from "../../plugins/service-raspverry-pi-gpio/plugin";
import { MyPluginConfig } from "../../plugins/service-raspverry-pi-gpio/sec.config";

export class ADBudClient extends ServicesClient<
  onEvents,
  ServiceCallable,
  ServiceCallable,
  ServiceCallable,
  ServiceCallable,
  MyPluginConfig
> {
  public readonly _pluginName: string = "service-raspverry-pi-gpio";
  constructor(self: ServicesBase) {
    super(self);
  }

  async setPinState(pin: number, state: boolean): Promise<void> {
    await this._plugin.emitEvent("setOutputPin", pin, state);
  }
  async setPinsState(pins: Array<{pin: number, state: boolean}>): Promise<void> {
    await this._plugin.emitEvent("setOutputPins", pins);
  }
}
