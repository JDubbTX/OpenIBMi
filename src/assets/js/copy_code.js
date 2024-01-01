(() => {
    const code = document.querySelectorAll('pre[class*="language"]');
  
    const buttonClasses = [
      'absolute',
      'right-4',
      'top-4',
      'border',
      'rounded-md',
      'p-2',
      'bg-white/80',
      'hover:bg-white',
      'text-slate-800',
      'hover:text-slate-900',
      'opacity-0',
      'group-hover/code:opacity-100',
      'transition-opacity',
      'transition-colors',
    ];

    const codeClasses = [
      'absolute',
      'top',
      'left'
    ];
  
    code.forEach((pre) => {
      pre.classList.add('relative');
  
      const button = document.createElement('button');
      button.classList.add(...buttonClasses);
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  
      button.addEventListener('click', () => {
        navigator.clipboard.writeText(pre.textContent);
      });

      pre.appendChild(button);
      
    });
  })();