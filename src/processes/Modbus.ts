import Cascade, {Component} from "../Cascade";
import * as modbus from "modbus-serial";
import * as _ from "lodash";

class Modbus
{
    static getComponentFromModbusAddress(addr:number):Component
    {
        return _.find(Cascade.components, (component:Component) => {
            return component.isValidForModbusAddress(addr);
        });
    }

    static initialize()
    {
        let vector = {
            getInputRegister: function(addr, unitID) {
                let component = Modbus.getComponentFromModbusAddress(addr);
                if(_.isNil(component)) return 0;
                return component.value;
            },
            getCoil: function(addr, unitID) {
                let component = Modbus.getComponentFromModbusAddress(addr);
                if(_.isNil(component)) return 0;
                return component.getModbusValueAtAddress(addr);
            },
            setCoil: function(addr, value, unitID) {
                let component = Modbus.getComponentFromModbusAddress(addr);
                if(component)
                {
                    component.setModbusValueForAddress(addr, value);
                }
            },
            setRegister: function(addr, value, unitID) {
                //let component = Modbus.getComponentFromModbusAddress(addr);
                //if(_.isNil(component) || component.readOnly) return;
            },
            getHoldingRegister: function(addr, unitID) {

            }
        };

        let modbusServer = new modbus.ServerTCP(vector, { host: "0.0.0.0", port: 8502, debug: false, unitID: 1 });
        Cascade.logInfo("Modbus server listening on port 8502");

        modbusServer.on("socketError", function(err){
            Cascade.logError(err);
        });
    }
}

Cascade.start(() => {
    Modbus.initialize();
});

