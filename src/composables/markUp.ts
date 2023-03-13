import { addNewTodo, appData, checkTodo, clearCompleted, findIndex, removeTodo, switchTodos } from "./todos";
import { Filters, Todo, zTodo } from "./types";

const main = document.querySelector('main')! as HTMLDivElement;
const bodyEl = document.querySelector('body')! as HTMLElement;
const themeEl = bodyEl.querySelector('.theme')! as HTMLElement;
const todoSection = main.querySelector('.all-todos')! as HTMLElement;
const todosEl = main.querySelector('ul#todos')! as HTMLUListElement;
const freqInfo = main.querySelector('small#todo-numbers')! as HTMLSpanElement;
const clearEl = main.querySelector('button#clear-completed')! as HTMLSpanElement;
const formEl = main.querySelector('form')! as HTMLFormElement
const inputEl = formEl.querySelector('input')! as HTMLInputElement
const categories = main.querySelectorAll('.categories');





themeEl.addEventListener('click', _ => {appData.darkMode = !appData.darkMode})


export const changeTheme = (darkMode: boolean) => {
    if (darkMode) bodyEl.classList.add('dark')
    else bodyEl.classList.remove('dark')
}





Array.from(categories).forEach(category => {
    category.addEventListener('click', (e) => {
        const el = e.target as unknown as HTMLElement
        const elIsButton = el.tagName.toLowerCase() === 'button'


        if (elIsButton) {
            appData.filter = el.textContent?.trim().toLowerCase() as Filters
        }



        return
    })
})
// const 








formEl?.addEventListener('submit', (e) => {
    e.preventDefault()
    addNewTodo(inputEl?.value)
    appData.filter = "all"


    formEl.reset()
})




todosEl.addEventListener('click', (e) => {
    const el = e.target as unknown as HTMLButtonElement
    const attributes = Array.from(el.attributes) as unknown as Array<Attr>
    
    const elIsCheckBtn = typeof el.getAttribute("data-checkbox")==='string'
    const elIsCloseBtn = typeof el.getAttribute("data-close")==='string'
    const elIsButton = el.tagName.toLowerCase() === "button" && (elIsCheckBtn || elIsCloseBtn);

    if (!elIsButton) return


    if (elIsCheckBtn) {
        const todo = String(el.nextElementSibling?.textContent)
        checkTodo(todo)
    }
    
    
    
    if (elIsCloseBtn) {
        const todo = String(el.previousElementSibling?.textContent)
        removeTodo(todo)
    }



})



clearEl.addEventListener('click', (e) => {clearCompleted()})


export const selectCategory = (filter: Filters) => {

        main.querySelectorAll('.categories button').forEach(button => {
            button.classList.remove('active');
            const isValid = button.textContent?.toLowerCase() === filter;
            if (isValid) button.classList.add('active');
        })


}



const addDragListeners = () => {


    let prevIndex = -1;
    let newIndex = -1;


    todosEl.addEventListener('drag', (e) => {
        e.preventDefault()
        const el = e.target! as HTMLElement 
        const elIsTodo = el.tagName.toLowerCase() === 'li';
        if (elIsTodo) { prevIndex = findIndex(el.textContent!) }
    })




    todosEl.addEventListener('dragover', (e) => {
        e.preventDefault()
        const el = e.target! as HTMLElement 
        const elIsTodo = el.tagName.toLowerCase() === 'li';
        if (elIsTodo) el.classList.add('dragover')
    })





    todosEl.addEventListener('dragleave', (e) => {
        e.preventDefault()
        const el = e.target! as HTMLElement 
        const elIsTodo = el.tagName.toLowerCase() === 'li';
        if (elIsTodo) el.classList.remove('dragover');
    })


    todosEl.addEventListener('dragend', (e) => {
        e.preventDefault()
    })



    todosEl.addEventListener('drop', (e) => {
        e.preventDefault()
        const el = e.target! as HTMLElement 
        const elIsTodo = el.tagName.toLowerCase() === 'li';
        if (elIsTodo) {
            el.classList.remove('dragover')
            newIndex = findIndex(el.textContent!)
            switchTodos(prevIndex, newIndex)
        }
    })




}


const removeDragListeners = () => {
    todosEl.removeEventListener('dragover', _ => {})
    todosEl.removeEventListener('dragend', _ => {})
    todosEl.removeEventListener('dragenter', _ => {})
    todosEl.removeEventListener('dragleave', _ => {})
    todosEl.removeEventListener('dragover', _ => {})
    todosEl.removeEventListener('drop', _ => {})
    todosEl.removeEventListener('dragstart', _ => {})
}



export const writeTodos = (todos: Array<Todo>) => {

    todosEl.innerHTML = ``
    todos.map(todo => {

        const html = `
            <li class="todo pc ${todo?.checked ? 'checked' : ''}" draggable="true">
                <button data-checkbox title="check!"><svg viewBox="0 0 11 9"><use href="#check"></use></svg></button>
                <span>${todo.content}</span>
                <button data-close title="remove todo"><svg viewBox="0 0 18 18"><use href="#cross"></use></svg></button>
            </li>
        `

        todosEl.innerHTML += html

    })
    
    // Add CLass to show the empty state
    if (todos.length === 0) { todoSection.classList.add('empty') }
    else { todoSection.classList.remove('empty') }


    removeDragListeners()
    addDragListeners()



}




export const writeFreq = (n: number) => {
    freqInfo.textContent = `${n} items completed`
}


