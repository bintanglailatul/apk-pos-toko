"use client"

import { useEffect, useState } from "react"

export function useSettings() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
  }, [])

  return settings
}