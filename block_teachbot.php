<?php
class block_teachbot extends block_base {
    public function init() {
        $this->title = get_string('pluginname', 'block_teachbot');
    }

    public function get_content() {
        global $CFG;

        if ($this->content !== null) {
          return $this->content;
        }

        $this->content         =  new stdClass;
        $this->content->text   = $this->html();
        $this->page->requires->css('/blocks/teachbot/style.css');
        $this->page->requires->js('/blocks/teachbot/main.js');
        return $this->content;
    }

    function has_config() {
        return true;
    }

    public function instance_allow_multiple() {
        return true;
    }

    public function specialization() {
        if (isset($this->config)) {
            if (empty($this->config->title)) {
                $this->title = get_string('pluginname', 'block_teachbot');            
            } else {
                $this->title = $this->config->title;
            }
    
            if (empty($this->config->text)) {
                $this->config->text = 'prueba';
            }    
        }
    }

    public function html() {
        $html = '
            <div class="chat">
                <div id="chat-messages" class="chat-messages">
                    <div class="message incoming">
                        <p>Hola, ¿cómo estás?</p>
                    </div>
                    <div class="message outgoing">
                        <p>Hola, estoy bien. ¿Y tú?</p>
                    </div>
                    <div class="message incoming">
                        <p>Estoy bien también, gracias.</p>
                    </div>
                </div>
                <div class="chat-input">
                    <textarea id="mensaje" type="text" placeholder="Escribe aquí tu mensaje" wrap="soft"></textarea>
                    <button id="send">Enviar</button>
                </div>
            </div>
        ';

        return $html;
    }

}
