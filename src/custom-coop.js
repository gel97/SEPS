Object.defineProperty(window, 'closed', {
    get() {
      try {
        return window.opener === null || window.opener.closed;
      } catch (error) {
        return true;
      }
    }
  });