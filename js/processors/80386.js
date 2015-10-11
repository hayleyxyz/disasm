/**
 * Created by oscar on 10/10/2015.
 */

function Processor80386(reader) {
    (function(scope) {

        scope.Register = function(name) {
            this.name = name;

            this.toString = function() {
                return this.name;
            };
        };

        scope.reader = reader;

        scope.registers = {
            EAX: new scope.Register('EAX'),
            EBX: new scope.Register('EBX'),
            ECX: new scope.Register('ECX'),
            EDX: new scope.Register('EDX'),
            EBP: new scope.Register('EBP'),
            ESI: new scope.Register('ESI'),
            EDI: new scope.Register('EDI'),
            ESP: new scope.Register('ESP'),
        };

        scope.ctor = function() {
            // Constructor
        };

        /**
         * Get register encoded in first 3 bits of po of the opcode
         *
         * @param registerCode
         * @returns {*}
         */
        scope.registerFromCode = function(registerCode) {
            switch(registerCode) {
                case 0x00: // 000
                    return scope.registers.EAX;
                case 0x01: // 001
                    return scope.registers.ECX;
                case 0x02: // 010
                    return scope.registers.EDX;
                case 0x03: // 011
                    return scope.registers.EBX;
                case 0x04: // 100
                    return scope.registers.ESP;
                case 0x05: // 101
                    return scope.registers.EBP;
                case 0x06: // 110
                    return scope.registers.ESI;
                case 0x07: // 111
                    return scope.registers.EDI;
            }
        };

        scope.disassemble = function() {
            var po = scope.reader.readUint8();

            switch(po) {
                case 0x33: // xor
                {
                    var op1 = scope.reader.readUint8();

                    var mod = (op1 >> 6); // XX000000

                    var dstRegCode = ((op1 >> 3) & 0x07); // 00XXX000
                    var dstReg = scope.registerFromCode(dstRegCode);

                    var srcRegCode = (op1 & 0x07); // 00000XXX
                    var srcReg = scope.registerFromCode(srcRegCode);

                    if (mod === 0x03) { // 11 = xor dstReg, srcReg
                        console.log(sprintf('xor %s, %s', dstReg, srcReg));
                    }
                    else if (mod === 0x02) { // 10 = xor dstReg, [srcReg+disp32]
                        var disp32 = scope.reader.readUint32();
                        console.log(sprintf('xor %s, [%s+0x%08x]', dstReg, srcReg, disp32));
                    }
                    else if (mod === 0x01) { // 01 = xor dstReg, [srcReg+disp8]
                        var disp8 = scope.reader.readUint8();
                        console.log(sprintf('xor %s, [%s+0x%02x]', dstReg, srcReg, disp8));
                    }
                    else if (mod === 0x00) { // 00 = xor dstReg, [srcReg]
                        console.log(sprintf('xor %s, [%s]', dstReg, srcReg));
                    }

                    break;
                }

                case 0x3b: // cmp regA, regB
                {
                    var op1 = scope.reader.readUint8();

                    var mod = (op1 >> 6); // XX000000

                    var regA = scope.registerFromCode((op1 >> 3) & 0x07); // 00XXX000
                    var regB = scope.registerFromCode(op1 & 0x07); // 00000XXX

                    if (mod === 0x03) { // 11 = cmp regA, regB
                        console.log(sprintf('cmp %s, %s', regA, regB));
                    }
                    else if (mod === 0x02) { // 10 = cmp regA, [regB+disp32]
                        var disp32 = scope.reader.readUint32();
                        console.log(sprintf('cmp %s, [%s+0x%08x]', regA, regB, disp32));
                    }
                    else if (mod === 0x01) { // 01 = cmp regA, [regB+disp8]
                        var disp8 = scope.reader.readUint8();
                        console.log(sprintf('cmp %s, [%s+0x%02x]', regA, regB, disp8));
                    }
                    else if (mod === 0x00) { // 00 = cmp regA, [regB]
                        console.log(sprintf('cmp %s, [%s]', regA, regB));
                    }

                    break;
                }

                case 0x50: // push reg
                case 0x51:
                case 0x52:
                case 0x53:
                case 0x54:
                case 0x55:
                case 0x56:
                case 0x57:
                {
                    var reg = scope.registerFromCode(po & 0x07); // 00000XXX

                    console.log(sprintf('push %s', reg));

                    break;
                }

                case 0x58: // pop reg
                case 0x59:
                case 0x5a:
                case 0x5b:
                case 0x5c:
                case 0x5d:
                case 0x5e:
                case 0x5f:
                {
                    var reg = scope.registerFromCode(po & 0x07); // 00000XXX

                    console.log(sprintf('pop %s', reg));

                    break;
                }

                case 0x68: // push imm32
                {
                    var imm32 = scope.reader.readUint32();

                    console.log(sprintf('push 0x%08x', imm32));

                    break;
                }

                case 0x83: // sub, add etc.
                {
                    var op1 = scope.reader.readUint8();

                    var mod = (op1 >> 6); // XX000000

                    var ext = ((op1 >> 3) & 0x07); // 00XXX000

                    var regCode = (op1 & 0x07); // 00000XXX
                    var reg = scope.registerFromCode(regCode);

                    if (ext === 0x05) { // SUB
                        if (mod === 0x03) { // 11 = sub reg, imm8
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('sub %s, 0x%02x', reg, imm8));
                        }
                        else if (mod === 0x02) { // 10 = sub [reg+disp32], imm8
                            var disp32 = scope.reader.readUint32();
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('sub [%s+0x%08x], 0x%02x', reg, disp32, imm8));
                        }
                        else if (mod === 0x01) { // 01 = sub [reg+disp8], imm8
                            var disp8 = scope.reader.readUint8();
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('sub [%s+0x%02x], 0x%02x', reg, disp8, imm8));
                        }
                        else if (mod === 0x00) { // 00 = sub [reg], imm8
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('sub %s, 0x%02x', reg, imm8));
                        }
                    }
                    else if (ext === 0x00) {
                        if (mod === 0x03) { // 11 = add reg, imm8
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('add %s, 0x%02x', reg, imm8));
                        }
                        else if (mod === 0x02) { // 10 = add [reg+disp32], imm8
                            var disp32 = scope.reader.readUint32();
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('add [%s+0x%08x], 0x%02x', reg, disp32, imm8));
                        }
                        else if (mod === 0x01) { // 01 = add [reg+disp8], imm8
                            var disp8 = scope.reader.readUint8();
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('add [%s+0x%02x], 0x%02x', reg, disp8, imm8));
                        }
                        else if (mod === 0x00) { // 00 = add [reg], imm8
                            var imm8 = scope.reader.readUint8();
                            console.log(sprintf('add %s, 0x%02x', reg, imm8));
                        }
                    }
                    else {
                        throw new Error('Uninplemented');
                    }

                    break;
                }

                case 0x8b: // mov
                {
                    var op1 = scope.reader.readUint8();

                    var mod = (op1 >> 6); // XX000000

                    var dstRegCode = ((op1 >> 3) & 0x07); // 00XXX000
                    var dstReg = scope.registerFromCode(dstRegCode);

                    var srcRegCode = (op1 & 0x07); // 00000XXX
                    var srcReg = scope.registerFromCode(srcRegCode);

                    if (mod === 0x03) { // 11 = mov dstReg, srcReg
                        console.log(sprintf('mov %s, %s', dstReg, srcReg));
                    }
                    else if (mod === 0x02) { // 10 = mov dstReg, [srcReg+disp32]
                        var disp32 = scope.reader.readUint32();
                        console.log(sprintf('mov %s, [%s+0x%08x]', dstReg, srcReg, disp32));
                    }
                    else if (mod === 0x01) { // 01 = mov dstReg, [srcReg+disp8]
                        var disp8 = scope.reader.readUint8();
                        console.log(sprintf('mov %s, [%s+0x%02x]', dstReg, srcReg, disp8));
                    }
                    else if (mod === 0x00) { // 00 = mov dstReg, [srcReg]
                        console.log(sprintf('mov %s, [%s]', dstReg, srcReg));
                    }

                    break;
                }

                case 0x8d: // lea
                {
                    var op1 = scope.reader.readUint8();

                    var mod = (op1 >> 6); // XX000000

                    var srcRegCode = (op1 & 0x07); // 00000XXX
                    var srcReg = scope.registerFromCode(srcRegCode);

                    var dstRegCode = ((op1 >> 3) & 0x07); // 00XXX000
                    var dstReg = scope.registerFromCode(dstRegCode);

                    if (mod === 0x02) { // 10 = lea dstReg, [srcReg+disp32]
                        var disp32 = scope.reader.readUint32();
                        console.log(sprintf('lea %s, [%s+0x%08x]', dstReg, srcReg, disp32));
                    }
                    else if (mod === 0x01) { // 01 = lea dstReg, [srcReg+disp8]
                        var disp8 = scope.reader.readUint8();
                        console.log(sprintf('lea %s, [%s+0x%02x]', dstReg, srcReg, disp8));
                    }
                    else if (mod === 0x00) { // 00 = lea dstReg, [srcReg]
                        console.log(sprintf('lea %s, [%s]', dstReg, srcReg));
                    }

                    break;
                }

                case 0xb8: // mov reg, imm32
                case 0xb9:
                case 0xba:
                case 0xbb:
                case 0xbc:
                case 0xbd:
                case 0xbe:
                case 0xbf:
                {
                    var reg = scope.registerFromCode(po & 0x07); // 00000XXX
                    var imm32 = scope.reader.readUint32();

                    console.log(sprintf('mov %s, 0x%08x', reg, imm32));

                    break;
                }

                case 0xc3: // retn
                {
                    console.log('retn');

                    break;
                }

                case 0xe8: // call imm32
                {
                    var imm32 = scope.reader.readUint32();

                    console.log(sprintf('call 0x%08x', imm32));

                    break;
                }

                // TODO: implement rep instruction
                case 0xf2: // rep
                case 0xf3:
                {
                    var unk = scope.reader.readUint8();

                    console.log(sprintf('rep UNIMPLEMENTED'));

                    break;
                }

                default:
                    throw new Error('Invalid po: 0x' + po.toString(16));

            }


        };

        scope.ctor();

    })(this);
}