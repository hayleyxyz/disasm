/**
 * Created by oscar on 03/10/2015.
 */

function UI() {
    (function(scope) {

        scope.fileInput = null;

        scope.ctor = function() {
            scope.fileInput = document.getElementById('file');
            scope.fileInput.onchange = scope.events.onFileChanged;
        };

        scope.addLine = function(line) {
            var target = document.getElementById('disam');

            var lineElement = document.createElement('div');

            lineElement.textContent = line;

            target.appendChild(lineElement);
        };

        scope.events = {
            onFileChanged: function() {
                if(this.files.length === 0) {
                    return;
                }

                var file = this.files[0];

                var disam = new Disassembler(scope);
                disam.loadFile(file);
            }
        };

        scope.ctor();

    })(this);
}

function Disassembler(ui) {
    (function(scope) {

        scope.ui = ui;

        scope.ctor = function() {
            //
        };

        scope.loadFile = function(file) {
            var reader = new FileReader();

            reader.onload = scope.events.onFileReaderLoad;

            reader.readAsArrayBuffer(file);
        };

        scope.events = {
            onFileReaderLoad: function(event) {
                var arrayBuffer = event.target.result;
                var binaryReader = new ArrayBufferBinaryReader(arrayBuffer);

                for(var i = 0; i < binaryReader.length(); i++) {
                    var db = binaryReader.readUint8();

                    ui.addLine(sprintf('db %+02Xh', db));
                }

                var pe = new LoaderPe(binaryReader);
                pe.parse();

                var exports = pe.getExports();
                for(var i in exports) {
                    binaryReader.seek(exports[i]);

                    var cpu = new Processor80386(binaryReader);
                    while(cpu.disassemble()) {
                        //
                    }
                }
            }
        };

        scope.ctor();

    })(this);
}

var ui = new UI();