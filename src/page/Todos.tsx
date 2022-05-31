import { useEffect, useState } from 'react';
import Progress from '../component/Progress';
import TodoItem from '../component/TodoItem';
import '../styles/todos.scss';
import { v4 as uuidv4 } from 'uuid';
import useTodosStore, { TodoListType } from '../stores/useTodos';

type Filter = 'All' | 'Done' | 'Undone';
type TodosProps = {};
const Todos = (props: TodosProps) => {
    const [todoList, setTodoList] = useState<TodoListType[]>([]);
    const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
    const [filterSelected, setFilterSelected] = useState<Filter>('All');
    const [inputValue, setInputValue] = useState<string>('');
    const todosStore = useTodosStore();

    useEffect(() => {
        initialLoad();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const initialLoad = async () => {
        await todosStore.getTodoList();
        onFilterTodoList(filterSelected);
    };

    const onFilterTodoList = (key: Filter) => {
        let data = todosStore.todoList;
        switch (key) {
            case 'Done':
                data = data.filter((item) => item.completed !== false);
                break;
            case 'Undone':
                data = data.filter((item) => item.completed !== true);
                break;
            default:
                break;
        }
        setTodoList(data);
    };

    const onSearchTodo = (key: Filter) => {
        setFilterSelected(key);
        onFilterTodoList(key);
        setIsOpenDropdown(!isOpenDropdown);
    };

    const onClickDropdown = () => {
        setIsOpenDropdown(!isOpenDropdown);
    };

    const onTextChange = (value: string) => {
        setInputValue(value.trim());
    };

    const checkSubmitValue = (key: string) => {
        if (key === 'Enter' && inputValue !== '') {
            onAddTodo();
        }
    };

    const onAddTodo = async () => {
        let param = { id: uuidv4(), title: inputValue, completed: false };
        await todosStore.addTodoList(param);
        const input = document.querySelector('input[name=input-todo]');

        if (input !== null) {
            //@ts-ignore
            input.value = '';
        }
        initialLoad();
    };

    const onUpdateTodo = async (data: TodoListType) => {
        await todosStore.updateTodoList(data);
        initialLoad();
    };

    const onDeleteTodo = async (id: string) => {
        await todosStore.deleteTodoList(id);
        initialLoad();
    };

    window.onclick = (event) => {
        //@ts-ignore
        if (!event.target.matches('li') && !event.target.matches('#dropdown')) {
            setIsOpenDropdown(false);
        }
    };

    return (
        <div className='container'>
            <Progress />
            <div className='title-section'>
                <h2>Tasks</h2>
                <div className='dropdown'>
                    <div
                        className='select'
                        id='dropdown'
                        onClick={(e) => onClickDropdown()}
                    >
                        <span className='selected'>{filterSelected}</span>
                        <img
                            id='dropdown'
                            alt='icon_select'
                            src='icon_select.svg'
                            style={{
                                transform: `${
                                    isOpenDropdown ? 'rotate(180deg)' : ''
                                } `,
                            }}
                        />
                    </div>
                    <ul
                        className='menu'
                        style={{
                            visibility: `${
                                isOpenDropdown ? 'visible' : 'hidden'
                            }`,
                        }}
                    >
                        <li onClick={(e) => onSearchTodo('All')}>All</li>
                        <li onClick={(e) => onSearchTodo('Done')}>Done</li>
                        <li onClick={(e) => onSearchTodo('Undone')}>undone</li>
                    </ul>
                </div>
            </div>
            <div className='result-section'>
                {todoList.map((item) => (
                    <TodoItem
                        data={item}
                        key={item.id}
                        onUpdateTodo={onUpdateTodo}
                        onDeleteTodo={onDeleteTodo}
                    />
                ))}
            </div>
            <div className='input-section'>
                <input
                    type='text'
                    name='input-todo'
                    placeholder='Add your todo...'
                    maxLength={30}
                    onChange={(e) => onTextChange(e.target.value)}
                    onKeyDown={(e) => checkSubmitValue(e.key)}
                />
            </div>
        </div>
    );
};

export default Todos;
