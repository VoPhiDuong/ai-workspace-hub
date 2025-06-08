/**
 * An toàn copy text vào clipboard với fallback methods
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Method 1: Modern Clipboard API (chỉ hoạt động trên HTTPS hoặc localhost)
    if (navigator?.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      console.log('✅ Đã copy bằng Clipboard API');
      return true;
    }

    // Method 2: Fallback sử dụng document.execCommand (deprecated nhưng vẫn hoạt động)
    return fallbackCopyTextToClipboard(text);

  } catch (error) {
    console.error('❌ Lỗi copy với Clipboard API:', error);
    
    // Fallback nếu Clipboard API thất bại
    return fallbackCopyTextToClipboard(text);
  }
}

/**
 * Fallback method sử dụng selection và execCommand
 */
function fallbackCopyTextToClipboard(text: string): boolean {
  try {
    // Tạo textarea ẩn
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Style để ẩn element
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    // Thêm vào DOM
    document.body.appendChild(textArea);
    
    // Focus và select text
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Cho mobile
    
    // Copy
    const successful = document.execCommand('copy');
    
    // Cleanup
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log('✅ Đã copy bằng fallback method');
      return true;
    } else {
      console.error('❌ Fallback copy thất bại');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Lỗi fallback copy:', error);
    return false;
  }
}

/**
 * Copy text với toast notification và visual feedback
 */
export async function copyWithToast(
  text: string, 
  onSuccess?: () => void, 
  onError?: (error: string) => void
): Promise<void> {
  const success = await copyToClipboard(text);
  
  if (success) {
    onSuccess?.();
    console.log('📋 Đã copy vào clipboard!');
    
    // Visual feedback với temporary notification
    showTemporaryToast('✅ Đã copy thành công!', 'success');
  } else {
    const errorMsg = 'Không thể copy. Vui lòng copy thủ công.';
    onError?.(errorMsg);
    console.error('📋 ' + errorMsg);
    
    // Show error feedback
    showTemporaryToast('❌ Copy thất bại. Thử lại!', 'error');
  }
}

/**
 * Hiển thị temporary toast notification
 */
function showTemporaryToast(message: string, type: 'success' | 'error' = 'success') {
  // Tạo toast element
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-[9999] px-4 py-2 rounded-md text-white font-medium transition-all duration-300 transform translate-x-0 ${
    type === 'success' 
      ? 'bg-green-600 border border-green-500' 
      : 'bg-red-600 border border-red-500'
  }`;
  toast.textContent = message;
  
  // Style cho animation
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });
  
  // Animate out và remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

/**
 * Check xem clipboard có khả dụng không
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator?.clipboard && window.isSecureContext) || 
         !!(document.queryCommandSupported && document.queryCommandSupported('copy'));
}

/**
 * Copy với prompt fallback cho mobile
 */
export async function copyWithPrompt(text: string): Promise<boolean> {
  const success = await copyToClipboard(text);
  
  if (!success) {
    // Fallback: show prompt để user copy thủ công
    if (window.prompt) {
      window.prompt('Copy text bên dưới (Ctrl+C):', text);
      return true;
    }
  }
  
  return success;
} 