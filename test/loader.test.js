const compiler = require('./compiler.js');

test('should works without options', async () => {
    const stats = await compiler('example.js');
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`async function func() {
  try {
    await new Promise((resolve, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.error(e);
  }
}`);
});


test('should works on asynchronous function expression', async () => {
    const stats = await compiler('example3.js');
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`const func = async () => {
  try {
    await new Promise((resolve, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.error(e);
  }
};`);
});


test('Specified identifier', async () => {
    const stats = await compiler('example.js', {
        identifier: "err"
    });
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`async function func() {
  try {
    await new Promise((resolve, reject) => {
      reject('抛出错误');
    });
  } catch (err) {
    console.error(err);
  }
}`);
});

test('Specified catchCode', async () => {
    const stats = await compiler('example.js', {
        identifier: "errObject",
        catchCode: "console.log(errObject)"
    });
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`async function func() {
  try {
    await new Promise((resolve, reject) => {
      reject('抛出错误');
    });
  } catch (errObject) {
    console.log(errObject);
  }
}`);
});

test('Specified finallyCode', async () => {
    const stats = await compiler('example.js', {
        finallyCode: `console.log("finally");`
    });
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`async function func() {
  try {
    await new Promise((resolve, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log("finally");
  }
}`);
});