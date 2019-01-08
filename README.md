# PasswordStrengthTest
  仅仅是一个用于测试密码强度的demo，测试强度的pure方法很容易从代码中分离。

## Pure Function

```js
  const additionBonusArray = _.map(Additions, (item) => (item(password)));
  const deductionBonusArray = _.map(Deductions, (item) => (item(password)));
  const bonusArray = [...additionBonusArray, ...deductionBonusArray];

  const bonus = _.reduce(bonusArray, (result, value) => {
    return result + value.bonus;
  }, 0);
```
