describe("Kuba Auth Test", () => {
    it("Should go to admin app & check the login component presence", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.get('#username').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.findByRole("button", { name: /SIGN IN/i }).should('be.visible')
    });

    it("Should enter bad credentials and be rejected", () => {
        cy.visit(Cypress.env("ADMIN_URL"));
        cy.get('#username').type('fake@user.com');
        cy.get('#password').type('fakePassword');
        cy.findByRole("button", { name: /SIGN IN/i }).click();
        cy.findByText('Unauthorized').should('be.visible');
    })

    it ("Should enter good credentials and access app", () => {
        cy.visit(Cypress.env("ADMIN_URL"));
        cy.get('#username').type('adm@mrmlb.com');
        cy.get('#password').type('1234');
        cy.findByRole("button", { name: /SIGN IN/i }).click();
        cy.findByRole("button", {"aria-label": /Profile/i}).should('be.visible')
    })
  
  });
  