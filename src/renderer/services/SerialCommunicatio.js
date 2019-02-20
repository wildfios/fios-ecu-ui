// const serialPort = require('serialport');

// export default class SerialComm extends serialPort{
//     // constructor() {
//     //    // this.port = Object;
//     // }
    
//     initPort(portAddr, baudRate) {
//         this.port = new serialPort('/dev/ttyUSB0', {baudRate: 115200});
//     }
    
//     startRead() {
//         this.port.on('data', data => {
//             console.log(data);
//         })
//     }
    
    // port.on('data', data => {
    //     console.log(data);
    //   })

    //   serialPort.list((err, port) => {
    //     console.log(port)
    //   })
//}