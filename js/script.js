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
                var reader = new FileReader();

                reader.onload = function(event) {
                    var arrayBuffer = reader.result;
                    var binaryReader = new ArrayBufferBinaryReader(arrayBuffer);

                    var pe = new LoaderPe(binaryReader);
                    pe.disassemble(binaryReader);
                };

                reader.readAsArrayBuffer(file);
            }
        };

        scope.ctor();

    })(this);
}

function Disassembler() {
    (function(scope) {

        scope.ctor = function() {

        };

        scope.ctor();

    })(scope);
}

var ui = new UI();