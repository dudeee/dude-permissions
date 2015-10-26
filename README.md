bolt-permissions
================

Setup permissions in `initialize`:
```javascript
export default bot => {
  bot.data = {
    permissions: {
      admins: ['mahdi', 'milani'],
      designers: ['ehsan', 'ali', 'mohsen'],

      options: {
        grant: ['admins']
      }
    }
  };
}
```

Now, pass `permissions` in params of `listen`:
```javascript
bot.listen(/config/i, message => {
  console.log('You are an admin! You have access!');
}, { permissions: ['admins'] });
```

grant, deny
-----------
Users specified in the `options.grant` and `options.deny` array are given the permission to grant or deny
a user to a permission group. Enabled by default for the `admins` group.

For example:

```
grant milani admin
deny ehsan designer
```

To disable the commands:
```
bot.data.permissions = {
  options: {
    grant: false,
    deny: false
  }
}
```
