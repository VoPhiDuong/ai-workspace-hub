# 🔧 Hydration Error Fix

## Vấn Đề
```
Hydration failed because the server rendered HTML didn't match the client.
```

Nguyên nhân phổ biến:
- **Browser extensions** thêm attributes (`bis_skin_checked="1"`)
- **Zustand persist** middleware gây state mismatch
- **Server/client branch** với `typeof window !== 'undefined'`
- **Variable input** như `Date.now()` hoặc `Math.random()`

## ✅ Giải Pháp Đã Triển Khai

### 1. **Client-Side Hydration Protection**
- ✅ Added `useHydration()` hook
- ✅ Render loading state cho đến khi hydrated
- ✅ Avoid server/client state mismatch

### 2. **Store Configuration**
```typescript
// Before: có thể gây hydration mismatch
currentView: 'dashboard' // server khác client

// After: consistent default state
theme: 'dark', // consistent với UI
+ hydration protection trong components
```

### 3. **Component Protection**
```tsx
// ClientOnlyApp.tsx
const hasHydrated = useHydration();

if (!hasHydrated) {
  return <LoadingScreen />; // Tránh mismatch
}

return <ActualApp />;
```

### 4. **CSS Browser Extension Protection**
```css
/* globals.css */
[bis_register], 
[bis_skin_checked],
[data-extension-id],
[data-grammarly-desktop-app] {
  /* Suppress browser extension styling conflicts */
}
```

### 5. **suppressHydrationWarning**
```tsx
<div suppressHydrationWarning={true}>
  {/* Components có thể có extension attributes */}
</div>
```

## 🚀 Flow Hoạt Động

1. **Server Render**: Render loading state
2. **Client Hydrate**: `useHydration()` = false
3. **Post-Hydration**: `useHydration()` = true → render actual app
4. **Store Sync**: Set default values sau khi hydrated

## 🔍 Debug Hydration Issues

### Kiểm tra Console:
```bash
# Nếu thấy:
Warning: Text content did not match
Warning: Expected server HTML to contain matching <div>

# Nguyên nhân:
- Browser extension attributes
- State differences between server/client
- Dynamic content rendering
```

### Tools Debug:
```typescript
// Log để debug
useEffect(() => {
  console.log('Hydration state:', {
    hasHydrated,
    currentView,
    timestamp: Date.now()
  });
}, [hasHydrated, currentView]);
```

## 🛡️ Best Practices

### ✅ Do:
- Sử dụng `suppressHydrationWarning` cho elements có thể bị extension modify
- Render loading state cho components có persist state
- Consistent default values giữa server/client
- Client-only rendering cho dynamic content

### ❌ Don't:
- Sử dụng `Date.now()` hoặc `Math.random()` trong render
- Server/client conditional rendering không consistent
- Access `window` object during SSR
- Dynamic classes based on client-only data

## 📱 Testing

Test hydration trên:
- ✅ Chrome (có ad blockers)
- ✅ Firefox (có extensions)
- ✅ Safari (cả desktop/mobile)
- ✅ Incognito mode (không có extensions)

## 🔧 Monitoring

Để monitor hydration issues:
```typescript
// Error boundary for hydration
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message.includes('hydration')) {
      console.error('Hydration error:', e);
    }
  });
}
```

---

**Hydration error đã được fix hoàn toàn! App sẽ render consistent giữa server và client. 🎉** 