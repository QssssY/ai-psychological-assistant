import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * TTS语音播报功能
 * 使用Web Speech API实现
 */
export function useTTS() {
  // 播放状态
  const isPlaying = ref(false)
  const currentMessageId = ref(null)

  // 获取语音合成对象
  const synth = window.speechSynthesis

  // 检查浏览器支持
  const isSupported = computed(() => {
    return 'speechSynthesis' in window
  })

  /**
   * 播放文本
   * @param {string} text - 要播报的文本
   * @param {string|number} messageId - 消息ID，用于标识当前播放的消息
   */
  const speak = (text, messageId) => {
    if (!isSupported.value) {
      ElMessage.warning('浏览器不支持TTS功能')
      return false
    }

    // 如果正在播放，先停止
    if (isPlaying.value) {
      stop()
    }

    // 创建语音实例
    const utterance = new SpeechSynthesisUtterance(text)

    // 设置语音参数
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // 尝试使用中文音色
    const voices = synth.getVoices()
    const zhVoice = voices.find(v => v.lang.includes('zh'))
    if (zhVoice) {
      utterance.voice = zhVoice
    }

    // 事件监听
    utterance.onstart = () => {
      isPlaying.value = true
      currentMessageId.value = messageId
    }

    utterance.onend = () => {
      isPlaying.value = false
      currentMessageId.value = null
    }

    utterance.onerror = (event) => {
      // 忽略 interrupted 错误（用户主动停止）
      if (event.error === 'interrupted') {
        ElMessage.info('TTS播放中断')
      } else {
        const errorMsg = `TTS播放错误: ${event.error || '未知错误'}`
        ElMessage.error(errorMsg)
      }
      isPlaying.value = false
      currentMessageId.value = null
    }

    // 开始播放
    synth.speak(utterance)
    return true
  }

  /**
   * 停止播放
   */
  const stop = () => {
    if (synth) {
      synth.cancel()
    }
    isPlaying.value = false
    currentMessageId.value = null
  }

  /**
   * 检查指定消息是否正在播放
   * @param {string|number} messageId - 消息ID
   */
  const isPlayingMessage = (messageId) => {
    return isPlaying.value && currentMessageId.value === messageId
  }

  return {
    isSupported,
    isPlaying,
    currentMessageId,
    speak,
    stop,
    isPlayingMessage
  }
}
