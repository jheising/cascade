import Cascade from "../Cascade";
import * as _ from "lodash";
import * as os from "os";

class WebAPI
{
    static webServer;

    static initialize()
    {
        WebAPI.webServer = Cascade.requireProcess("WebServer");

        let server = WebAPI.webServer.server;

        function getComponent(req, res, next)
        {
            let component = Cascade.components[req.params.componentID];
            if(_.isNil(component))
            {
                res.send(404, "Not Found");
                return;
            }

            req.params.component = component;
            next();
        }

        function setComponentValue(req, res)
        {
            if(req.params.component.readOnly || req.authorization.isReadOnly)
            {
                res.send(400, "Component is Read Only");
                return;
            }

            let value = req.params.value || req.query.value;

            if(_.isNil(value) && req.body)
            {
                value = _.isString(req.body) ? req.body : req.body.value;
            }

            if(!_.isNil(value))
            {
                req.params.component.value = value;
            }

            res.send(req.params.component.serialized());
        }

        server.get("/api", WebAPI.webServer.authorizeUser, (req, res) => {

            let components = {};

            _.each(Cascade.components, (component) => {
                components[component.id] = component.serialized();
            });

            let ipAddresses = [];

            let ifaces = os.networkInterfaces();
            _.each(ifaces, function (ifaceArray) {
                _.each(ifaceArray, function (iface) {
                    if ('IPv4' !== iface.family || iface.internal !== false) {
                        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                        return;
                    }

                    ipAddresses.push(iface.address);
                })
            });

            let sysInfo = {
                free_memory: os.freemem(),
                load: os.loadavg(),
                network: {
                    hostname: os.hostname(),
                    ip_addresses: ipAddresses
                }
            };

            res.send({
                system: sysInfo,
                processes: Object.keys(Cascade.processes),
                components: components
            });
        });

        server.get("/api/components/:componentID", WebAPI.webServer.authorizeUser, getComponent, (req, res) => {
            res.send(req.params.component.serialized());
        });

        server.post("/api/components/:componentID", WebAPI.webServer.authorizeUser, getComponent, setComponentValue);
        server.post("/api/components/:componentID/:value", WebAPI.webServer.authorizeUser, getComponent, setComponentValue);
    }
}

Cascade.start(() => {
    WebAPI.initialize();
});

