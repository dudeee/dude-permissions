'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var DEFAULTS = { // eslint-disable-line
  grant: ['admin'],
  deny: ['admin']
};

exports['default'] = function (bot) {
  bot.modifiers.middleware('hear', function (context) {
    var groups = bot.config.permissions || {};
    if (context.permissions) {
      var _ret = (function () {
        var user = bot.find(context.user);
        bot.log.debug('[permissions] permissions: ' + context.permissions + ', user: ' + user.name);

        if (Array.isArray(context.permissions)) {
          var access = context.permissions.some(function (permission) {
            var allowed = groups[permission] || [];

            return allowed.includes(user.name);
          });

          if (!access) {
            bot.log.debug('[permissions] denied');
            return {
              v: Promise.reject('User ' + user.name + ' doesn\'t have access to ' + context.permissions)
            };
          }
        } else {
          var allowed = groups[context.permissions] || [];

          if (!allowed.includes(user.name)) {
            bot.log.debug('[permissions] denied');
            return {
              v: Promise.reject('User ' + user.name + ' doesn\'t have access to ' + context.permissions)
            };
          }
        }
      })();

      if (typeof _ret === 'object') return _ret.v;
    }

    bot.log.debug('[permissions] granted');
    return Promise.resolve();
  });

  var options = _extends({}, DEFAULTS, (bot.config.permissions || {}).options);
  var grant = options.grant;

  if (grant) {
    bot.listen(/permissions grant (\w+) (\w+)/i, function (message) {
      var groups = bot.config.permissions || {};

      var _message$match = _slicedToArray(message.match, 2);

      var user = _message$match[0];
      var group = _message$match[1];

      if (!user || !group) {
        message.reply('grant <username> <group>');
        return;
      }

      if (groups[group]) {
        if (groups[group].indexOf(user) > -1) {
          message.reply('User ' + user + ' is already in ' + group);
          return;
        }

        groups[group].push(user);
      } else {
        groups[group] = [user];
      }

      message.reply('Added ' + user + ' to ' + group);
    }, { permissions: grant });
  }

  var deny = options.deny;
  if (deny) {
    bot.listen(/permissions deny (\w+) (\w+)/i, function (message) {
      var groups = bot.config.permissions || {};

      var _message$match2 = _slicedToArray(message.match, 2);

      var user = _message$match2[0];
      var group = _message$match2[1];

      if (!user || !group) {
        message.reply('deny <username> <group>');
        return;
      }

      if (!groups[group]) {
        message.reply('Group ' + group + ' doesn\'t exist');
        return;
      }

      var index = groups[group].indexOf(user);
      groups[group].splice(index, 1);

      message.reply('Removed ' + user + ' from ' + group);
    }, { permissions: deny });
  }

  bot.help('permissions', 'grant/deny permissions to a user', '\n  grant <username> <group> – add the user to permission group\n  deny <username> <group> – kick the user from the permissions group\n  ');
};

module.exports = exports['default'];
