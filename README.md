<h1 align="center">Welcome to nested-object-validate 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/nested-object-validate" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/nested-object-validate.svg">
  </a>
  <a href="https://www.github.com/al-imam/nested-object-validate#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

> object validation package for my personal use!

### 🏠 [Homepage](https://www.github.com/al-imam/nested-object-validate)

## Install

```sh
npm install
```

## how to use it

```typescript
import validate from "nested-object-validate";

/*
  validate function takes 3 argument
  1. argument takes object
  2. argument take validators arrays
*/

/*
  basic validation only check is property is exist
  - validate({ name: 54 }, ["name"])
*/

validate({ name: 54 }, ["name"]);
/*
  basic validation pass, but it that all you want name should be string
  you have more access to validate property
*/

/*
  there is array support where second index is callback
  callback called with property value do what ever you want to value
  return true if pass return false is failed test
  - validate(object, [["name", callback], "age"])
*/

validate({ name: 54 }, [["name", (name) => typeof name === "string"]]);
/*
  test failed because name is number here
  but what if the name is object of first and last?

  - validate({name: {first: "", last: ""}}, ["name"])

  recursion is solution but validate function return static 
  so i made a wrapper of validation
  call in callback second argument
*/

validate({ name: { first: "al", last: "imam" } }, [
  ["name", (name, v) => v(name, ["first", "last"])],
]);
/*
  test pass you can ensure first and last exist
  you should know that callback function is instance of validate function
  just formate return value and return true or false
*/
```

## Author

👤 **al-imam**

- Github: [@al-imam](https://github.com/al-imam)
- LinkedIn: [@alimam](https://linkedin.com/in/alimam)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://www.github.com/al-imam/nested-object-validate#issues). You can also take a look at the [contributing guide](https://wwwhub.com/al-imam/nested-object-validate/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!
