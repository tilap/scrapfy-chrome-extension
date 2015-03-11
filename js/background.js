/* global chrome, alert, $ */

(function() {

  /**
   * Create a SCRAPfy room with content
   * @param string contentToSend
   */
  function createSCRAPfyRoom(contentToSend) {
    var remoteUrl = chrome.i18n.getMessage('url_create');

    $.post(remoteUrl, {
      'content': contentToSend
    })
    .done(function(reponseData) {
      if(!reponseData.url) {
        alert('SCRAPfy error: bad response format by the server');
        return false;
      }

      // Open the room in new tab
      chrome.tabs.create({
        url: reponseData.url
      });
    })
    .fail(function() {
      alert('SCRAPfy error: seems the server is unreachable for the moment');
    });

  }

  function createSelectionContextMenu() {
    chrome.contextMenus.create({
      type: 'normal',
      title: 'Open in SCRAPfy',
      contexts: ['selection'],
      onclick: function() {

        // Get the selection with getSelection() coz info.selectionText
        // strip the \n, \t...
        chrome.tabs.executeScript( {

          code: 'window.getSelection().toString();'

        }, function(obj) {

          // Should never happen. So just in case of...
          if(!obj[0] || ''===obj[0]) {
              alert('No selection');
              return false;
          }

          createSCRAPfyRoom(obj[0]);

        });
      }
    });
  }

  createSelectionContextMenu();

})();