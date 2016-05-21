'use strict';

angular.module('numberwang.KeyboardService', [])
  .service('KeyboardService', function($document) {
    var keyboardMap = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    // Initialize the keyboard event binding
    this.init = function() {
      var self = this;
      this.keyEventHandlers = [];
      $document.bind('keydown', function(evt) {
        var key = keyboardMap[evt.which];

        if (key) {
          evt.preventDefault();
          self.handleKeyEvent(key, evt);
        }
      });
    };

    this.handleKeyEvent = function(key, evt) {
      var callbacks = this.keyEventHandlers;
      if (!callbacks) {
        return;
      }
      evt.preventDefault();
      if (callbacks) {
        for (var x = 0; x < callbacks.length; x++) {
          var cb = callbacks[x];
          cb(key, evt);
        }
      }
    };

    this.on = function(cb) {
      this.keyEventHandlers.push(cb);
    };

    this.dispose = function() {
      this.keyEventHandlers = [];
      $document.unbind('keydown');
    };
  });
