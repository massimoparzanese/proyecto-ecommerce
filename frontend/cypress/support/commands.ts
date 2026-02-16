Cypress.Commands.add(
  'loginProgrammatic',
  (email: string, role: 'user' | 'admin' = 'user') => {
    cy.visit('/');
    cy.window().then(win => {
      // Write a persisted redux state so app picks up session via redux-persist
      const auth = {
        user: { id: '', name: email.split('@')[0], role },
        token: null,
        isLoggedIn: true,
      };
      const root = { auth: JSON.stringify(auth) };
      win.localStorage.setItem('persist:root', JSON.stringify(root));
    });
  }
);

export {};
