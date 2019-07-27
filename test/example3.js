const func = async () => {
    await new Promise((resolve, reject) => {
        reject('抛出错误')
    })
}