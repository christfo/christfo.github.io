/*jslint nomen: true, browser: true, indent: 3, unparam: true, todo: true,
  maxerr:1000*/
'use strict';
var total_focus_event = 0, total_blur_event = 0;
function is_child() {
   var params = location.search;
   if (params && params.indexOf('is_child')) {
      return true;
   }
   return false;
}
function setup_listener() {
   var button_close;
   window.addEventListener('focus', function (evt) {
      var result_div = document.getElementById('total_focus');
      total_focus_event += 1;
      result_div.innerText = total_focus_event;
      result_div = document.getElementById('cur_focus');
      if (!evt.target.id) {
         result_div.innerText = evt.target.toString();
      } else {
         result_div.innerText = evt.target.id;
      }
      result_div = document.getElementById('has_focus_event');
      result_div.innerText = 'yes';
   }, true);
   window.addEventListener('blur', function () {
      var result_div = document.getElementById('total_blur');
      total_blur_event += 1;
      result_div.innerText = total_blur_event;
      result_div = document.getElementById('cur_focus');
      result_div.innerText = '';
      result_div = document.getElementById('has_focus_event');
      result_div.innerText = 'no';
   }, true);
   window.addEventListener('visibilitychange', function (evt) {
      var result_div = document.getElementById('visibility_event');
      result_div.innerText = document.visibilityState;
   }, true);
   if (!is_child()) {
      // If the page is loaded in parent mode, the close button does nothing.
      // Thus remove it.
      button_close = document.getElementById('button_close');
      button_close.parentNode.removeChild(button_close);
      window.addEventListener('message', function (event) {
         if (event.data === 'close_me' && window.child_tab) {
            window.child_tab.close();
         }
      }, false);
   }
   setInterval(function () {
      var result_div = document.getElementById('has_focus_poll');
      result_div.innerText = document.hasFocus() ? 'yes' : 'no';
      result_div = document.getElementById('visibility_poll');
      result_div.innerText = document.visibilityState;
   }, 1000);
}

function open_tab() {
   window.child_tab = window.open(location.href + '?is_child');
   return false;
}

function open_win() {
   window.child_tab = window.open(location.href + '?is_child', 'child',
                                  'height=600,width=600');
   return false;
}

function close_self() {
   // Use the opener parent window to close this window to work around the
   // obstacle that a page can't close itself.
   if (window.opener) {
      window.opener.postMessage('close_me', '*');
   }
}

