describe("Kuba Admin Test", () => {
  it("Visits the Kuba Admin", () => {
    cy.visit(Cypress.env('ADMIN_URL'));
    cy.contains('User')
  });

  it("Post user with bad email and no password", () => {
    cy.visit(Cypress.env('ADMIN_URL'));
    cy.get('.RaButton-label-7').contains('Create').click();
    cy.contains('Create User');
    cy.get('#email');
    cy.get('#email').type('NotAnEmail');
    cy.get('#password');
    cy.get('.MuiButtonBase-root').contains('Save').click();
    cy.contains('Must be a valid email');
    cy.contains('Required');
    cy.contains('The form is not valid. Please check for errors');
  });

  it("Post user", () => {
    cy.visit(Cypress.env('ADMIN_URL'));
    cy.get('.RaButton-label-7').contains('Create').click();
    cy.contains('Create User');
    cy.get('#email');
    cy.get('#email').type(cy.faker.internet.email());
    cy.get('#password').type('password');
    cy.get('.MuiButtonBase-root').contains('Save').click();
    cy.contains('Element created');
  });

  it("Update user", () => {
    cy.visit(Cypress.env('ADMIN_URL'));
    cy.get('.column-id').first().click();
    cy.contains('User #');
    cy.get('#email');
    cy.get('#email').clear();
    cy.get('#email').type(cy.faker.internet.email());
    cy.get('.MuiButtonBase-root').contains('Save').click();
    cy.contains('Element updated');
  });

  it("Delete user", () => {
    cy.visit(Cypress.env('ADMIN_URL'));
    cy.get('.select-item').first().click();
    cy.get('.MuiButtonBase-root').contains('Delete').click();
    cy.contains('Element deleted');
  });
});
