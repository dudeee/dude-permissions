const DEFAULTS = { // eslint-disable-line
  grant: ['admin'],
  deny: ['admin']
};

export default bot => {
  bot.modifiers.middleware('hear', context => {
    const groups = bot.config.permissions || {};
    if (context.permissions) {
      const user = bot.find(context.user);
      bot.log.debug(`[permissions] permissions: ${context.permissions}, user: ${user.name}`);

      if (Array.isArray(context.permissions)) {
        const access = context.permissions.some(permission => {
          const allowed = groups[permission] || [];

          return allowed.includes(user.name);
        });

        if (!access) {
          bot.log.debug('[permissions] denied');
          return Promise.reject(`User ${user.name} doesn't have access to ${context.permissions}`);
        }
      } else {
        const allowed = groups[context.permissions] || [];

        if (!allowed.includes(user.name)) {
          bot.log.debug('[permissions] denied');
          return Promise.reject(`User ${user.name} doesn't have access to ${context.permissions}`);
        }
      }
    }

    bot.log.debug('[permissions] granted');
    return Promise.resolve();
  });

  const options = { ...DEFAULTS, ...(bot.config.permissions || {}).options };
  const grant = options.grant;

  if (grant) {
    bot.listen(/permissions grant (\w+) (\w+)/i, message => {
      const groups = bot.config.permissions || {};
      const [user, group] = message.match;

      if (!user || !group) {
        message.reply('grant <username> <group>');
        return;
      }

      if (groups[group]) {
        if (groups[group].indexOf(user) > -1) {
          message.reply(`User ${user} is already in ${group}`);
          return;
        }

        groups[group].push(user);
      } else {
        groups[group] = [user];
      }

      message.reply(`Added ${user} to ${group}`);
    }, { permissions: grant });
  }

  const deny = options.deny;
  if (deny) {
    bot.listen(/permissions deny (\w+) (\w+)/i, message => {
      const groups = bot.config.permissions || {};
      const [user, group] = message.match;

      if (!user || !group) {
        message.reply('deny <username> <group>');
        return;
      }

      if (!groups[group]) {
        message.reply(`Group ${group} doesn't exist`);
        return;
      }

      const index = groups[group].indexOf(user);
      groups[group].splice(index, 1);

      message.reply(`Removed ${user} from ${group}`);
    }, { permissions: deny });
  }

  bot.help('permissions', 'grant/deny permissions to a user', `
  grant <username> <group> – add the user to permission group
  deny <username> <group> – kick the user from the permissions group
  `);
};
