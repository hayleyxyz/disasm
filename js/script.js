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

        scope.events = {
            onFileChanged: function() {
                if(this.files.length === 0) {
                    return;
                }

                var file = this.files[0];

                var disam = new Disassembler();
                disam.loadFile(file);
            }
        };

        scope.ctor();

    })(this);
}

function Disassembler() {
    (function(scope) {

        scope.ctor = function() {

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

                var pe = new LoaderPe(binaryReader);
                pe.parse();

                console.log(pe);
            }
        };

        scope.ctor();

    })(this);
}

var ui = new UI();