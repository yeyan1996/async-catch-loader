# async-catch-loader
一个自动给 async 函数注入 try/catch 的 webpack loader

在开发中经常会使用 async/await 异步编程，同时也会频繁的使用 try/catch 捕获异步中的错误，使得业务代码充斥这 try/catch 非常的冗余，使用这个 loader 可以只在打包后的代码自动注入 try/catch，使得业务代码非常简洁

```javascript
async function func() {
    let res = await new Promise(resolve => {
        setTimeout(() => {
            resolve('success')
        }, 3000)
    })
}
```

打包后自动注入 try/catch
```javascript
async function func() {
    try {
       let res = await new Promise(resolve => {
            setTimeout(() => {
                resolve('success');
            }, 3000);
        });
    } catch (e) {//...}
}
```

## Install

```javascript
npm i async-catch-loader
```

## Usage

```
// webpack.config.js

module: {
    rules: [
        {
            test: /\.js$/,
            use:{
                loader:'async-catch-loader',
                options:{
                    cacheCode:`alert(e)`
                }
            }
        }
    ]
}
```

## Options
|Name|Type|Description|
|:--:|:--:|:----------|
|**`catchCode`**|`{String}`|`catch 子句中的代码片段，错误对象的变量名为 e`



