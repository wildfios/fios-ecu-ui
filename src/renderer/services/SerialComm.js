import Vue from 'vue'

const serialPort = require('serialport');
const Struct = require('js-struct/lib/Struct')
const Type = require('js-struct/lib/Type')
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

    static send () {
        this.port.write("sdfdfsdf\n");    
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
            }
           this.events.$emit('state', res);
        });
    }
}