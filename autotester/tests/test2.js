describe('template spec', () => {
    beforeEach(()=>{cy.visit('http://localhost:3000/')})
    it('Testcase 1', () => {
      cy.get("[data-test='header-1']").contains(/This is first test Case/i);
    })
    it('Testcase 2', () => {
      cy.get("[data-test='header-2']").contains(/This is second test Case/i);
    })
  })