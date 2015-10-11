/**
 * Created by oscar on 10/10/2015.
 */

function LoaderPe(reader) {
    (function(scope) {

        scope.reader = reader;

        scope.dosHeader = {
            e_magic: null,
            e_cblp: null,
            e_cp: null,
            e_crlc: null,
            e_cparhdr: null,
            e_minalloc: null,
            e_maxalloc: null,
            e_ss: null,
            e_sp: null,
            e_csum: null,
            e_ip: null,
            e_cs: null,
            e_lfarlc: null,
            e_ovno: null,
            e_res: null, // size=4
            e_oemid: null,
            e_oeminfo: null,
            e_res2: null, // size=10
            e_lfanew: null // long
        };

        scope.ntHeaders = {
            Signature: null,
            FileHeader: {
                Machine: null, // WORD
                NumberOfSections: null, // WORD
                TimeDateStamp: null, // DWORD
                PointerToSymbolTable: null, // DWORD
                NumberOfSymbols: null, // DWORD
                SizeOfOptionalHeader: null, // WORD
                Characteristics: null // WORD
            },
            OptionalHeader: {
                Magic: null, // WORD
                MajorLinkerVersion: null, // BYTE
                MinorLinkerVersion: null, // BYTE
                SizeOfCode: null, // DWORD
                SizeOfInitializedData: null, // DWORD
                SizeOfUninitializedData: null, // DWORD
                AddressOfEntryPoint: null, // DWORD
                BaseOfCode: null, // DWORD
                BaseOfData: null, // DWORD
                ImageBase: null, // DWORD
                SectionAlignment: null, // DWORD
                FileAlignment: null, // DWORD
                MajorOperatingSystemVersion: null, // WORD
                MinorOperatingSystemVersion: null, // WORD
                MajorImageVersion: null, // WORD
                MinorImageVersion: null, // WORD
                MajorSubsystemVersion: null, // WORD
                MinorSubsystemVersion: null, // WORD
                Win32VersionValue: null, // DWORD
                SizeOfImage: null, // DWORD
                SizeOfHeaders: null, // DWORD
                CheckSum: null, // DWORD
                Subsystem: null, // WORD
                DllCharacteristics: null, // WORD
                SizeOfStackReserve: null, // DWORD
                SizeOfStackCommit: null, // DWORD
                SizeOfHeapReserve: null, // DWORD
                SizeOfHeapCommit: null, // DWORD
                LoaderFlags: null, // DWORD
                NumberOfRvaAndSizes: null, // DWORD
                DataDirectory: [ ] // IMAGE_DATA_DIRECTORY[IMAGE_NUMBEROF_DIRECTORY_ENTRIES]
            }
        };

        scope.ctor = function() {
            scope.parse();
        };

        scope.parse = function() {
            scope.reader.setEndian(scope.reader.Endian.LITTLE);
            scope.reader.seek(0);

            scope.dosHeader.e_magic = scope.reader.readUint16();
            scope.dosHeader.e_cblp = scope.reader.readUint16();
            scope.dosHeader.e_cp = scope.reader.readUint16();
            scope.dosHeader.e_crlc = scope.reader.readUint16();
            scope.dosHeader.e_cparhdr = scope.reader.readUint16();
            scope.dosHeader.e_minalloc = scope.reader.readUint16();
            scope.dosHeader.e_maxalloc = scope.reader.readUint16();
            scope.dosHeader.e_ss = scope.reader.readUint16();
            scope.dosHeader.e_sp = scope.reader.readUint16();
            scope.dosHeader.e_csum = scope.reader.readUint16();
            scope.dosHeader.e_ip = scope.reader.readUint16();
            scope.dosHeader.e_cs = scope.reader.readUint16();
            scope.dosHeader.e_lfarlc = scope.reader.readUint16();
            scope.dosHeader.e_ovno = scope.reader.readUint16();
            scope.dosHeader.e_res = [
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16()
            ];
            scope.dosHeader.e_oemid = scope.reader.readUint16();
            scope.dosHeader.e_oeminfo = scope.reader.readUint16();
            scope.dosHeader.e_res2 = [
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16(),
                scope.reader.readUint16()
            ];
            scope.dosHeader.e_lfanew = scope.reader.readUint32();

            scope.reader.seek(scope.dosHeader.e_lfanew);
        };

        scope.disassemble = function() {
            var cpu = new Processor80386(scope.reader);
            scope.reader.seek(0x1010);

            while(true) {
                cpu.disassemble();
            }
        };

        scope.ctor();

    })(this);
}