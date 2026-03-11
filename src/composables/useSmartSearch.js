import { ref, computed } from 'vue'

/**
 * 智能搜索组合式函数
 * @param {Ref<Array>} dataSource - 数据源
 * @param {Object} options - 配置选项
 */
export function useSmartSearch(dataSource, options = {}) {
  const {
    searchKeys = ['title', 'content'],
    debounceMs = 300,
    maxSuggestions = 8
  } = options

  const searchQuery = ref('')
  const isSearching = ref(false)

  // 同义词词典
  const synonymMap = {
    '焦虑': ['紧张', '不安', '担忧', '压力', '心慌'],
    '抑郁': ['低落', '沮丧', '消沉', '不开心', '郁闷'],
    '失眠': ['睡不着', '睡眠障碍', '熬夜', '睡眠质量差'],
    '压力': ['焦虑', '紧张', '负担', '疲惫'],
    '情绪': ['心情', '感受', '心态', '情感']
  }

  // 拼音映射（简化版）
  const pinyinMap = {
    'jiaolv': '焦虑',
    'yiyu': '抑郁',
    'shimian': '失眠',
    'yali': '压力',
    'qingxu': '情绪'
  }

  // 编辑距离算法
  const levenshteinDistance = (str1, str2) => {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  // 简单相似度计算
  const similarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  // 扩展查询词
  const expandQuery = (query) => {
    const expanded = [query]

    // 同义词扩展
    Object.entries(synonymMap).forEach(([key, synonyms]) => {
      if (query.includes(key) || synonyms.some(s => query.includes(s))) {
        expanded.push(key, ...synonyms)
      }
    })

    // 拼音转中文
    Object.entries(pinyinMap).forEach(([pinyin, chinese]) => {
      if (query.toLowerCase().includes(pinyin)) {
        expanded.push(chinese)
      }
    })

    return [...new Set(expanded)]
  }

  // 计算搜索建议
  const suggestions = computed(() => {
    const query = searchQuery.value.trim()
    if (!query || query.length < 1) return dataSource.value || []

    const expandedQueries = expandQuery(query)
    const results = []
    const data = dataSource.value || []

    data.forEach(item => {
      let score = 0

      searchKeys.forEach(key => {
        const value = String(item[key] || '').toLowerCase()

        expandedQueries.forEach(q => {
          const lowerQ = q.toLowerCase()
          // 完全匹配得分最高
          if (value === lowerQ) score += 10
          // 开头匹配
          else if (value.startsWith(lowerQ)) score += 5
          // 包含匹配
          else if (value.includes(lowerQ)) score += 3
          // 模糊匹配
          else if (similarity(value, lowerQ) > 0.6) score += 1
        })
      })

      if (score > 0) {
        results.push({ ...item, score })
      }
    })

    // 按得分排序并限制数量
    return results.length > 0
      ? results.sort((a, b) => b.score - a.score).slice(0, maxSuggestions)
      : data
  })

  // 防抖搜索
  let debounceTimer = null
  const debouncedSearch = (query) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      searchQuery.value = query
      isSearching.value = true
    }, debounceMs)
  }

  // 高亮搜索文本
  const highlightText = (text) => {
    if (!searchQuery.value) return text
    const query = searchQuery.value.trim()
    if (!query) return text

    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  return {
    searchQuery,
    suggestions,
    isSearching,
    debouncedSearch,
    expandQuery,
    highlightText
  }
}
