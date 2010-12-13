/*
 * Check box plugin
 * @version 0.1
 * @author Denis Sobolev
 */

function rcmail_selectmenu() {
  rcmail_ui.show_popup('selectmenu');
  return false;
}

function chbox_menu(){
  var link_html = '<a href="#" onclick="return rcmail.command(\'plugin.chbox.selectmenu\')">'+rcmail.env.chboxicon;
  $('#rcmchbox').html(link_html);
}

if (window.rcmail) {
  rcmail.addEventListener('init', function(evt) {
    rcmail.register_command('plugin.chbox.selectmenu', rcmail_selectmenu, true);
    chbox_menu();
    // add event-listener to message list
    if (rcmail.message_list) {
      rcmail.message_list.addEventListener('select', function(list){
        $('#messagelist input:checked').removeAttr('checked');
        var selection = rcmail.message_list ? $.merge([], rcmail.message_list.get_selection()) : [];
        // exit if no mailbox specified or if selection is empty
        if (!rcmail.env.uid && !selection.length)
          return;
        // also select childs of collapsed rows
        /*
        for (var uid, i=0, len=selection.length; i<len; i++) {
          uid = selection[i];
          if (rcmail.message_list.rows[uid].has_children && !rcmail.message_list.rows[uid].expanded)
            rcmail.message_list.select_childs(uid);
        }
        var selection = rcmail.message_list ? $.merge([], rcmail.message_list.get_selection()) : [];
        */
        for (var uid, i=0, len=selection.length; i<len; i++) {
            uid = selection[i];
            var select = document.getElementById('rcmselect'+uid);
            if (select) select.checked = true;
        }
      });
    }
  });


  rcmail.addEventListener('listupdate','chbox_menu');
  rcmail.addEventListener('insertrow', function(evt) {
    var row = evt.row
    if ((found = $.inArray('chbox', rcmail.env.coltypes)) >= 0) {
      rcmail.set_env('chbox_col', found);
    }
    // set eventhandler to checkbox selection
    if (rcmail.env.chbox_col != null && (row.select = document.getElementById('rcmselect'+row.uid))) {
      row.select._row = row.obj;
      row.select.onclick = function(e) {
        // don't include the non-selected checkbox in this
        if (document.getElementById('rcmselect'+rcmail.message_list.last_selected)
              && document.getElementById('rcmselect'+rcmail.message_list.last_selected).checked != true
              && rcmail.message_list.last_selected != row.uid) {
          rcmail.message_list.clear_selection();
        }
        rcmail.message_list.select_row(row.uid, CONTROL_KEY, false);
        $("#selectcount").html(rcmail.message_list.selection.length);
      };
    }
  });
}

$(document).ready(function(){
  var li = '<li><input type="checkbox" name="list_col[]" value="chbox" id="cols_chbox" /><label for="cols_chbox">'+rcmail.get_label('chbox.chbox')+'</label></li>';
  $("#listmenu fieldset ul input#cols_threads").parent().after(li);
});