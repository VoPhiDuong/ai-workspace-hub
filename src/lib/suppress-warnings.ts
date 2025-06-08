// Suppress hydration warnings caused by browser extensions in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Hydration failed') ||
       args[0].includes('Text content does not match') ||
       args[0].includes('bis_skin_checked') ||
       args[0].includes('bis_register') ||
       args[0].includes('__processed_'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('validateDOMNesting') ||
       args[0].includes('Extra attributes from the server'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
} 