/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

describe("test", () => {
  describe("Petstore", () => {
    it("loads Petstore page", () => {
      cy.visit("/petstore");
      navTo(
        [/^pet$/i, /add a new pet to the store/i],
        /add a new pet to the store/i
      );
    });

    it("renders authentication header fields", () => {
      cy.visit("/petstore/find-pet-by-id");
      cy.findByRole("button", { name: /authorize/i })
        .should("exist")
        .click();
      cy.get('input[placeholder="api_key"]').should("exist");
    });
  });

  it("loads Cloud Object Storage page", () => {
    cy.visit("/cos");
    navTo([], /generating an iam token/i);
  });

  it("loads a page with authentication", () => {
    cy.visit("/cos/list-buckets");
    cy.findByRole("button", { name: /authorize/i }).should("exist");

    cy.visit("/cos/create-a-bucket");
    cy.findByRole("button", { name: /authorize/i }).should("exist");
  });
});

/**
 * Navigate to page using the sidebar
 */
function navTo(links: RegExp[], heading: RegExp) {
  cy.on("uncaught:exception", () => {
    // there is an uncaught error trying to load monaco in ci
    return false;
  });

  links.forEach((linkRegex) => {
    cy.get("nav.menu").then(($menu) => {
      const navElement = $menu
        .find("a")
        .toArray()
        .find((el) => linkRegex.test(el.innerText));
      if (navElement) {
        cy.wrap(navElement).click({ force: true });
      } else {
        cy.log(`No link or button found matching regex: ${linkRegex}`);
      }
    });
  });

  cy.findByRole("heading", { name: heading, level: 1 }).should("exist");
}
