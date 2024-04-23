describe("CollectTheApplicationAndCreateExcelSheet", () => {
  it("POST Call", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:5000/companies/collectTheApplicationAndCreateExcelSheet/66253d1cc27eaeed676e1a82",
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "accesstoken__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI0MzY0ODgzMWRiMDRmODQzYWZkNjIiLCJpYXQiOjE3MTM2NDkzNDYsImV4cCI6MTcxMzczNTc0Nn0.CIGY4S5T90YmSkZ5Ocq1OaJqEuucR4rxuq3f1HvYq_c",
      },
    }).then((response) => {
      expect(response.headers).to.have.property(
        "content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      expect(response.status).to.eq(200);
    });
  });
});
