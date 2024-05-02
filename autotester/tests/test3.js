describe('template spec', () => {
    beforeEach(()=>{cy.visit('http://localhost:3000/')})
    it('Testcase 1', () => {
      cy.get("[data-test='header-1']").contains(/This is first test Case/i);
    })
  })