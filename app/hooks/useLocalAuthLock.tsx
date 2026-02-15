import { useCallback, useEffect, useMemo, useState } from "react"
import * as LocalAuthentication from "expo-local-authentication"

type UseLocalAuthLockParams = {
  /** When false, the hook stays idle and never checks biometrics */
  isEnabled: boolean
  /** Used to reset the lock state when the entity changes */
  resetKey?: string | number
  /** Optional copy overrides */
  promptMessage?: string
  cancelLabel?: string
  fallbackLabel?: string
  disableDeviceFallback?: boolean
}

export function useLocalAuthLock({
  isEnabled,
  resetKey,
  promptMessage = "Authenticate to access classified information",
  cancelLabel = "Not now",
  fallbackLabel = "Use passcode",
  disableDeviceFallback = false,
}: UseLocalAuthLockParams) {
  const [isBiometricReady, setIsBiometricReady] = useState<boolean | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Reset lock state when the entity changes
  useEffect(() => {
    setIsUnlocked(false)
    setAuthError(null)
    setIsAuthLoading(false)
  }, [resetKey, isEnabled])

  // Only check biometrics when enabled.
  useEffect(() => {
    let mounted = true

    async function checkBiometrics() {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        if (!mounted) return
        setIsBiometricReady(hasHardware && isEnrolled)
      } catch {
        if (!mounted) return
        setIsBiometricReady(false)
      }
    }

    if (isEnabled) {
      setIsBiometricReady(null)
      checkBiometrics()
    } else {
      setIsBiometricReady(null)
    }

    return () => {
      mounted = false
    }
  }, [isEnabled])

  const authenticate = useCallback(async () => {
    if (!isEnabled) return false
    if (isBiometricReady !== true) return false

    setAuthError(null)
    setIsAuthLoading(true)

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel,
        fallbackLabel,
        disableDeviceFallback,
      })

      if (result.success) {
        setIsUnlocked(true)
        return true
      }

      setAuthError("Authentication failed. Try again.")
      return false
    } catch {
      setAuthError("Biometric authentication isn’t available right now.")
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }, [
    cancelLabel,
    disableDeviceFallback,
    fallbackLabel,
    isBiometricReady,
    isEnabled,
    promptMessage,
  ])

  const shouldShowLockCard = useMemo(() => {
    // Match your original behavior:
    // show lock card when enabled + locked + biometrics not explicitly false
    return isEnabled && !isUnlocked && isBiometricReady !== false
  }, [isBiometricReady, isEnabled, isUnlocked])

  return {
    isBiometricReady,
    isUnlocked,
    isAuthLoading,
    authError,
    shouldShowLockCard,
    authenticate,
    setIsUnlocked,
    setAuthError,
  }
}
