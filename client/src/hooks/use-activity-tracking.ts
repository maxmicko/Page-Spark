import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const SUPABASE_URL = 'https://jywagmhjzivnjzxgpeuo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5d2FnbWhqeml2bmp6eGdwZXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2NjUsImV4cCI6MjA4NTEyNTY2NX0.mpxLPKWRPAqRiIdWbRI-JQVX6YD5HOvngimurbbouzU'
const TRACK_ACTIVITY_URL = `${SUPABASE_URL}/functions/v1/track-activity`

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

const sendActivity = async (eventType: string, eventData?: any) => {
  const sessionId = getSessionId()
  // For now, user_id is null, can be enhanced later
  const userId = null

  try {
    const response = await fetch(TRACK_ACTIVITY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        url: window.location.href,
      }),
    })
    if (!response.ok) {
      console.error('Failed to send activity:', response.statusText)
    }
  } catch (error) {
    console.error('Failed to send activity:', error)
  }
}

export const useActivityTracking = () => {
  const startTime = useRef(Date.now())
  const scrollDepth = useRef(0)

  useEffect(() => {
    // Track page open
    sendActivity('page_open')

    // Track time spent
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - startTime.current
        sendActivity('time_spent', { duration: timeSpent })
      } else {
        startTime.current = Date.now()
      }
    }

    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime.current
      // Use sendBeacon for reliable sending on unload
      const data = JSON.stringify({
        session_id: getSessionId(),
        user_id: null,
        event_type: 'time_spent',
        event_data: { duration: timeSpent },
        url: window.location.href,
      })
      const blob = new Blob([data], { type: 'application/json' })
      navigator.sendBeacon(TRACK_ACTIVITY_URL, blob)
    }

    // Track scroll
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = Math.round((scrollTop / docHeight) * 100)
        if (scrollPercent > scrollDepth.current) {
          scrollDepth.current = scrollPercent
          sendActivity('scroll', { depth: scrollPercent })
        }
      }, 100) // Throttle
    }

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
        sendActivity('click', {
          element: target.tagName,
          text: target.textContent?.slice(0, 50),
          id: target.id,
          class: target.className,
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Manual tracking functions
  const trackFormSubmit = (formData: any) => {
    sendActivity('form_submit', formData)
  }

  const trackButtonClick = (buttonId: string, buttonText: string) => {
    sendActivity('button_click', { id: buttonId, text: buttonText })
  }

  return { trackFormSubmit, trackButtonClick }
}