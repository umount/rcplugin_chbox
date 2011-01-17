<?php

/**
 * Check box plugin
 *
 *
 * @version 0.2.1
 * @author Denis Sobolev
 */

class chbox extends rcube_plugin {
  public $task = 'mail';

  function init() {
    $rcmail = rcmail::get_instance();
    if (($rcmail->task == 'mail') && ($rcmail->action == '')) {
      $this->add_hook('render_page', array($this, 'select_menu'));
      $this->include_script('chbox.js');
    }
    $this->add_hook('startup', array($this, 'startup_chbox'));
    $this->add_hook('messages_list', array($this, 'message_list'));
    $this->include_stylesheet($this->local_skin_path() . "/chbox.css");
  }

  function startup_chbox($args){
    $this->add_texts('localization');
    $rcmail = rcmail::get_instance();
    $icon = 'plugins/chbox/' .$this->local_skin_path(). '/columncheck.png';
    $chboxicon = html::img(array('src' => $icon, 'id' => 'selectmenulink', 'title' => $this->gettext('chbox'), 'alt' => $this->gettext('chbox')));
    $rcmail->output->add_label('chbox.chbox');
    $rcmail->output->set_env('chboxicon', $chboxicon);
    return $args;
  }

  function message_list($args){
    $count = count($args['messages']);

    for ($i=0;$i<$count;$i++) {
      $uid = $args['messages'][$i]->uid;
      if(!empty($uid))
        $args['messages'][$i]->list_cols['chbox'] = '<input type="checkbox" name="rcmselect'.$uid.'" id="rcmselect'.$uid.'" />';
    }
    return $args;
  }

  function select_menu() {
    $rcmail = rcmail::get_instance();
    $out = "<div id=\"selectmenu\" class=\"popupmenu\">
    <ul>
      <li><a title=\"".rcube_label('all')."\" href=\"#\" onclick=\"return rcmail.command('select-all','',this)\" class=\"active\">".rcube_label('all')."</a></li>
      <li><a title=\"".rcube_label('currpage')."\" href=\"#\" onclick=\"return rcmail.command('select-all','page',this)\" class=\"active\">".rcube_label('currpage')."</a></li>
      <li><a title=\"".rcube_label('unread')."\" href=\"#\" onclick=\"return rcmail.command('select-all','unread',this)\" class=\"active\">".rcube_label('unread')."</a></li>
      <li><a title=\"".rcube_label('invert')."\" href=\"#\" onclick=\"return rcmail.command('select-all','invert',this)\" class=\"active\">".rcube_label('invert')."</a></li>
      <li><a title=\"".rcube_label('none')."\" href=\"#\" onclick=\"return rcmail.command('select-none','',this)\" class=\"active\">".rcube_label('none')."</a></li>
      </ul>
    </div>";
    $rcmail->output->add_gui_object('selectmenu', 'selectmenu');
    $rcmail->output->add_footer($out);
  }
}