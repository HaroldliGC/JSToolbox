# JavaScript常用工具箱
  平时收集的一些常用的js方法或者工具

## password strength test function
  仅仅是一个用于测试密码强度的方法和一个测试用的ddemo，测试密码强度的pure方法如下所示。

```js
  const bonusArray = getPasswordBonus(password);
  const bonus = _.reduce(bonusArray, (result, value) => {
    return result + value.bonus;
  }, 0);
```
## array to trees function
  一个用于将数组转换为森林(树)的方法