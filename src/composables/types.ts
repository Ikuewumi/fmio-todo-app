import {z} from "zod";

export type Filters = "all" | "active" | "completed"

export interface Todo {
    checked: boolean
    content: string
}

export interface ProxyTodo {
    todos: Array<Todo>
    filter: Filters
    darkMode: boolean
}



export const zTodo = z.object({
    content: z.string().min(1),
    checked: z.boolean()
})



export const zProxyTodo = z.object({
    filter: z.enum(["all", "active", "completed"]).default("all"),
    darkMode: z.boolean().default(false),
    todos: zTodo.array().default([])
})