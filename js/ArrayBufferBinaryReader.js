/**
 * Created by oscar on 10/10/2015.
 */

function ArrayBufferBinaryReader(arrayBuffer) {
    (function(scope) {

        scope.SeekOrigin = {
            SET: 0,
            CURRENT: 1,
            END: 2
        };

        scope.Endian = {
            LITTLE: 0,
            BIG: 1
        };

        // Underlying ArrayBuffer instance
        scope.buffer = null;

        // Uint8Array view of the buffer
        scope.viewUint8 = null;

        // Int8Array view of the buffer
        scope.viewInt8 = null;

        // Current position in array
        scope.position = 0;

        // Current endianness for integer read operations
        scope.endian = scope.Endian.LITTLE;

        scope.ctor = function() {
            scope.buffer = arrayBuffer;
            scope.viewUint8 = new Uint8Array(scope.buffer);
            scope.viewInt8 = new Int8Array(scope.buffer);
        };

        /**
         * Get the length of the underlying buffer, in bytes
         *
         * @returns {number}
         */
        scope.length = function() {
            return scope.buffer.byteLength;
        };


        /**
         * Set position pointer associated with the buffer
         *
         * @param offset
         * @param seekOrigin
         * @returns {*}
         */
        scope.seek = function(offset, seekOrigin) {
            var newPosition = null;

            // Set default value for seekOrigin
            if(seekOrigin === undefined) {
                seekOrigin = scope.SeekOrigin.SET;
            }

            switch(seekOrigin) {
                case scope.SeekOrigin.SET: // From start of buffer
                    newPosition = offset;
                    break;
                case scope.SeekOrigin.CURRENT: // From current position
                    newPosition = (scope.position + offset);
                    break;
                case scope.SeekOrigin.END: // From the end of buffer (negative offsets only)
                    newPosition = (scope.length() + offset);
                    break;
                default:
                    throw new Error('Invalid value for seekOrigin:' + seekOrigin);
                    break;
            }

            // Check if position is outside of underlying buffer's bounds
            if(newPosition > scope.length() || newPosition < 0) {
                throw new Error('Position outside of bounds');
            }

            // All okay, update the position and return
            return (scope.position = newPosition);
        };

        /**
         * Set endianness for integer read operations
         *
         * @param endian
         */
        scope.setEndian = function(endian) {
            scope.endian = endian;
        };

        /**
         * Read 8-bit unsigned integer from buffer
         *
         * @returns {*}
         */
        scope.readUint8 = function() {
            return scope.viewUint8[this.position++];
        };

        /**
         * Read 16-bit unsigned integer from buffer
         *
         * @returns {number}
         */
        scope.readUint16 = function() {
            var buffer = this.readUint8Buffer(2);

            if(scope.endian === scope.Endian.LITTLE) {
                return buffer[1] << 16 |
                    buffer[0];
            }
            else {
                return buffer[0] << 16 |
                    buffer[1];
            }
        };

        /**
         * Read 32-bit unsigned integer from buffer
         *
         * @returns {number}
         */
        scope.readUint32 = function() {
            var buffer = this.readUint8Buffer(4);

            if(scope.endian === scope.Endian.LITTLE) {
                return (buffer[3] << 24 |
                    buffer[2] << 16 |
                    buffer[1] << 8 |
                    buffer[0]) >>> 0;
            }
            else {
                return (buffer[0] << 24 |
                    buffer[1] << 16 |
                    buffer[2] << 8 |
                    buffer[3]) >>> 0;
            }
        };

        /**
         * Read 8-bit signed integer from buffer
         *
         * @returns {*}
         */
        scope.readInt8 = function() {
            return scope.viewInt8[this.position++];
        };

        /**
         * Read Uint8Array from buffer with length specified
         *
         * @param length
         * @returns {Uint8Array}
         */
        scope.readUint8Buffer = function(length) {
            var buffer = scope.buffer.slice(scope.position, scope.position + length);
            var view = new Uint8Array(buffer);

            scope.seek(length, scope.SeekOrigin.CURRENT);

            return view;
        };

        /**
         * Read Int8Array from buffer with length specified
         *
         * @param length
         * @returns {Int8Array}
         */
        scope.readInt8Buffer = function(length) {
            var buffer = scope.buffer.slice(scope.position, scope.position + length);
            var view = new Int8Array(buffer);

            scope.seek(length, scope.SeekOrigin.CURRENT);

            return view;
        };

        scope.ctor();
    })(this);
}