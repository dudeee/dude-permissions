const DEFAULTS = {
  grant: ['admins'],
  deny: ['admins']
}

export default bot => {
  let data = bot.data;
  let groups = data.permissions;

  bot.modifiers.middleware('listen', context => {
    if (context.permissions) {
      let user = bot.find(context.user);

      if (Array.isArray(context.permissions)) {
        let access = context.permissions.some(permission => {
          let allowed = groups[permission];

          return allowed.includes(user.name);
        });

        if (!access) return Promise.reject();
      } else {
        let allowed = groups[context.permissions];

        if (!allowed.includes(user.name)) {
          return Promise.reject();
        }
      }
    }

    return Promise.resolve();
  });

  let options = { ...DEFAULTS, ...data.permissions.options };
  let grant = options.grant;

  if (grant) {
    bot.listen(/grant (\w+) (\w+)/i, message => {
      let [, user, group] = message.match;

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
    bot.listen(/deny (\w+) (\w+)/i, message => {
      let [, user, group] = message.match;

      if (!user || !group) {
        return message.reply('deny <username> <group>');
      }

      if (!groups[group]) return message.reply(`Group ${group} doesn't exist`);

      let index = groups[group].indexOf(user);
      groups[group].splice(index, 1);

      message.reply(`Removed ${user} from ${group}`);
    }, { permissions: deny });
  }
}
