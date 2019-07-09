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

test('Specified alwaysInject = false', async () => {
    const stats = await compiler('example2.js', {
        alwaysInject: false
    });
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`async function func() {
  try {
    await new Promise((resolve, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.log(e);
  }
}`);
});


test('Specified alwaysInject = true', async () => {
    const stats = await compiler('example2.js', {
        alwaysInject: true
    });
    const output = stats.toJson().modules[0].source;
    expect(output).toBe(`async function func() {
  try {
    try {
      await new Promise((resolve, reject) => {
        reject('抛出错误');
      });
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.log(e);
  }
}`);

});
