import Vue from 'vue'
import { reject } from 'bluebird-lst';

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

    static startListen() {
        SerialComm.port.on('data', (data) => {
            let res = engineState.read(data.reverse(), 0)
            if (res.cmdCode === 0x01) {
                this.events.$emit('state', res);
            }
        });

        this.testEvent();
    }

    static testEvent() {
        setInterval(() => {
            this.events.$emit('test', {'msg': 'test data'});
        }, 5000)    
    }
}