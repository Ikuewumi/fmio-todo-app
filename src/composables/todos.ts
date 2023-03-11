import { changeTheme, selectCategory, writeFreq, writeTodos } from "./markUp"
import { Filters, ProxyTodo, Todo, zProxyTodo, zTodo } from "./types"



const ls = 'fmio-ik-todo-app';


/**
 * 
 * @param {string} todo The todo as a string
 * @returns {number} the index of the string in the todos array
 */
const findIndex = (todo: string): number => {
    const index = appData.todos.findIndex(todo_ => 
        todo_.content.toLowerCase().trim() === todo.toLowerCase().trim()
    )

    return index
}




const storeData = (obj: ProxyTodo) => {
    const data = JSON.stringify(obj)
    localStorage.setItem(ls, data)
}



const getData = () => {
    const lsRes = JSON.parse(localStorage.getItem(ls)!)
    let data: ProxyTodo;
    if (!lsRes) {data = zProxyTodo.parse({})}  
    data = zProxyTodo.strip().parse(lsRes)

    return data
}





export const filterTodos = (filter: Filters, todos: Todo[]) => {
    let result: Array<Todo>
    switch (filter) {
        case "active":
            result = todos.filter(todo => !todo.checked)
            break;
        case "completed":
            result = todos.filter(todo => todo.checked)
            break;
        case "all":
        default:
            result = todos
            break;
    }
    console.log(result, filter)
    return result
}




const _privateData = {
    todos: [] as Array<Todo>,
    filter: "all",
    darkMode: false
}


export const appData = new Proxy(_privateData, {
    get(prop: ProxyTodo, p: string) {
        return prop[p]
    },


    set(prop: ProxyTodo, p: string, newVal: any) {
        if (p === 'todos') {
            const newValue = newVal as Array<Todo>
            console.log(prop.filter)
            const t = filterTodos(prop.filter, newValue)
            console.log(newValue, t)
            writeTodos(t)
            const completeCount = newValue.filter(todo => todo.checked).length
            writeFreq(completeCount)
        }
        
        if (p === 'filter') {
            const t = filterTodos(newVal as Filters, prop.todos)
            console.log(newVal)
            selectCategory(newVal)
            writeTodos(t)
            const completeCount = prop.todos.filter(todo => todo.checked).length
            writeFreq(completeCount)
        }

        if (p === "darkMode") {
            changeTheme(newVal)
        }

        const newObject = {...prop}
        newObject[p] = newVal

        storeData(newObject)
        const lsObject = getData()
        console.log('local storage')

        return Reflect.set(prop, p, newVal)
    }
})

// appData.todos = []



const setup = () => {
    const lsData = getData()


    appData.darkMode = lsData.darkMode
    appData.filter = lsData.filter
    appData.todos = lsData.todos

}

setup()







export const addNewTodo = (str: string = "") => {
    const res = zTodo.safeParse({content: str.trim() ,checked: false})
    const todoIsUnique = findIndex(str) === -1
    
    if (!res.success) throw Error("please add some text")
    if (!todoIsUnique) throw Error("duplicate value detected!")
    
    appData.todos = [...appData.todos, res.data]
    
    return appData.todos
}











export const checkTodo = (str: string) => {
    const index = findIndex(str)
    appData.todos = appData.todos.map((todo, i) => {
        if (i !== index) {return todo}
        else { return { ...todo, checked: !todo.checked }}
    })
}


export const removeTodo = (str: string) => {
    const index = findIndex(str)
    appData.todos = appData.todos.filter((_, i) => i !== index)
}




export const clearCompleted = () => {
    appData.todos = appData.todos.filter(todo => !todo.checked)
}



export {}