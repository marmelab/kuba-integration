describe("Kuba Admin Test", () => {

  it ("Should enter good credentials and access app", () => {
    cy.visit(Cypress.env("ADMIN_URL"));
    cy.get('#username').type('adm@mrmlb.com');
    cy.get('#password').type('1234');
    cy.findByRole("button", { name: /SIGN IN/i }).click();
    cy.findByRole("button", {"aria-label": /Profile/i}).should('be.visible')
})

  describe("Create user", () => {
    it("with bad email and no password should display error message", () => {
      cy.get('[href="#/user"]').click()
      cy.findByRole("button", { name: /Create/i }).click();
      cy.findByText("Create User").should("be.visible");
      cy.get("#email").should("be.visible");
      cy.get("#email").type("NotAnEmail");
      cy.get("#password").should("be.visible");
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Must be a valid email").should("be.visible");
      cy.findByText("Required").should("be.visible");
      cy.findByText("The form is not valid. Please check for errors").should(
        "be.visible"
      );
    });

    it("with good credentials should display a success message", () => {
      cy.get("#email").clear()
      cy.get("#email").type('adm@mrmlb.com');
      cy.get("#password").type("1234");
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Element created").should("be.visible");
    });
  });

  describe("Edit user", () => {
    it ("Should enter good credentials and access app", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.get('#username').type('adm@mrmlb.com');
      cy.get('#password').type('1234');
      cy.findByRole("button", { name: /SIGN IN/i }).click();
      cy.findByRole("button", {"aria-label": /Profile/i}).should('be.visible')
  })

    it("should display a success message", () => {
      cy.get('[href="#/user"]').click()
      cy.get('tr[resource="user"]').eq(0).get("td").eq(1).click();
      cy.findByText(/User #/).should("be.visible");
      cy.get("#email").should("be.visible");
      cy.get("#email").clear();
      cy.get("#email").type(cy.faker.internet.email());
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Element updated").should("be.visible");
    });
  });

  describe("Delete user", () => {

    it("with good credentials should display a success message", () => {
      cy.get("#email",  {timeout: 2000}).clear()
      cy.get("#email",).type('adm@mrmlb.com');
      cy.get("#password").type("1234");
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Element created").should("be.visible");
    });
    
    it("should display a success message", () => {
      cy.findAllByRole("checkbox").eq(1).click();
      cy.findByRole("button", { name: /Delete/i }).click();
      cy.findByText("Element deleted").should("be.visible");
    });
  });
});
