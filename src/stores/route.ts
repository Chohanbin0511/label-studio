import { defineStore } from 'pinia'
import { ref } from 'vue'
import { httpClient } from '../utils/axios'

export const useRouteStore = defineStore('route', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentData = ref<any>(null)

  async function loadProjectData(projectId: string) {
    loading.value = true
    error.value = null
    try {
      const data = await httpClient.get(`/api/projects/${projectId}`)
      currentData.value = data
    } catch (err) {
      error.value = '프로젝트 데이터를 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadTaskData(projectId: string, taskId: string) {
    loading.value = true
    error.value = null
    try {
      const data = await httpClient.get(`/api/projects/${projectId}/tasks/${taskId}`)
      currentData.value = data
    } catch (err) {
      error.value = '태스크 데이터를 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadWorkspaceData(workspaceId: string) {
    loading.value = true
    error.value = null
    try {
      const data = await httpClient.get(`/api/workspaces/${workspaceId}`)
      currentData.value = data
    } catch (err) {
      error.value = '워크스페이스 데이터를 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadLabelData(workspaceId: string, labelId: string) {
    loading.value = true
    error.value = null
    try {
      const data = await httpClient.get(`/api/workspaces/${workspaceId}/labels/${labelId}`)
      currentData.value = data
    } catch (err) {
      error.value = '라벨 데이터를 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearData() {
    currentData.value = null
    error.value = null
  }

  return {
    loading,
    error,
    currentData,
    loadProjectData,
    loadTaskData,
    loadWorkspaceData,
    loadLabelData,
    clearData
  }
}) 