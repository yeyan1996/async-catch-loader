# async-catch-loader

English | [中文](./README-zh_CN.md)

A webpack loader that can automatically injects try/catch into async function

In development, async/await asynchronous programming is often used, and try/catch is frequently used to catch asynchronous errors, which makes the business code full of try/catch very redundant. 

Using this loader, you can only automatically inject try/catch into the packaged code. Makes the business code very simple


```javascript
async function func() {
    let res = await new Promise(resolve => {
        setTimeout(() => {
            resolve('success')
        }, 3000)
    })
}
```

try/catch is automatically injected after packaging

```javascript
async function func() {
    try {
       let res = await new Promise(resolve => {
            setTimeout(() => {
                resolve('success');
            }, 3000);
        });
    } catch (e) {
    //...
    }
}
```

## Install

```
npm i async-catch-loader -D
```

## Usage

```javascript
// webpack.config.js
module: {
    rules: [
        {
            test: /\.js$/,
            use:{
                loader:'async-catch-loader',
                options:{
                    catchCode:`alert(e)`
                }
            }
        }
    ]
}
```

## Options
|       Name        |    Type    |       Default        | Description         |
|:-----------------:|:----------:|:--------------------:|:--------------------|
| **`identifier`**  | `{string}` |        `"e"`         | `The error object identifier in the catch clause` |
|  **`catchCode`**  | `{string}` | `"console.error(e)"` | `Code snippet in the catch clause`    |
| **`finallyCode`** | `{string}` |     `undefined`      | `The code snippet in the finally clause`  |

