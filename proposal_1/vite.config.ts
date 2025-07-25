import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


/* 
replace version specifiers with just the package name
import { Slot } from "@radix-ui/react-slot@1.1.2";
to
import { Slot } from "@radix-ui/react-slot";
*/
const importRegex = /(['"])(.+?)@\d+\.[\d\.]+\s*\1\s*;?\s*(\r?\n)/g;

function removeVersionSpecifiers() {
  return {
    name: 'remove-version-specifiers',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return null

      const matches = Array.from(code.matchAll(importRegex));

      if (matches.length > 0) {

        let transformedCode = code;

        for (let i = matches.length - 1; i >= 0; i--) {
          const match = matches[i];
          const matchIndex = match.index!;
          const [matchStr, quote, packageName, newline] = match;
          transformedCode =
            transformedCode.slice(0, matchIndex) +
            `${quote}${packageName}${quote};${newline}` +
            transformedCode.slice(matchIndex + matchStr.length);
        }

        return {
          code: transformedCode,
          map: null
        }
      }

      return null;
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), removeVersionSpecifiers()],
})

