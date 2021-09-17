describe("Kuba Admins Test", () => {
    it ("Should enter good credentials and access app", () => {
        cy.visit(Cypress.env("ADMIN_URL"));
        cy.get('#username').type('adm@mrmlb.com');
        cy.get('#password').type('1234');
        cy.findByRole("button", { name: /SIGN IN/i }).click();
        cy.findByRole("button", {"aria-label": /Profile/i}).should('be.visible')
    })

    describe("Admin creation", () => {
        it("Should Create a admin", ()=>{
            cy.get('[href="#/admins"]').click()
            cy.findByRole("button", { name: /Create/i }).click();
            cy.findByText("Create Admin").should("be.visible");
            cy.get("#email").should("be.visible");
            cy.get("#email").type("not a email");
            cy.findByRole("button", { name: /Save/i }).click();
            cy.findByText("Must be a valid email").should("be.visible");
            cy.get("#email").clear();
            cy.get("#email").type(cy.faker.internet.email());
            cy.get('#password').type('1234');
            cy.findByRole("button", { name: /Save/i }).click();
            cy.findByText('Element created').should('be.visible');
            cy.get('[href="#/user"]').click();
            cy.get('[href="#/admins"]').click();
        })
    })
  
  });