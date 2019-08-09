import Vue from 'vue'

const serialPort = require('serialport');
const Struct = require('js-struct/lib/Struct');
const Type = require('js-struct/lib/Type');

const engineState = Struct([
    Type.uint8('with'),
    Type.uint8('load'),
    Type.uint32('rpm'),
    Type.uint8('cmdCode'),
  ]);

export default class SerialComm{
    portList = [];
    port = [];
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
        let pack = [70, 69, index, 10];
        this.port.write(pack, err => {
            if (err) {
                return console.log("Error in port operation");
            }
        });
        console.log("Map was fetched, index:", index);
    }

    static upLaodMap(newMap) {
        let serialized  = newMap; /* encodeECUDataPack(newMap) */
        serialized = serialized.reduce((acc, val) => acc.concat(val), []);
        this.port.write([77, serialized.length >> 8, serialized & 0xff].concat(serialized).concat(0x0a), err => {
            if (err) {
                return console.log("Error in port operation");
            }        
        });
    }

    static editMap(data = []) {
        let serilized = this.serializeArray(Object.values(data));
        this.port.write(serilized, err => {
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
    static arrayTo2d(source) {
        let processed = [];
        while(source.length > 0) {
            processed.push(source.splice(0, 11));
        }
        return processed;
    }

    static startListen() {
        SerialComm.port.on('data', (data) => {
            let res = Array.from(data); // this.decodeECUDataPack(data);
            if (res[0] == 70) {
                res.splice(0, 1);
                this.events.$emit('data', this.arrayTo2d(res));
            } else {
                this.events.$emit('state', res);
            }
        });
    }
}
