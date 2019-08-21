import Vue from 'vue'

const serialPort = require('serialport');
const delimiter = require('@serialport/parser-delimiter');
const Struct = require('js-struct/lib/Struct');
const Type = require('js-struct/lib/Type');

const engineState = Struct([
    Type.uint8('with'),
    Type.uint8('load'),
    Type.uint32('rpm'),
    Type.uint8('cmdCode'),
]);

const mapData = Struct([
    Type.uint8('type'),
    Type.uint16('xStart'),
    Type.uint16('xStep'),
    Type.uint16('yStart'),
    Type.uint16('yStep'),
    Type.uint8('demention'),
    Type.uint8('dementionY'),
    Type.uint16('index'),
]);

export default class SerialComm{
    portList = [];
    port = [];
    parser = [];
    dummy = '';
    static events = new Vue();

    static async fetchPortList () {
        this.portList = await serialPort.list();
        return this.portList;
    }

    static getPortList () {
        return this.portList;
    }

    static async open (path) {
        return new Promise(resolve => {
            this.port = new serialPort(path, { baudRate: 115200 }, err => {
                if (err) {
                    resolve({open: false, msg: err});
                } else {
                    this.parser = this.port.pipe(new delimiter({ delimiter: '\n' }));
                    resolve({open: this.port.isOpen});
                }
            });
        })
    }

    static isOpen () {
        if (this.port === undefined) {
            return false;
        } else {
            return this.port.isOpen;
        }
    }

    static close () {
        if (this.port.isOpen) {
            this.port.close();
        }
    }

    static fetchMap(index) {
        let pack = [70, index, 10];
        this.port.write(this.encodeECUDataPack(pack), err => {
            if (err) {
                return console.log("Error in port operation");
            }
        });
        console.log("Map was fetched, index:", index);
    }

    static upLaodMap(data) {
        let yDemention = data.fuelMap.length - 1; 
        let serialized = data.fuelMap.reduce((acc, val) => acc.concat(val), []);
        let encoded = [
            77, 
            data.axisValX.start >> 8,
            data.axisValX.start & 0xff,
            data.axisValX.step >> 8,
            data.axisValX.step & 0xff,
            data.axisValY.start >> 8,
            data.axisValY.start & 0xff,
            data.axisValY.step >> 8,
            data.axisValY.step & 0xff,
            data.xDemention,
            yDemention,
            data.index >> 8,
            data.index & 0xff,
        ].concat(serialized);
        this.port.write(this.encodeECUDataPack(encoded), err => {
            if (err) {
                return console.log("Error in port operation");
            }        
        });
    }

    static editMap(data = []) {
        let serilized = this.serializeArray(Object.values(data));
        this.port.write(this.encodeECUDataPack(serilized), err => {
            if (err) {
                return console.log("Error in port operation");
            }
        });
    }

    /* Helper serializer */
    static serializeArray(src) {
        let serialized = src.map(res => {
            if (typeof res == 'string') {
                return res.charCodeAt(0);
            } else {
                if (res > 255) {
                    return [res >> 8, res & 0xff];
                }
                return res;
            }
        });
        serialized.push(0x0a);
        serialized = serialized.reduce((acc, val) => acc.concat(val), []);
        return serialized;
    }

    /* Helper function for decoding data for ecu */
    static decodeECUDataPack(inputData) {
        let decodedBuffer = [];
        let res = 0;
        for (let i = 0; i < inputData.length; i += 2) {
          res = ((inputData[i] - 0x10) * 0x10) + (inputData[i + 1] - 0x10);
          decodedBuffer.push(res);
        }
        return decodedBuffer;
    }

    /* Helper function for encoding data for ecu */
    static encodeECUDataPack(inputData) {
        let encodedRes = [];
        inputData.map(res => {
          encodedRes.push(Math.floor(res / 0x10 + 0x10));
          encodedRes.push(Math.floor(res % 0x10 + 0x10));
        })
        encodedRes.push(0x0a);
        return encodedRes;
    }

    /* Helper function for login HEX data */
    static buf2hex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    /* Convertor of 1d array to 2d readed from ECU flash */
    static arrayTo2d(source, demention) {
        let processed = [];
        while(source.length > 0) {
            processed.push(source.splice(0, demention));
        }
        return processed;
    }

    static startListen() {
        SerialComm.parser.on('data', (data) => {
            let decoded = Array.from(this.decodeECUDataPack(data));
            if (decoded[0] == 70) {
                let meta = mapData.read(decoded.splice(0, 13), 0);
                this.events.$emit('data', {
                    'map': this.arrayTo2d(decoded, meta.demention), 
                    'meta': meta
                });
            } else if (decoded[0] == 0x53) { // S => State 0x53
                this.events.$emit('state', decoded);
                console.log(decoded);
            } else {
                console.log('Error in pack classification', this.buf2hex(decoded));
            }
        });
    }
}
