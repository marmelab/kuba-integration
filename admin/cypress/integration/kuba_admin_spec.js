describe("Kuba Admin Test", () => {
  it("Visits the Kuba Admin", () => {
    cy.visit(Cypress.env("ADMIN_URL"));
    cy.contains("User");
  });

  describe("Create user", () => {
    it("with bad email and no password should display error message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.findByRole("button", { name: /Create/i }).click();
      cy.findByText("Create User").should("exist");
      cy.get("#email").should("exist");
      cy.get("#email").type("NotAnEmail");
      cy.get("#password").should("exist");
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Must be a valid email").should("exist");
      cy.findByText("Required").should("exist");
      cy.findByText("The form is not valid. Please check for errors").should(
        "exist"
      );
    });

    it("with good credentials should display a success message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.findByRole("button", { name: /Create/i }).click();
      cy.findByText("Create User").should("exist");
      cy.get("#email").should("exist");
      cy.get("#email").type(cy.faker.internet.email());
      cy.get("#password").type("password");
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Element created").should("exist");
    });
  });

  describe("Edit user", () => {
    it("should display a success message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.get('tr[resource="user"]').eq(0).get("td").eq(1).click();
      cy.findByText(/User #/).should("exist");
      cy.get("#email").should("exist");
      cy.get("#email").clear();
      cy.get("#email").type(cy.faker.internet.email());
      cy.findByRole("button", { name: /Save/i }).click();
      cy.findByText("Element updated").should("exist");
    });
  });

  describe("Delete user", () => {
    it("should display a success message", () => {
      cy.visit(Cypress.env("ADMIN_URL"));
      cy.findAllByRole("checkbox").eq(1).click();
      cy.findByRole("button", { name: /Delete/i }).click();
      cy.findByText("Element deleted").should("exist");
    });
  });
});
