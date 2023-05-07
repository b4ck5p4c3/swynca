'use client';
import React, { useEffect } from 'react'

export default function AuthRedirect() {
  useEffect(() => { window.location.href = '/api/auth/signin'; });
  return <html>
    <body />
  </html>
}
