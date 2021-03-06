// Sidebar_test_live
describe('Sidebar individual component test', () => {
  it('Collapse button works', () => {
    cy.visit('localhost:3000');
    cy.contains('Collapse').click();
  });

  it('Expand button works', () => {
    cy.contains('Expand').click();
  });

  it('Sign up button works', () => {
    cy.contains('Sign Up').click().should('have.attr', 'href', '/register');
  });

  it('Login button works', () => {
    cy.contains('Login').click().should('have.attr', 'href', '/login');
  });

  it('Help button works', () => {
    cy.contains('Help').click().should('have.attr', 'href', '/help');
  });

  it('Reset password button works', () => {
    cy.contains('Reset')
      .click()
      .should('have.attr', 'href', '/reset-password');
  });
});
