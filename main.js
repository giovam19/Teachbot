let index = 0;

var boton = document.getElementById("send");
var textbox = document.getElementById("mensaje");
const scrollableDiv = document.querySelector('.chat-messages');

scrollableDiv.scrollTop = scrollableDiv.scrollHeight;

boton.addEventListener("click", function (e) {
    sendToChat(e);
});

textbox.addEventListener("keypress", function (e) {
    if (e.key === 13 || e.key === 'Enter') {
        sendToChat(e);
    }
});

function sendToChat(e) {
    e.preventDefault();

    var mensaje = document.getElementById("mensaje").value;
    document.getElementById("mensaje").value = "";

    if (mensaje == "" || mensaje == null || mensaje == undefined || mensaje == " ") {
        return;
    }

    var msg = createMessage(mensaje, "out");
    loadMessage(msg);

    msg = createMessage("", "in");
    loadMessage(msg);

    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;

    askChat(mensaje);


}

function createMessage(mensaje, emisor) {
    var message = {
        "mensaje": mensaje,
        "emisor": emisor,
    }

    return message;
}

function loadMessage(message) {
    if (message.emisor === "out") {
        var msg = "<div class='message outgoing'> <p>" + message.mensaje + "</p> </div>";
    } else {
        var msg = "<div class='message incoming'> <p id='in"+index+"'></p> </div>";
    }

    document.getElementById("chat-messages").innerHTML += msg;
}

function formatCode(content) {
    var regex = /```([^`]+)```/g;

    var coincidencia = content.match(regex);

    if (coincidencia) {
        coincidencia.forEach(element => {
            console.log(element);
            var nuevo = element.replaceAll("`", "");
            console.log(nuevo);
            nuevo = "</p><pre><code>" + nuevo + "</code></pre><p>";
            console.log(nuevo);
            content = content.replace(element, nuevo);
            console.log(content);
        });
    }

    return content;
}

async function askChat(prompt) {
    const response = await fetch("http://127.0.0.1:3000/completion", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            prompt,
            n_predict: 256,
            stream: true,
        })
    })

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let content = "";
    let leftover = "";

    try {
        let cont = true;

        while (cont) {
            const result = await reader.read();
            if (result.done) {
                break;
            }

            const text = leftover + decoder.decode(result.value);

            // Check if the last character is a line break
            const endsWithLineBreak = text.endsWith('\n');

            // Split the text into lines
            let lines = text.split('\n');

            // If the text doesn't end with a line break, then the last line is incomplete
            // Store it in leftover to be added to the next chunk of data
            if (!endsWithLineBreak) {
                leftover = lines.pop();
            } else {
                leftover = ""; // Reset leftover if we have a line break at the end
            }

            // Parse all sse events and add them to result
            const regex = /^(\S+):\s(.*)$/gm;
            for (const line of lines) {
                const match = regex.exec(line);
                if (match) {
                    result[match[1]] = match[2]
                    // since we know this is llama.cpp, let's just decode the json in data
                    if (result.data) {
                        result.data = JSON.parse(result.data);
                        content += result.data.content;

                        // yield
                        //yield result;

                        // if we got a stop token from server, we will break here
                        if (result.data.stop) {
                            cont = false;
                            break;
                        }
                    }
                }
            }

            content = formatCode(content);
            let id = "in"+index;
            document.getElementById(id).innerHTML = content;
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        }

        index++;

    } catch (e) {
        if (e.name !== 'AbortError') {
            console.error("llama error: ", e);
        }
        throw e;
    }
}
