const ieee754 = require('ieee754'),
    IntN = require('intn'),
    intToHex = function(intV, isShort) {
        // Creates a new 32-bit integer from the given number
        let intSize = isShort ? 16 : 32,
            intNSize = new IntN(intSize),
            byteNum = intNSize.fromInt(intV).bytes;

        // Map decimal bytes to hex bytes
        // Bytes are already in correct little-endian form
        return byteNum.map((Byte) => {
            return '0x' + Byte.toString(16);
        });
    },
    charToHex = function(character) {
        return '0x' + character.charCodeAt(0).toString(16);
    };

function HexBuffer() {
    let buffer = [];

    return {
        addString: function(str, isNullTerminated) {
            // Write each char to the buffer
            
            const buf = Buffer.from(str, 'utf-8');
            
            for (let i = 0; i < buf.length; i++) {
                buffer.push('0x' + buf[i].toString(16));
            }
            
            if(isNullTerminated) {
                this.addNullTerminator();
            }
        },

        addNewLine: function() {
            buffer.push('0x0d'); // carriage return
            buffer.push('0x0a'); // line feed
        },

        addChar: function(char) {
            buffer.push(charToHex(char));
        },

        addInt: function(int, isShort) {
            intToHex(int, isShort).forEach((Byte) => {
                buffer.push(Byte);
            });
        },

        addShort: function(short) {
            this.addInt(short, true);
        },

        addFloat: function(float) {
            let buf = Buffer.alloc(4);

            // ieee754.write(buffer, value, buffer offset, little-endian, mantissa length, bytes);
            ieee754.write(buf, float, 0, true, 23, 4);

            buf.forEach(function(byte) {
                buffer.push('0x' + byte.toString(16));
            });
        },

        addByte: function(byte) {
            buffer.push('0x' + byte.toString(16));
        },

        addNullTerminator: function() {
            buffer.push('0x0');
        },

        getBuffer: () => { return Buffer.from(buffer); }
    };
}

module.exports = HexBuffer;
