const rpio = require("rpio");
import {
  IPluginLogger,
  ServiceCallable,
  ServicesBase,
} from "@bettercorp/service-base";
import { MyPluginConfig, PinPullDown, PinState, PinType } from "./sec.config";

export interface onEvents extends ServiceCallable {
  setOutputPin(pin: number, state: boolean): Promise<void>;
}

export class Service extends ServicesBase<
  onEvents,
  ServiceCallable,
  ServiceCallable,
  ServiceCallable,
  ServiceCallable,
  MyPluginConfig
> {
  constructor(
    pluginName: string,
    cwd: string,
    pluginCwd: string,
    log: IPluginLogger
  ) {
    super(pluginName, cwd, pluginCwd, log);
  }
  public override dispose(): void {
    rpio.exit();
  }
  public override async init(): Promise<void> {
    const self = this;
    rpio.init((await self.getPluginConfig()).rpioOptions);
    for (let pin of (await this.getPluginConfig()).pins) {
      self.log.info(
        "Setup pin: {pinNumber} {pinMode} {pinPulldown} defaults {defaultState}",
        {
          pinNumber: pin.pin,
          pinMode: pin.type,
          pinPulldown: pin.pullDown,
          defaultState: pin.defaultState || "none",
        }
      );
      let pinType: any = undefined;
      if (pin.type === PinType.OUTPUT) pinType = rpio.OUTPUT;
      if (pin.type === PinType.INPUT) pinType = rpio.INPUT;
      if (pin.type === PinType.PWM) pinType = rpio.PWM;
      let pinPulldownOrState: any = undefined;
      if (pin.pullDown === PinPullDown.DOWN)
        pinPulldownOrState = rpio.PULL_DOWN;
      if (pin.pullDown === PinPullDown.UP) pinPulldownOrState = rpio.PULL_UP;
      if (pinPulldownOrState === undefined && pin.defaultState !== undefined) {
        if (pin.defaultState === PinState.HIGH) pinPulldownOrState = rpio.HIGH;
        if (pin.defaultState === PinState.LOW) pinPulldownOrState = rpio.LOW;
      }
      rpio.open(pin.pin, pinType, pinPulldownOrState);
    }
    this.onEvent("setOutputPin", async (pin, state) => {
      for (let cPin of (await self.getPluginConfig()).pins) {
        if (cPin.pin === cPin.pin) {
          self.log.debug("Set Output Pin [{pin}]: {state}", { pin, state });
          rpio.write(cPin.pin, state ? rpio.HIGH : rpio.LOW);
          return;
        }
      }
      self.log.error("Cannot set pin [{pin}] as it's not an output pin!", {
        pin,
      });
      return;
    });
  }
  public override async run(): Promise<void> {
    //const self = this;
  }
}
