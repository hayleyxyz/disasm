/**
 * Created by oscar on 10/10/2015.
 */



function LoaderPe(reader) {
    (function(scope) {

        scope.reader = reader;

        scope.dosHeader = null;

        scope.ntHeaders = [ ];

        scope.sectionHeaders = [ ];

        scope.ctor = function() {
            //
        };

        scope.parse = function() {
            scope.reader.setEndian(scope.reader.Endian.LITTLE);
            scope.reader.seek(0);

            // Read DOS header
            scope.dosHeader = new LoaderPe.DosHeader();
            scope.dosHeader.read(scope.reader);

            // Seek to start of NT headers
            scope.reader.seek(scope.dosHeader.e_lfanew);

            // Read NT headers
            scope.ntHeaders = new LoaderPe.NtHeaders();
            scope.ntHeaders.read(scope.reader);

            // Read sections
            for(var i = 0; i < scope.ntHeaders.FileHeader.NumberOfSections; i++) {
                var sectionHeader = new LoaderPe.SectionHeader();

                scope.reader.seek(scope.ntHeaders.OptionalHeader.readerOffset +
                    scope.ntHeaders.FileHeader.SizeOfOptionalHeader + (sectionHeader.size() * i));

                sectionHeader.read(scope.reader);

                scope.sectionHeaders.push(sectionHeader);
            }
        };

        scope.getExports = function() {
            var exports = [ ];

            var entryPointAddress = scope.ntHeaders.OptionalHeader.AddressOfEntryPoint;

            for(var i in scope.sectionHeaders) {
                var sectionHeader = scope.sectionHeaders[i];

                if(sectionHeader.VirtualAddress <= entryPointAddress &&
                    (sectionHeader.VirtualAddress + sectionHeader.VirtualSize) > entryPointAddress) {

                    var fileOffset = sectionHeader.PointerToRawData + (entryPointAddress - sectionHeader.VirtualAddress);
                    exports.push(fileOffset);
                }
            }

            return exports;
        };

        scope.ctor();

    })(this);
}

LoaderPe.DosHeader = function() {
    this.e_magic = null;
    this.e_cblp = null;
    this.e_cp = null;
    this.e_crlc = null;
    this.e_cparhdr = null;
    this.e_minalloc = null;
    this.e_maxalloc = null;
    this.e_ss = null;
    this.e_sp = null;
    this.e_csum = null;
    this.e_ip = null;
    this.e_cs = null;
    this.e_lfarlc = null;
    this.e_ovno = null;
    this.e_res = null; // size=4
    this.e_oemid = null;
    this.e_oeminfo = null;
    this.e_res2 = null; // size=10
    this.e_lfanew = null; // long

    this.read = function(reader) {
        this.e_magic = reader.readUint16();
        this.e_cblp = reader.readUint16();
        this.e_cp = reader.readUint16();
        this.e_crlc = reader.readUint16();
        this.e_cparhdr = reader.readUint16();
        this.e_minalloc = reader.readUint16();
        this.e_maxalloc = reader.readUint16();
        this.e_ss = reader.readUint16();
        this.e_sp = reader.readUint16();
        this.e_csum = reader.readUint16();
        this.e_ip = reader.readUint16();
        this.e_cs = reader.readUint16();
        this.e_lfarlc = reader.readUint16();
        this.e_ovno = reader.readUint16();
        this.e_res = [
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16()
        ];
        this.e_oemid = reader.readUint16();
        this.e_oeminfo = reader.readUint16();
        this.e_res2 = [
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16(),
            reader.readUint16()
        ];
        this.e_lfanew = reader.readUint32();
    };
};

LoaderPe.NtHeaders = function() {
    this.readerOffset = null;

    this.Signature = null; // DWORD
    this.FileHeader = null;
    this.OptionalHeader = null;

    this.read = function(reader) {
        this.readerOffset = reader.position;

        this.Signature = reader.readUint32();

        this.FileHeader = new LoaderPe.NtHeaders.FileHeader();
        this.FileHeader.read(reader);

        this.OptionalHeader = new LoaderPe.NtHeaders.OptionalHeader();
        this.OptionalHeader.read(reader);
    };
};

LoaderPe.NtHeaders.FileHeader = function() {
    this.readerOffset = null;

    this.Machine = null; // WORD
    this.NumberOfSections = null; // WORD
    this.TimeDateStamp = null; // DWORD
    this.PointerToSymbolTable = null; // DWORD
    this.NumberOfSymbols = null; // DWORD
    this.SizeOfOptionalHeader = null; // WORD
    this.Characteristics = null; // WORD

    this.read = function(reader) {
        this.readerOffset = reader.position;

        this.Machine = reader.readUint16();
        this.NumberOfSections = reader.readUint16();
        this.TimeDateStamp = reader.readUint32();
        this.PointerToSymbolTable = reader.readUint32();
        this.NumberOfSymbols = reader.readUint32();
        this.SizeOfOptionalHeader = reader.readUint16();
        this.Characteristics = reader.readUint16();
    };
};

LoaderPe.NtHeaders.OptionalHeader = function() {
    this.IMAGE_NUMBEROF_DIRECTORY_ENTRIES = 16;

    this.readerOffset = null;

    this.Magic = null; // WORD
    this.MajorLinkerVersion = null; // BYTE
    this.MinorLinkerVersion = null; // BYTE
    this.SizeOfCode = null; // DWORD
    this.SizeOfInitializedData = null; // DWORD
    this.SizeOfUninitializedData = null; // DWORD
    this.AddressOfEntryPoint = null; // DWORD
    this.BaseOfCode = null; // DWORD
    this.BaseOfData = null; // DWORD
    this.ImageBase = null; // DWORD
    this.SectionAlignment = null; // DWORD
    this.FileAlignment = null; // DWORD
    this.MajorOperatingSystemVersion = null; // WORD
    this.MinorOperatingSystemVersion = null; // WORD
    this.MajorImageVersion = null; // WORD
    this.MinorImageVersion = null; // WORD
    this.MajorSubsystemVersion = null; // WORD
    this.MinorSubsystemVersion = null; // WORD
    this.Win32VersionValue = null; // DWORD
    this.SizeOfImage = null; // DWORD
    this.SizeOfHeaders = null; // DWORD
    this.CheckSum = null; // DWORD
    this.Subsystem = null; // WORD
    this.DllCharacteristics = null; // WORD
    this.SizeOfStackReserve = null; // DWORD
    this.SizeOfStackCommit = null; // DWORD
    this.SizeOfHeapReserve = null; // DWORD
    this.SizeOfHeapCommit = null; // DWORD
    this.LoaderFlags = null; // DWORD
    this.NumberOfRvaAndSizes = null; // DWORD
    this.DataDirectory = [ ]; // [IMAGE_NUMBEROF_DIRECTORY_ENTRIES]

    this.read = function(reader) {
        this.readerOffset = reader.position;

        this.Magic = reader.readUint16();
        this.MajorLinkerVersion = reader.readUint8();
        this.MinorLinkerVersion = reader.readUint8();
        this.SizeOfCode = reader.readUint32();
        this.SizeOfInitializedData = reader.readUint32();
        this.SizeOfUninitializedData = reader.readUint32();
        this.AddressOfEntryPoint = reader.readUint32();
        this.BaseOfCode = reader.readUint32();
        this.BaseOfData = reader.readUint32();
        this.ImageBase = reader.readUint32();
        this.SectionAlignment = reader.readUint32();
        this.FileAlignment = reader.readUint32();
        this.MajorOperatingSystemVersion = reader.readUint16();
        this.MinorOperatingSystemVersion = reader.readUint16();
        this.MajorImageVersion = reader.readUint16();
        this.MinorImageVersion = reader.readUint16();
        this.MajorSubsystemVersion = reader.readUint16();
        this.MinorSubsystemVersion = reader.readUint16();
        this.Win32VersionValue = reader.readUint32();
        this.SizeOfImage = reader.readUint32();
        this.SizeOfHeaders = reader.readUint32();
        this.CheckSum = reader.readUint32();
        this.Subsystem = reader.readUint16();
        this.DllCharacteristics = reader.readUint16();
        this.SizeOfStackReserve = reader.readUint32();
        this.SizeOfStackCommit = reader.readUint32();
        this.SizeOfHeapReserve = reader.readUint32();
        this.SizeOfHeapCommit = reader.readUint32();
        this.LoaderFlags = reader.readUint32();
        this.NumberOfRvaAndSizes = reader.readUint32();

        for(var i = 0; i < this.IMAGE_NUMBEROF_DIRECTORY_ENTRIES; i++) {
            var dataDirectory = new LoaderPe.NtHeaders.OptionalHeader.DataDirectory();
            dataDirectory.read(reader);
            this.DataDirectory.push(dataDirectory);
        }
    }
};

LoaderPe.NtHeaders.OptionalHeader.DataDirectory = function() {
    this.VirtualAddress = null; // DWORD
    this.Size = null; // DWORD

    this.read = function(reader) {
        this.VirtualAddress = reader.readUint32();
        this.Size = reader.readUint32();
    };
};

LoaderPe.SectionHeader = function() {
    this.IMAGE_SIZEOF_SHORT_NAME = 8;

    this.Name = null; // BYTE[IMAGE_SIZEOF_SHORT_NAME]
    this.VirtualSize = null; // DWORD
    this.VirtualAddress = null; // DWORD
    this.SizeOfRawData = null; // DWORD
    this.PointerToRawData = null; // DWORD
    this.PointerToRelocations = null; // DWORD
    this.PointerToLinenumbers = null; // DWORD
    this.NumberOfRelocations = null; // WORD
    this.NumberOfLinenumbers = null; // WORD
    this.Characteristics = null; // DWORD

    this.read = function(reader) {
        this.Name = reader.readString(this.IMAGE_SIZEOF_SHORT_NAME);
        this.VirtualSize = reader.readUint32();
        this.VirtualAddress = reader.readUint32();
        this.SizeOfRawData = reader.readUint32();
        this.PointerToRawData = reader.readUint32();
        this.PointerToRelocations = reader.readUint32();
        this.PointerToLinenumbers = reader.readUint32();
        this.NumberOfRelocations = reader.readUint16();
        this.NumberOfLinenumbers = reader.readUint16();
        this.Characteristics = reader.readUint32();
    };

    this.size = function() {
        return 0x28;
    };
};