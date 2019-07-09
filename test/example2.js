async function func() {
    try {
        await new Promise((resolve,reject)=>{
            reject('抛出错误')
        })
    } catch (e) {
        console.log(e)
    }
}
