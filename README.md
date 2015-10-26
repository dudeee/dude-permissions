bolt-permissions
================

Setup permissions in `initialize`:
```javascript
export default bot => {
  bot.data = {
    permissions: {
      admin: ['mahdi', 'milani'],
      designer: ['ehsani', 'ali', 'mohsen']
    }
  };
}
```

Now, pass `permissions` in params of `listen`:
```javascript
bot.listen(/config/i, message => {
  console.log('You are an admin! You have access!');
}, { permissions: ['admin'] });
```
