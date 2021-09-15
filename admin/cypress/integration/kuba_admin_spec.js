describe("Kuba Admin Test", () => {
  it("Visits the Kuba Admin", () => {
    cy.visit(Cypress.env("ADMIN_URL"));
    cy.contains("User");
  });

  describe("Create user", () => {
    it("with bad email and no password should display error message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
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
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.findByRole("button", { name: /Create/i }).click();
      cy.findByText("Create User").should("be.visible");
      cy.get("#email").should("be.visible");
      cy.get("#email").type(cy.faker.internet.email());
      cy.get("#password").type("password");
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Element created").should("be.visible");
    });
  });

  describe("Edit user", () => {
    it("should display a success message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
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
    it("should display a success message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.findAllByRole("checkbox").eq(1).click();
      cy.findByRole("button", { name: /Delete/i }).click();
      cy.findByText("Element deleted").should("be.visible");
    });
  });
});
