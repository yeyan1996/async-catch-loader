const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const t = require("@babel/types")
const core = require("@babel/core")
const loaderUtils = require("loader-utils");

const DEFAULT = {
    cacheCode: `console.warn(e)`
}

module.exports = function (source) {
    let options = loaderUtils.getOptions(this)
    let ast = parser.parse(source)
    options = {
        ...DEFAULT,
        ...options,
    }
    let catchBody = []
    let catchAst = parser.parse(options.catchCode)
    catchBody = catchAst.program.body
    traverse(ast, {
        AwaitExpression(path) {
            if (path.node.done) return
            path.node.done = true //防止 AwaitExpression 无限递归导致栈溢出

            let identifierAst = t.identifier('e')
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
    return core.transformFromAst(ast).code
}
