export default bot => {
  let groups = bot.data.permissions;

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
}
