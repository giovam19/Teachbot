<?php
$settings->add(new admin_setting_heading(
            'headerconfig',
            get_string('headerconfig', 'block_teachbot'),
            get_string('descconfig', 'block_teachbot')
        ));

$settings->add(new admin_setting_configcheckbox(
            'simplehtml/Stream',
            get_string('labelallowstream', 'block_teachbot'),
            get_string('descallowstream', 'block_teachbot'),
            '0'
        ));
