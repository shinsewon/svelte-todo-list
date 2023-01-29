import { writable, derived } from "svelte/store";
import Constant from "./constant";
import { v4 as uuid } from "uuid";

function setFormTodo() {
  const todoValue = "";
  const { subscribe, set, update } = writable(todoValue);
  const resetForm = () => set("");

  return {
    subscribe,
    resetForm,
    set,
  };
}

function setTodoData() {
  let initialTodoData = {
    todoLists: [
      { id: uuid(), content: "첫번째 할일", done: false },
      { id: uuid(), content: "두번째 할일", done: false },
      { id: uuid(), content: "세번째 할일", done: true },
    ],
    editMode: "",
    viewMode: Constant.ALL,
  };

  let todoData = { ...initialTodoData };

  const { subscribe, update } = writable(todoData);

  const addTodo = (content) => {
    if (content) {
      const newTodo = {
        id: uuid(),
        content,
        done: false,
      };

      update((datas) => {
        const setData = [...datas.todoLists, newTodo];
        datas.todoLists = setData;
        return datas;
      });
    }
  };
  const editTodo = (editTodo) => {
    update((datas) => {
      const setData = datas.todoLists.map((todo) =>
        todo.id === editTodo.id ? editTodo : todo
      );
      datas.todoLists = setData;
      return datas;
    });
  };
  const removeTodo = (id) => {
    update((datas) => {
      const setData = datas.todoLists.filter((todo) => todo.id !== id);
      datas.todoLists = setData;
      return datas;
    });
  };
  const checkTodo = (id) => {
    update((datas) => {
      const setData = datas.todoLists.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      );
      datas.todoLists = setData;
      return datas;
    });
  };
  const changeTodoEditMode = (id) => {
    update((datas) => {
      datas.editMode = id;
      return datas;
    });
  };
  const changeTodoView = (mode) => {
    update((datas) => {
      datas.viewMode = mode;
      return datas;
    });
  };

  const closeTodoEditMode = () => {
    update((datas) => {
      datas.editMode = "";
      return datas;
    });
  };

  return {
    subscribe,
    addTodo,
    editTodo,
    removeTodo,
    checkTodo,
    changeTodoEditMode,
    closeTodoEditMode,
    changeTodoView,
  };
}

function setFetchTodos() {
  const fetch = derived(todos, ($todos) => {
    if ($todos.viewMode === Constant.ACTIVE)
      return $todos.todoLists.filter((todo) => todo.done === false);
    if ($todos.viewMode === Constant.DONE)
      return $todos.todoLists.filter((todo) => todo.done);
    if ($todos.viewMode === Constant.ALL) return $todos.todoLists;
  });
  return fetch;
}
function setCountTodos() {
  const count = derived(fetchTodos, ($fetchTodos) => $fetchTodos.length);
  return count;
}

export const todoForm = setFormTodo();
export const todos = setTodoData();
export const fetchTodos = setFetchTodos();
export const countTodo = setCountTodos();
