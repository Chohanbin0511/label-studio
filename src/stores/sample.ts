import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Todo, SampleState, Pagination } from '@/types/sample'
import { v4 as uuidv4 } from 'uuid'

export const useSampleStore = defineStore('sample', () => {
  // 상태
  const users = ref<User[]>([])
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination>({
    page: 1,
    limit: 10,
    total: 0
  })

  // getters
  const completedTodos = computed(() => todos.value.filter(todo => todo.completed))
  const incompleteTodos = computed(() => todos.value.filter(todo => !todo.completed))

  // actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      // 실제 API 호출 대신 더미 데이터 생성
      const dummyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
        id: uuidv4(),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i === 0 ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      }))
      
      users.value = dummyUsers
      pagination.value.total = dummyUsers.length
    } catch (e) {
      error.value = 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      completed: false,
      order: todos.value.length
    }
    todos.value.push(newTodo)
  }

  const toggleTodo = (id: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const reorderTodos = (newTodos: Todo[]) => {
    todos.value = newTodos.map((todo, index) => ({
      ...todo,
      order: index
    }))
  }

  const updatePagination = (page: number) => {
    pagination.value.page = page
  }

  return {
    // 상태
    users,
    todos,
    loading,
    error,
    pagination,
    // getters
    completedTodos,
    incompleteTodos,
    // actions
    fetchUsers,
    addTodo,
    toggleTodo,
    reorderTodos,
    updatePagination
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['todos', 'pagination']
  } as any
}) 