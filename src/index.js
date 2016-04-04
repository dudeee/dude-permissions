const DEFAULTS = {
  grant: ['admin'],
  deny: ['admin']
}

export default bot => {
  bot.modifiers.middleware('hear', context => {
    const groups = bot.config.permissions || {};
    if (context.permissions) {
      let user = bot.find(context.user);
      bot.log.debug(`[permissions] permissions: ${context.permissions}, user: ${user.name}`);

      if (Array.isArray(context.permissions)) {
        let access = context.permissions.some(permission => {
          let allowed = groups[permission] || [];

          return allowed.includes(user.name);
        });

        if (!access) {
          bot.log.debug(`[permissions] denied`);
          return Promise.reject(`User ${user.name} doesn't have access to ${context.permissions}`);
        }
      } else {
        let allowed = groups[context.permissions] || [];

        if (!allowed.includes(user.name)) {
          bot.log.debug(`[permissions] denied`);
          return Promise.reject(`User ${user.name} doesn't have access to ${context.permissions}`);
        }
      }
    }

    bot.log.debug(`[permissions] granted`);
    return Promise.resolve();
  });

  let options = { ...DEFAULTS, ...(bot.config.permissions || {}).options };
  let grant = options.grant;

  if (grant) {
    bot.listen(/permissions grant (\w+) (\w+)/i, message => {
      let [user, group] = message.match;

      if (!user || !group) {
        return message.reply('grant <username> <group>');
      }

      if (groups[group]) {
        if (groups[group].indexOf(user) > -1)  {
          return message.reply(`User ${user} is already in ${group}`);
        }

        groups[group].push(user);
      } else {
        groups[group] = [user];
      }

      message.reply(`Added ${user} to ${group}`);
      console.log(groups);
    }, { permissions: grant });
  }

  let deny = options.deny;
  if (deny) {
    bot.listen(/permissions deny (\w+) (\w+)/i, message => {
      let [user, group] = message.match;

      if (!user || !group) {
        return message.reply('deny <username> <group>');
      }

      if (!groups[group]) return message.reply(`Group ${group} doesn't exist`);

      let index = groups[group].indexOf(user);
      groups[group].splice(index, 1);

      message.reply(`Removed ${user} from ${group}`);
    }, { permissions: deny });
  }

  bot.help('permissions', 'grant/deny permissions to a user', `
  grant <username> <group> – add the user to permission group
  deny <username> <group> – kick the user from the permissions group
  `)
}
