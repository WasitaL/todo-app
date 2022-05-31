import { createContext, useContext } from 'react';
import { observable, action } from 'mobx';
import axios from 'axios';
export type TodoListType = {
    id: string;
    title: string;
    completed: boolean;
};
class TodosStore {
    @observable todoList: TodoListType[] = [];
    @action getTodoList = async () => {
        try {
            let response = await axios.get('http://localhost:3001/todos');
            this.todoList = response.data;
        } catch (error) {
            console.log('error->', error);
        }
    };

    @action updateTodoList = async (param: TodoListType) => {
        try {
            await axios.put('http://localhost:3001/todos/' + param.id, param);
        } catch (error) {
            console.log('error->', error);
        }
    };

    @action deleteTodoList = async (id: string) => {
        try {
            await axios.delete('http://localhost:3001/todos/' + id);
        } catch (error) {
            console.log('error->', error);
        }
    };
    @action addTodoList = async (param: TodoListType) => {
        try {
            await axios.post('http://localhost:3001/todos', param);
        } catch (error) {
            console.log('error->', error);
        }
    };
}

const todosStore = new TodosStore();
const TodosStoreContex = createContext(todosStore);
const useTodosStore = () => useContext(TodosStoreContex);

export default useTodosStore;
