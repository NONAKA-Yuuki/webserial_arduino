// 改行コードで区切る
class LineBreakTransformer {
    constructor() {
      this.chunks = "";
    }

    transform(chunk, controller) {
      this.chunks += chunk;
      const lines = this.chunks.split("\r\n");
      this.chunks = lines.pop();
      lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller) {
      controller.enqueue(this.chunks);
    }
}



async function onConnectButtonClick() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        while(port.readable) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();

            try {
                while(true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        addSerial("Canceled\n");
                        break;
                    }
                    addSerial(value);
                    //console.log(value);
                }
            } catch (error) {
                addSerial("Error: Read" + error + "\n");
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        addSerial("Error: Open" + error + "\n");
    }
}

function addSerial(msg) {
    var textarea = document.getElementById('outputArea');
    msg += "\n";
    textarea.value += msg;
    textarea.scrollTop = textarea.scrollHeight;
}

async function sendSerial() {
    var text = document.getElementById('sendInput').value;
    document.getElementById('sendInput').value = "";
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(text + "\n"));
    writer.releaseLock();
}