# Teachbot
Chatbot designed to connect to an LLM made as a custom block for Moodle <br><br>

## Usage
It is ready to deploy it in Moodle environment.
* The [block_teachbot.php](https://github.com/giovam19/Teachbot/blob/main/block_teachbot.php) file has all the main structure of the block and the **HTML** code of the chat.
* The [main.js](https://github.com/giovam19/Teachbot/blob/main/main.js) file has the logic where it sends the query to the LLM.
* The [style.css](https://github.com/giovam19/Teachbot/blob/main/style.css) can be used to modify the chat display.

The connection with the LLM is designed to be with an LLM hosted on a server making POST requests. As an example, you can use the [LLaMA project](https://github.com/ggerganov/llama.cpp) from this repository and run it as a server.
