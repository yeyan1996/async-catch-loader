const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const t = require("@babel/types")
const core = require("@babel/core")
const loaderUtils = require("loader-utils");

const DEFAULT = {
    catchCode:identifier => `console.error(${identifier})`,
    alwaysInject:false,
    identifier:"e"
}

module.exports = function (source) {
    let options = loaderUtils.getOptions(this)
    let ast = parser.parse(source,{
        sourceType:'module', // 支持 es6 module
        plugins:['dynamicImport'] // 支持动态 import
    })
    options = {
        ...DEFAULT,
        ...options,
    }
    if(typeof options.catchCode === 'function') {
        options.catchCode = options.catchCode(options.identifier)
    }
    let catchAst = parser.parse( options.catchCode)
    let catchBody = catchAst.program.body
    traverse(ast, {
        AwaitExpression(path) {
            if (path.node.done) return
            path.node.done = true //防止 AwaitExpression 无限递归导致栈溢出

            if (
                !options.alwaysInject &&
                path.findParent((path) => t.isTryStatement(path.node))
            ) return // 当当前 Ast 的父级包含 try/catch，则取消这次注入

            let identifierAst = t.identifier(options.identifier)

            if (t.isVariableDeclarator(path.parent)) { // 变量声明
                let variableDeclarationPath = path.parentPath.parentPath
                let tryCatchAst = t.tryStatement(
                    t.blockStatement([
                        variableDeclarationPath.node // Ast
                    ]),
                    t.catchClause(identifierAst, t.blockStatement(catchBody))
                )
                variableDeclarationPath.replaceWithMultiple([
                    tryCatchAst
                ])
            } else if (t.isAssignmentExpression(path.parent)) { // 赋值表达式
                let expressionStatementPath = path.parentPath.parentPath
                let tryCatchAst = t.tryStatement(
                    t.blockStatement([
                        expressionStatementPath.node
                    ]),
                    t.catchClause(identifierAst, t.blockStatement(catchBody))
                )
                expressionStatementPath.replaceWithMultiple([
                    tryCatchAst
                ])
            } else { // await 表达式
                let tryCatchAst = t.tryStatement(
                    t.blockStatement([
                        t.expressionStatement(path.node)
                    ]),
                    t.catchClause(identifierAst, t.blockStatement(catchBody))
                )
                path.replaceWithMultiple([
                    tryCatchAst
                ])
            }
        }
    })
    return core.transformFromAstSync(ast,null,{
        configFile:false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
    }).code
}
