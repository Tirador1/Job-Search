describe("SearchCompanyByNmae", () => {
  it("Search Company", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:5000/companies/searchCompanyByName/?companyName=R",
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "accesstoken__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI0MzY0ODgzMWRiMDRmODQzYWZkNjIiLCJpYXQiOjE3MTM2NDkzNDYsImV4cCI6MTcxMzczNTc0Nn0.CIGY4S5T90YmSkZ5Ocq1OaJqEuucR4rxuq3f1HvYq_c",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("success", true);
      expect(response.body).to.have.property(
        "message",
        "Companies retrieved successfully",
        "data"
      );
      expect(response.body.data).to.have.property("companies");
      cy.log(JSON.stringify(response.body));
    });
  });
});
