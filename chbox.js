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
    if (rcmail.message_list)
      rcmail.message_list.addEventListener('select', function(list){
        //alert('select');
      });
  });
  rcmail.addEventListener('insertrow', function(evt) {
    var row = evt.row
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